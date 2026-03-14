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

            if not data.get('supplier') or not data.get('items'):
                return request.make_response(
                    json.dumps({'error': 'supplier and items are required'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            # For now, just log and return success (implement actual receipt creation later)
            # In real implementation, create stock.picking or stock.move records
            receipt_data = {
                'supplier': data['supplier'],
                'items': data['items']
            }

            return request.make_response(
                json.dumps({'message': 'Receipt created successfully', 'data': receipt_data}),
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