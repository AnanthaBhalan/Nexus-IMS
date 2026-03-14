from odoo import http
from odoo.http import request
import json


class NexusApiController(http.Controller):
    def _parse_json(self):
        """Parse JSON request body with a best-effort fallback for loose formats."""
        try:
            return request.jsonrequest or {}
        except Exception:
            raw = request.httprequest.get_data(as_text=True) or ''
            try:
                return json.loads(raw)
            except Exception:
                # Try forgiving single-quotes / sloppy JSON (e.g., from PowerShell)
                try:
                    return json.loads(raw.replace("'", '"'))
                except Exception:
                    return {}


    @http.route('/api/dashboard', type='http', auth='public', csrf=False, cors='*', methods=['GET'])
    def get_dashboard(self):
        """Get dashboard KPIs"""
        try:
            total_products = request.env['product.product'].sudo().search_count([])
            low_stock_count = request.env['product.product'].sudo().search_count([('qty_available', '<', 10)])

            kpis = {
                'total_products': total_products,
                'low_stock_alerts': low_stock_count,
                'pending_receipts': 8,
                'pending_deliveries': 23,
            }
            return request.make_response(json.dumps(kpis), headers=[('Content-Type', 'application/json')])
        except Exception as e:
            return request.make_response(json.dumps({'error': str(e)}), status=500, headers=[('Content-Type', 'application/json')])

    @http.route('/api/products', type='http', auth='public', csrf=False, cors='*', methods=['GET'])
    def get_products(self):
        try:
            products = request.env['product.product'].sudo().search([])
            product_list = []
            for product in products:
                product_list.append({
                    'id': product.id,
                    'name': product.name,
                    'sku': product.default_code or '',
                    'category': product.categ_id.name if product.categ_id else '',
                    'stock_available': product.qty_available,
                })
            return request.make_response(json.dumps(product_list), headers=[('Content-Type', 'application/json')])
        except Exception as e:
            return request.make_response(json.dumps({'error': str(e)}), status=500, headers=[('Content-Type', 'application/json')])

    @http.route('/api/receipts', type='http', auth='public', csrf=False, cors='*', methods=['POST'])
    def create_receipt(self):
        """Create receipt and increase stock"""
        try:
            data = self._parse_json()

            # Normalize input fields to match API contract
            supplier_name = data.get('supplier') or 'API Supplier'
            items = data.get('items') or []

            if not isinstance(items, list) or len(items) == 0:
                return request.make_response(
                    json.dumps({'error': 'items array is required'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            env = request.env.sudo()

            # Find or create partner
            partner = env['res.partner'].search([('name', '=', supplier_name)], limit=1)
            if not partner:
                partner = env['res.partner'].create({'name': supplier_name})

            warehouse = env['stock.warehouse'].search([], limit=1)
            if not warehouse:
                return request.make_response(
                    json.dumps({'error': 'No warehouse configured'}),
                    status=500,
                    headers=[('Content-Type', 'application/json')]
                )

            picking_vals = {
                'partner_id': partner.id,
                'picking_type_id': warehouse.in_type_id.id,
                'location_id': partner.property_stock_supplier.id,
                'location_dest_id': warehouse.lot_stock_id.id,
                'origin': f'Receipt from {supplier_name}',
            }
            picking = env['stock.picking'].create(picking_vals)

            # Allow product lookup by id or SKU (default_code)
            product_ids = [item.get('product_id') for item in items if item.get('product_id')]
            skus = [item.get('sku') for item in items if item.get('sku')]

            products = env['product.product'].browse(product_ids)
            if skus:
                products |= env['product.product'].search([('default_code', 'in', skus)])

            missing = []
            for item in items:
                product_id = item.get('product_id')
                sku = item.get('sku')
                if product_id and env['product.product'].browse(product_id).exists():
                    continue
                if sku and env['product.product'].search([('default_code', '=', sku)], limit=1).exists():
                    continue
                missing.append(product_id or sku)

            if missing:
                return request.make_response(
                    json.dumps({'error': f'Products not found: {missing}'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            for item in items:
                product_id = item.get('product_id')
                sku = item.get('sku')
                qty = item.get('quantity_received') or item.get('quantity')
                if not qty or (not product_id and not sku):
                    continue

                if product_id:
                    product = env['product.product'].browse(product_id)
                else:
                    product = env['product.product'].search([('default_code', '=', sku)], limit=1)

                move_vals = {
                    'picking_id': picking.id,
                    'product_id': product.id,
                    'product_uom_qty': qty,
                    'product_uom': product.uom_id.id,
                    'location_id': partner.property_stock_supplier.id,
                    'location_dest_id': warehouse.lot_stock_id.id,
                    'name': product.name,
                }
                env['stock.move'].create(move_vals)

            picking.action_confirm()
            picking.button_validate()

            return request.make_response(
                json.dumps({'message': 'Receipt created successfully', 'picking_id': picking.id}),
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
        """Create delivery and decrease stock"""
        try:
            data = self._parse_json()

            supplier_name = data.get('supplier') or 'API Customer'
            items = data.get('items') or []

            if not isinstance(items, list) or len(items) == 0:
                return request.make_response(
                    json.dumps({'error': 'items array is required'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            env = request.env.sudo()

            partner = env['res.partner'].search([('name', '=', supplier_name)], limit=1)
            if not partner:
                partner = env['res.partner'].create({'name': supplier_name})

            warehouse = env['stock.warehouse'].search([], limit=1)
            if not warehouse:
                return request.make_response(
                    json.dumps({'error': 'No warehouse configured'}),
                    status=500,
                    headers=[('Content-Type', 'application/json')]
                )

            picking_vals = {
                'partner_id': partner.id,
                'picking_type_id': warehouse.out_type_id.id,
                'location_id': warehouse.lot_stock_id.id,
                'location_dest_id': partner.property_stock_customer.id,
                'origin': f'Delivery to {supplier_name}',
            }
            picking = env['stock.picking'].create(picking_vals)

            # Allow product lookup by id or SKU (default_code)
            product_ids = [item.get('product_id') for item in items if item.get('product_id')]
            skus = [item.get('sku') for item in items if item.get('sku')]

            products = env['product.product'].browse(product_ids)
            if skus:
                products |= env['product.product'].search([('default_code', 'in', skus)])

            missing = []
            for item in items:
                product_id = item.get('product_id')
                sku = item.get('sku')
                if product_id and env['product.product'].browse(product_id).exists():
                    continue
                if sku and env['product.product'].search([('default_code', '=', sku)], limit=1).exists():
                    continue
                missing.append(product_id or sku)

            if missing:
                return request.make_response(
                    json.dumps({'error': f'Products not found: {missing}'}),
                    status=400,
                    headers=[('Content-Type', 'application/json')]
                )

            for item in items:
                product_id = item.get('product_id')
                sku = item.get('sku')
                qty = item.get('quantity_received') or item.get('quantity')
                if not qty or (not product_id and not sku):
                    continue

                if product_id:
                    product = env['product.product'].browse(product_id)
                else:
                    product = env['product.product'].search([('default_code', '=', sku)], limit=1)

                move_vals = {
                    'picking_id': picking.id,
                    'product_id': product.id,
                    'product_uom_qty': qty,
                    'product_uom': product.uom_id.id,
                    'location_id': warehouse.lot_stock_id.id,
                    'location_dest_id': partner.property_stock_customer.id,
                    'name': product.name,
                }

                env['stock.move'].create(move_vals)

            picking.action_confirm()
            picking.button_validate()

            return request.make_response(
                json.dumps({
                    'message': 'Delivery created successfully',
                    'picking_id': picking.id
                }),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({'error': str(e)}),
                status=500,
                headers=[('Content-Type', 'application/json')]
            )