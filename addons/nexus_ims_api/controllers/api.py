from odoo import http
from odoo.http import request
import json

class NexusApiController(http.Controller):

    @http.route('/api/dashboard', type='http', auth='public', csrf=False, cors='*', methods=['GET'])
    def get_dashboard(self):
        """Get dashboard KPIs: Total products, low stock count"""
        try:
            # Total products
            total_products = request.env['product.product'].search_count([])

            # Low stock count: products with qty_available < 10
            # (qty_available is computed by Odoo from stock.quant)
            low_stock_products = request.env['product.product'].search([('qty_available', '<', 10)])
            low_stock_count = len(low_stock_products)

            # Mock other KPIs for now, as per API_CONTRACT
            kpis = {
                'total_products': total_products,
                'low_stock_alerts': low_stock_count,
                'pending_receipts': 8,  # Mock
                'pending_deliveries': 23,  # Mock
            }

            return request.make_response(
                json.dumps(kpis),
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'error': str(e)}),
                status=500,
                headers=[('Content-Type', 'application/json')]
            )

    @http.route('/api/products', type='http', auth='public', csrf=False, cors='*', methods=['GET'])
    def get_products(self):
        """Get products with real-time stock quantities"""
        try:
            products = request.env['product.product'].search([])

            product_list = []
            for product in products:
                # Get stock from stock.quant (real-time)
                quants = request.env['stock.quant'].search([
                    ('product_id', '=', product.id),
                    ('location_id.usage', '=', 'internal')
                ])
                stock_available = sum(quant.qty for quant in quants)

                product_data = {
                    'id': product.id,
                    'name': product.name,
                    'sku': product.default_code or '',
                    'category': product.categ_id.name if product.categ_id else '',
                    'uom': product.uom_id.name if product.uom_id else '',
                    'stock_available': stock_available,
                }
                product_list.append(product_data)

            return request.make_response(
                json.dumps(product_list),
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'error': str(e)}),
                status=500,
                headers=[('Content-Type', 'application/json')]
            )

    @http.route('/api/receipts', type='http', auth='public', csrf=False, cors='*', methods=['POST'])
    def create_receipt(self):
        """Create a new receipt when items arrive from vendors"""
        try:
            data = json.loads(request.httprequest.data.decode('utf-8'))

            if not data.get('supplier') or not data.get('items') or not isinstance(data['items'], list):
                return request.make_response(
                    json.dumps({'error': 'supplier and items array are required'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            # Find or create partner
            partner = request.env['res.partner'].search([('name', '=', data['supplier'])], limit=1)
            if not partner:
                partner = request.env['res.partner'].create({'name': data['supplier']})

            # Get default warehouse
            warehouse = request.env['stock.warehouse'].search([], limit=1)
            if not warehouse:
                return request.make_response(
                    json.dumps({'error': 'No warehouse configured'}),
                    status=500,
                    headers=[('Content-Type', 'application/json')]
                )

            # Create stock.picking for receipt (incoming)
            picking_vals = {
                'partner_id': partner.id,
                'picking_type_id': warehouse.in_type_id.id,  # Incoming type
                'location_id': partner.property_stock_supplier.id,  # Supplier location
                'location_dest_id': warehouse.lot_stock_id.id,  # Stock location
                'origin': f'Receipt from {data["supplier"]}',
            }
            picking = request.env['stock.picking'].create(picking_vals)

            # Create stock.move lines
            for item in data['items']:
                if not item.get('product_id') or not item.get('quantity_received'):
                    continue  # Skip invalid items
                product = request.env['product.product'].browse(item['product_id'])
                if not product:
                    continue
                move_vals = {
                    'picking_id': picking.id,
                    'product_id': product.id,
                    'product_uom_qty': item['quantity_received'],
                    'product_uom': product.uom_id.id,
                    'location_id': partner.property_stock_supplier.id,
                    'location_dest_id': warehouse.lot_stock_id.id,
                    'name': product.name,
                }
                request.env['stock.move'].create(move_vals)

            # Confirm and validate the picking
            picking.action_confirm()
            picking.button_validate()

            return request.make_response(
                json.dumps({'message': 'Receipt created and processed successfully', 'picking_id': picking.id}),
                headers=[('Content-Type', 'application/json')]
            )
        except json.JSONDecodeError:
            return request.make_response(
                json.dumps({'error': 'Invalid JSON'}),
                status=400,
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'error': str(e)}),
                status=500,
                headers=[('Content-Type', 'application/json')]
            )

    @http.route('/api/deliveries', type='http', auth='public', csrf=False, cors='*', methods=['POST'])
    def create_delivery(self):
        """Create a new delivery (exact same process as receipts, but decreasing stock)"""
        try:
            data = json.loads(request.httprequest.data.decode('utf-8'))

            if not data.get('supplier') or not data.get('items') or not isinstance(data['items'], list):
                return request.make_response(
                    json.dumps({'error': 'supplier and items array are required'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            # Find or create partner (treating supplier as customer for deliveries)
            partner = request.env['res.partner'].search([('name', '=', data['supplier'])], limit=1)
            if not partner:
                partner = request.env['res.partner'].create({'name': data['supplier']})

            # Get default warehouse
            warehouse = request.env['stock.warehouse'].search([], limit=1)
            if not warehouse:
                return request.make_response(
                    json.dumps({'error': 'No warehouse configured'}),
                    status=500,
                    headers=[('Content-Type', 'application/json')]
                )

            # Create stock.picking for delivery (outgoing)
            picking_vals = {
                'partner_id': partner.id,
                'picking_type_id': warehouse.out_type_id.id,  # Outgoing type
                'location_id': warehouse.lot_stock_id.id,  # Stock location
                'location_dest_id': partner.property_stock_customer.id,  # Customer location
                'origin': f'Delivery to {data["supplier"]}',
            }
            picking = request.env['stock.picking'].create(picking_vals)

            # Create stock.move lines
            for item in data['items']:
                if not item.get('product_id') or not item.get('quantity_received'):
                    continue  # Skip invalid items
                product = request.env['product.product'].browse(item['product_id'])
                if not product:
                    continue
                move_vals = {
                    'picking_id': picking.id,
                    'product_id': product.id,
                    'product_uom_qty': item['quantity_received'],
                    'product_uom': product.uom_id.id,
                    'location_id': warehouse.lot_stock_id.id,
                    'location_dest_id': partner.property_stock_customer.id,
                    'name': product.name,
                }
                request.env['stock.move'].create(move_vals)

            # Confirm and validate the picking
            picking.action_confirm()
            picking.button_validate()

            return request.make_response(
                json.dumps({'message': 'Delivery created and processed successfully', 'picking_id': picking.id}),
                headers=[('Content-Type', 'application/json')]
            )
        except json.JSONDecodeError:
            return request.make_response(
                json.dumps({'error': 'Invalid JSON'}),
                status=400,
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'error': str(e)}),
                status=500,
                headers=[('Content-Type', 'application/json')]
            )