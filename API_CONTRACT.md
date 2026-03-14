# API Contract

## 1. GET /api/products
Used to populate the dashboard and product lists.

```json
[
  {
    "id": 1,
    "name": "Steel Rods",
    "sku": "STL-01",
    "category": "Raw Materials",
    "uom": "kg",
    "stock_available": 150
  }
]
```

## 2. POST /api/receipts
Used when items arrive from vendors.

```json
{
  "supplier": "Vendor A",
  "items": [
    {
      "product_id": 1,
      "quantity_received": 50
    }
  ]
}
```
