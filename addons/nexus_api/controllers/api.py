from odoo import http
from odoo.http import request

class NexusAPI(http.Controller):

    @http.route('/api/products', type='json', auth='public', methods=['GET'])
    def get_products(self):
        products = request.env['nexus.product'].sudo().search([])
        result = []

        for p in products:
            result.append({
                "id": p.id,
                "name": p.name,
                "quantity": p.quantity
            })

        return result