-- ==========================================
-- CRM MANAGEMENT SYSTEM DATABASE SCHEMA (5NF)
-- Target Database: MySQL 8.0
-- ==========================================

-- CREATE DATABASE IF NOT EXISTS crm_management_system
--   CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;

-- USE crm_management_system;

-- Disable foreign key checks to allow clean drop/recreate of tables if needed
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- Table `customer_statuses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS customer_statuses;
CREATE TABLE customer_statuses (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_cust_status_name (name)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `customers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    id INT UNSIGNED AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    status_id INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_customer_email (email),
    CONSTRAINT fk_customers_status
      FOREIGN KEY (status_id)
      REFERENCES customer_statuses (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `customer_addresses`
-- -----------------------------------------------------
-- Splitting addresses into a separate table handles the multi-valued dependency (Multiple Addresses) and normalizes to 4NF/5NF.
DROP TABLE IF EXISTS customer_addresses;
CREATE TABLE customer_addresses (
    id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT fk_addresses_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `customer_phones`
-- -----------------------------------------------------
-- Handles the multi-valued dependency of multiple contact numbers.
DROP TABLE IF EXISTS customer_phones;
CREATE TABLE customer_phones (
    id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    type ENUM('mobile', 'work', 'home', 'other') DEFAULT 'mobile',
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id),
    CONSTRAINT fk_phones_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `customer_preferences`
-- -----------------------------------------------------
-- Separating preferences ensures we don't have null-heavy customer records, separating interests.
DROP TABLE IF EXISTS customer_preferences;
CREATE TABLE customer_preferences (
    customer_id INT UNSIGNED NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    newsletter_opt_in BOOLEAN DEFAULT TRUE,
    marketing_opt_in BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (customer_id),
    CONSTRAINT fk_preferences_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `roles`
-- -----------------------------------------------------
DROP TABLE IF EXISTS roles;
CREATE TABLE roles (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_role_name (name)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `permissions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS permissions;
CREATE TABLE permissions (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_permission_name (name)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `role_permissions` (5NF Junction Table)
-- -----------------------------------------------------
DROP TABLE IF EXISTS role_permissions;
CREATE TABLE role_permissions (
    role_id INT UNSIGNED NOT NULL,
    permission_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_rp_role
      FOREIGN KEY (role_id)
      REFERENCES roles (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_rp_permission
      FOREIGN KEY (permission_id)
      REFERENCES permissions (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `employees`
-- -----------------------------------------------------
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
    id INT UNSIGNED AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_employee_email (email),
    CONSTRAINT fk_employees_role
      FOREIGN KEY (role_id)
      REFERENCES roles (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `lead_sources`
-- -----------------------------------------------------
DROP TABLE IF EXISTS lead_sources;
CREATE TABLE lead_sources (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_lead_source_name (name)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `lead_statuses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS lead_statuses;
CREATE TABLE lead_statuses (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_lead_status_name (name)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `leads`
-- -----------------------------------------------------
DROP TABLE IF EXISTS leads;
CREATE TABLE leads (
    id INT UNSIGNED AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description TEXT NULL,
    source_id INT UNSIGNED NOT NULL,
    status_id INT UNSIGNED NOT NULL,
    assigned_to_id INT UNSIGNED NULL,
    customer_id INT UNSIGNED NULL, -- Stores converted customer reference
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_leads_source
      FOREIGN KEY (source_id)
      REFERENCES lead_sources (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
    CONSTRAINT fk_leads_status
      FOREIGN KEY (status_id)
      REFERENCES lead_statuses (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
    CONSTRAINT fk_leads_employee
      FOREIGN KEY (assigned_to_id)
      REFERENCES employees (id)
      ON DELETE SET NULL
      ON UPDATE CASCADE,
    CONSTRAINT fk_leads_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `product_categories`
-- -----------------------------------------------------
DROP TABLE IF EXISTS product_categories;
CREATE TABLE product_categories (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_category_name (name)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `products`
-- -----------------------------------------------------
DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id INT UNSIGNED AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    sku VARCHAR(50) NOT NULL,
    description TEXT NULL,
    category_id INT UNSIGNED NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE INDEX idx_product_sku (sku),
    CONSTRAINT fk_products_category
      FOREIGN KEY (category_id)
      REFERENCES product_categories (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `opportunities`
-- -----------------------------------------------------
DROP TABLE IF EXISTS opportunities;
CREATE TABLE opportunities (
    id INT UNSIGNED AUTO_INCREMENT,
    lead_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    stage ENUM('Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost') DEFAULT 'Prospecting',
    expected_close DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_opportunities_lead
      FOREIGN KEY (lead_id)
      REFERENCES leads (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_opportunities_product
      FOREIGN KEY (product_id)
      REFERENCES products (id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `tickets`
-- -----------------------------------------------------
DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets (
    id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    assigned_to_id INT UNSIGNED NULL,
    priority ENUM('Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_tickets_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_tickets_employee
      FOREIGN KEY (assigned_to_id)
      REFERENCES employees (id)
      ON DELETE SET NULL
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `customer_interactions`
-- -----------------------------------------------------
DROP TABLE IF EXISTS customer_interactions;
CREATE TABLE customer_interactions (
    id INT UNSIGNED AUTO_INCREMENT,
    customer_id INT UNSIGNED NOT NULL,
    employee_id INT UNSIGNED NOT NULL,
    type ENUM('Call', 'Email', 'Meeting', 'Note', 'Follow-up') NOT NULL,
    notes TEXT NOT NULL,
    interacted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_interactions_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_interactions_employee
      FOREIGN KEY (employee_id)
      REFERENCES employees (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `customer_products` (5NF Junction Table)
-- -----------------------------------------------------
DROP TABLE IF EXISTS customer_products;
CREATE TABLE customer_products (
    customer_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (customer_id, product_id),
    CONSTRAINT fk_cp_customer
      FOREIGN KEY (customer_id)
      REFERENCES customers (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT fk_cp_product
      FOREIGN KEY (product_id)
      REFERENCES products (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `audit_log` (System / Compliance)
-- -----------------------------------------------------
DROP TABLE IF EXISTS audit_log;
CREATE TABLE audit_log (
    id BIGINT UNSIGNED AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT UNSIGNED NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    performed_by_email VARCHAR(150) NULL,
    performed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX idx_leads_status ON leads (status_id);
CREATE INDEX idx_opportunities_stage ON opportunities (stage);
CREATE INDEX idx_tickets_status ON tickets (status);
CREATE INDEX idx_interactions_interacted_at ON customer_interactions (interacted_at);
CREATE INDEX idx_customers_name ON customers (last_name, first_name);

-- =====================================================
-- VIEWS FOR REPORTING & DASHBOARDS
-- =====================================================

-- 1. Monthly Revenue View (Revenue Forecast)
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
    DATE_FORMAT(expected_close, '%Y-%m') AS month,
    SUM(amount) AS projected_revenue,
    COUNT(*) AS deal_count
FROM opportunities
WHERE stage = 'Closed Won' OR stage = 'Negotiation'
GROUP BY DATE_FORMAT(expected_close, '%Y-%m')
ORDER BY month ASC;

-- 2. Customer Growth View
CREATE OR REPLACE VIEW v_customer_growth AS
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') AS month,
    COUNT(*) AS new_customers
FROM customers
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month ASC;

-- 3. Lead Conversion View
CREATE OR REPLACE VIEW v_lead_conversion AS
SELECT 
    ls.name AS source,
    COUNT(l.id) AS total_leads,
    SUM(CASE WHEN l.customer_id IS NOT NULL THEN 1 ELSE 0 END) AS converted_leads,
    (SUM(CASE WHEN l.customer_id IS NOT NULL THEN 1 ELSE 0 END) / COUNT(l.id)) * 100 AS conversion_rate
FROM leads l
JOIN lead_sources ls ON l.source_id = ls.id
GROUP BY ls.id;

-- 4. Ticket Resolution View
CREATE OR REPLACE VIEW v_ticket_resolution AS
SELECT 
    priority,
    COUNT(*) AS total_tickets,
    SUM(CASE WHEN status = 'Resolved' OR status = 'Closed' THEN 1 ELSE 0 END) AS resolved_tickets,
    (SUM(CASE WHEN status = 'Resolved' OR status = 'Closed' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS resolution_rate
FROM tickets
GROUP BY priority;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- 1. Procedure to Convert Lead to Customer
DELIMITER $$
DROP PROCEDURE IF EXISTS sp_convert_lead_to_customer;
CREATE PROCEDURE sp_convert_lead_to_customer(
    IN p_lead_id INT UNSIGNED,
    IN p_first_name VARCHAR(100),
    IN p_last_name VARCHAR(100),
    IN p_email VARCHAR(150),
    IN p_password_hash VARCHAR(255),
    IN p_status_id INT UNSIGNED,
    OUT p_customer_id INT UNSIGNED
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Lead conversion failed.';
    END;

    START TRANSACTION;
        -- Insert new customer record
        INSERT INTO customers (first_name, last_name, email, password_hash, status_id)
        VALUES (p_first_name, p_last_name, p_email, p_password_hash, p_status_id);
        
        SET p_customer_id = LAST_INSERT_ID();
        
        -- Update lead record with customer ID and set status to 'Converted'
        UPDATE leads 
        SET customer_id = p_customer_id, 
            status_id = (SELECT id FROM lead_statuses WHERE name = 'Converted' LIMIT 1)
        WHERE id = p_lead_id;
        
    COMMIT;
END$$
DELIMITER ;

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- 1. Function to count open tickets for a customer
DELIMITER $$
DROP FUNCTION IF EXISTS fn_count_open_tickets;
CREATE FUNCTION fn_count_open_tickets(p_customer_id INT UNSIGNED) 
RETURNS INT UNSIGNED
READS SQL DATA
BEGIN
    DECLARE v_count INT UNSIGNED;
    SELECT COUNT(*) INTO v_count
    FROM tickets
    WHERE customer_id = p_customer_id AND status IN ('Open', 'In Progress');
    RETURN v_count;
END$$
DELIMITER ;

-- =====================================================
-- TRIGGERS FOR AUDIT LOGGING
-- =====================================================

DELIMITER $$

DROP TRIGGER IF EXISTS trg_customers_after_insert;
CREATE TRIGGER trg_customers_after_insert
AFTER INSERT ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, performed_by_email)
    VALUES ('customers', NEW.id, 'INSERT', NEW.email);
END$$

DROP TRIGGER IF EXISTS trg_customers_after_update;
CREATE TRIGGER trg_customers_after_update
AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, performed_by_email)
    VALUES ('customers', NEW.id, 'UPDATE', NEW.email);
END$$

DROP TRIGGER IF EXISTS trg_customers_after_delete;
CREATE TRIGGER trg_customers_after_delete
AFTER DELETE ON customers
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, performed_by_email)
    VALUES ('customers', OLD.id, 'DELETE', OLD.email);
END$$

DELIMITER ;
