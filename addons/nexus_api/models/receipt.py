from odoo import models, fields

class Receipt(models.Model):
    _name = "nexus.receipt"
    _description = "Receipt"

    product_id = fields.Many2one("nexus.product", string="Product")
    quantity = fields.Integer(string="Received Quantity")