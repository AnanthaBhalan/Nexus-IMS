from odoo import models, fields

class Delivery(models.Model):
    _name = "nexus.delivery"
    _description = "Delivery"

    product_id = fields.Many2one("nexus.product", string="Product")
    quantity = fields.Integer(string="Delivered Quantity")