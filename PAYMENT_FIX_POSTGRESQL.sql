-- ============================================================
-- IMMEDIATE FIX: Run this SQL directly on your PostgreSQL database
-- ============================================================

-- For PostgreSQL ONLY (your production database):
ALTER TABLE customer_orders 
ALTER COLUMN due_amount TYPE NUMERIC(10, 2) USING due_amount::NUMERIC;

-- This changes the column from INTEGER to DECIMAL(10,2)
-- which allows values like 0.01, 1.50, 99.99, etc.

-- Verify the fix:
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'customer_orders' AND column_name = 'due_amount';

-- ============================================================
-- ALTERNATIVE: If you need to preserve existing data:
-- ============================================================

-- Check current data before migration:
SELECT order_id, customer_id, due_amount 
FROM customer_orders 
WHERE due_amount > 0 
ORDER BY order_id DESC LIMIT 5;

-- Convert with data preservation (dividing INT values by 100):
ALTER TABLE customer_orders 
ALTER COLUMN due_amount TYPE NUMERIC(10, 2) USING (due_amount::NUMERIC / 100);

-- If your INT values were already in cents (100 = $1.00), 
-- use the division above. If they were in dollars (100 = $100), 
-- use the simple type conversion above.
