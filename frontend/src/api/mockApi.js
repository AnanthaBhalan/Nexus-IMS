// Mock API utilities returning hardcoded JSON that matches API_CONTRACT.md

export const getProducts = async () => {
  return [
    {
      id: 1,
      name: "Steel Rods",
      sku: "STL-01",
      category: "Raw Materials",
      uom: "kg",
      stock_available: 150,
    },
  ];
};

export const postReceipts = async () => {
  return {
    supplier: "Vendor A",
    items: [
      {
        product_id: 1,
        quantity_received: 50,
      },
    ],
  };
};
