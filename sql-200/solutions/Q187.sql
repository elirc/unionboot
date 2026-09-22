UPDATE products SET price=price+? WHERE id=? RETURNING id,price;
