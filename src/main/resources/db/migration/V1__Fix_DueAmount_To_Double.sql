-- Migration: Fix due_amount column to support decimal amounts
-- Purpose: Change due_amount from INT to DECIMAL to support micro-payments (e.g., $0.01)
-- Date: 2026-08-16

-- For PostgreSQL: Alter column type to NUMERIC (equivalent to DECIMAL)
-- If using PostgreSQL, use this:
-- ALTER TABLE customer_orders 
-- ALTER COLUMN due_amount TYPE NUMERIC(10, 2) USING due_amount::NUMERIC;

-- For MySQL: Modify column type to DECIMAL
-- If using MySQL, use this:
ALTER TABLE customer_orders 
MODIFY COLUMN due_amount DECIMAL(10, 2) NOT NULL;

-- Alternative for PostgreSQL with explicit schema handling:
-- DO $$ 
-- BEGIN 
--   IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='customer_orders') THEN
--     ALTER TABLE customer_orders ALTER COLUMN due_amount TYPE NUMERIC(10, 2);
--   END IF;
-- END $$;

-- Verify the change:
-- DESCRIBE customer_orders;  -- for MySQL
-- \d customer_orders;        -- for PostgreSQL
