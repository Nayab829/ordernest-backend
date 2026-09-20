CREATE INDEX idx_order_business_created 
ON "Order" ("businessId", "createdAt")
WHERE status != 'CANCELLED';

CREATE INDEX idx_orderitem_orderid
ON "OrderItem" ("orderId");