from odoo import models, fields

class Product(models.Model):
    _name = "nexus.product"
    _description = "Product"

    name = fields.Char(string="Product Name")
    quantity = fields.Integer(string="Quantity")