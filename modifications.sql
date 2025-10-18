UPDATE Inventory
SET quantity = quantity + 50
WHERE product_id = (SELECT product_id FROM Products WHERE product_name = 'Product Y')
  AND warehouse_id = (SELECT warehouse_id FROM Warehouses WHERE warehouse_name = 'Warehouse Z');


UPDATE Orders
SET status = 'Shipped'
WHERE order_id = 101; 

UPDATE Inventory i
JOIN Order_Items oi ON i.product_id = oi.product_id
SET i.quantity = i.quantity - oi.quantity
WHERE oi.order_id = 101;


DELETE FROM Reviews
WHERE review_id = 205;  
