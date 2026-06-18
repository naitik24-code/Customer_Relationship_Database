-- =====================================================
-- CRM MANAGEMENT SYSTEM SAMPLE DATA SEED
-- Target Database: MySQL 8.0
-- Ensures at least 20 records per primary table
-- =====================================================

-- USE crm_management_system;

-- Disable foreign key checks to avoid ordering issues during insert
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate existing data to start clean
TRUNCATE TABLE audit_log;
TRUNCATE TABLE customer_products;
TRUNCATE TABLE customer_interactions;
TRUNCATE TABLE tickets;
TRUNCATE TABLE opportunities;
TRUNCATE TABLE products;
TRUNCATE TABLE product_categories;
TRUNCATE TABLE leads;
TRUNCATE TABLE lead_statuses;
TRUNCATE TABLE lead_sources;
TRUNCATE TABLE employees;
TRUNCATE TABLE role_permissions;
TRUNCATE TABLE permissions;
TRUNCATE TABLE roles;
TRUNCATE TABLE customer_preferences;
TRUNCATE TABLE customer_phones;
TRUNCATE TABLE customer_addresses;
TRUNCATE TABLE customers;
TRUNCATE TABLE customer_statuses;

-- 1. Insert customer_statuses (4 statuses)
INSERT INTO customer_statuses (id, name, description) VALUES
(1, 'Active', 'Currently active customer with regular business'),
(2, 'Inactive', 'Customer with no interactions in the last 6 months'),
(3, 'Prospect', 'Converted lead but no purchases yet'),
(4, 'Suspended', 'Account suspended due to compliance or payment issues');

-- 2. Insert roles (4 roles)
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full system access and management privileges'),
(2, 'Manager', 'Access to team reports, leads management and oversight'),
(3, 'Sales Executive', 'Access to leads, opportunities and customer data'),
(4, 'Support Agent', 'Access to tickets and customer profiles for support');

-- 3. Insert permissions (10 permissions)
INSERT INTO permissions (id, name, description) VALUES
(1, 'manage_employees', 'Ability to create, update and delete employee accounts'),
(2, 'view_dashboard', 'Ability to view main metrics and reporting dashboards'),
(3, 'manage_customers', 'Ability to create, edit, delete customer profiles'),
(4, 'manage_leads', 'Ability to create, edit, reassign and convert leads'),
(5, 'manage_opportunities', 'Ability to edit and track opportunities in pipeline'),
(6, 'manage_products', 'Ability to create, update and delete products'),
(7, 'manage_tickets', 'Ability to view, update, assign and close support tickets'),
(8, 'view_reports', 'Ability to access monthly reports and analytical data'),
(9, 'manage_roles', 'Ability to modify roles and permissions mapping'),
(10, 'access_audit_logs', 'Ability to view system actions and audit history');

-- 4. Insert role_permissions mapping
-- Admin gets all permissions (10 rows)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10);
-- Manager gets most (7 rows)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 2), (2, 3), (2, 4), (2, 5), (2, 7), (2, 8), (2, 10);
-- Sales gets dashboard, customers, leads, opportunities (4 rows)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 2), (3, 3), (3, 4), (3, 5);
-- Support gets dashboard, customers, tickets (3 rows)
INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 2), (4, 3), (4, 7);

-- 5. Insert lead_sources (10 sources)
INSERT INTO lead_sources (id, name) VALUES
(1, 'Website Form'),
(2, 'Referral'),
(3, 'Cold Call'),
(4, 'LinkedIn Outreach'),
(5, 'Email Marketing'),
(6, 'Partner Referral'),
(7, 'Google Search (SEO)'),
(8, 'PPC Ad Campaign'),
(9, 'Webinar / Event'),
(10, 'Direct Mail');

-- 6. Insert lead_statuses (6 statuses)
INSERT INTO lead_statuses (id, name) VALUES
(1, 'New'),
(2, 'Contacted'),
(3, 'Qualified'),
(4, 'Proposal Sent'),
(5, 'Converted'),
(6, 'Lost');

-- 7. Insert product_categories (5 categories)
INSERT INTO product_categories (id, name) VALUES
(1, 'SaaS Software'),
(2, 'Enterprise License'),
(3, 'Hardware & Devices'),
(4, 'Consulting & Implementation'),
(5, 'Support Plans');

-- 8. Insert employees (20 employees)
-- All employees have password: "Password@123" (bcrypt hash: $2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.)
INSERT INTO employees (id, first_name, last_name, email, password_hash, role_id, is_active) VALUES
(1, 'Naitik', 'Pathak', 'naitik.pathak@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1, 1), -- Admin
(2, 'Aarav', 'Sharma', 'aarav.sharma@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 2, 1), -- Manager
(3, 'Priya', 'Patel', 'priya.patel@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1), -- Sales Executive
(4, 'Amit', 'Verma', 'amit.verma@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1), -- Sales Executive
(5, 'Rohan', 'Gupta', 'rohan.gupta@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1), -- Support Agent
(6, 'Sneha', 'Rao', 'sneha.rao@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1), -- Support Agent
(7, 'Vikram', 'Singh', 'vikram.singh@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(8, 'Meera', 'Iyer', 'meera.iyer@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(9, 'Rajesh', 'Kumar', 'rajesh.kumar@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1),
(10, 'Divya', 'Nair', 'divya.nair@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1),
(11, 'Arjun', 'Mehta', 'arjun.mehta@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(12, 'Neha', 'Joshi', 'neha.joshi@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(13, 'Sanjay', 'Shah', 'sanjay.shah@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1),
(14, 'Pooja', 'Reddy', 'pooja.reddy@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1),
(15, 'Aditya', 'Sen', 'aditya.sen@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(16, 'Ritu', 'Mishra', 'ritu.mishra@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(17, 'Sunil', 'Dutta', 'sunil.dutta@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1),
(18, 'Deepa', 'Menon', 'deepa.menon@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4, 1),
(19, 'Aryan', 'Rana', 'aryan.rana@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3, 1),
(20, 'Ananya', 'Hegde', 'ananya.hegde@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 2, 1);

-- 9. Insert customers (20 customers)
-- Passwords: "Password@123" (bcrypt hash: $2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.)
INSERT INTO customers (id, first_name, last_name, email, password_hash, status_id) VALUES
(1, 'Suresh', 'Prasad', 'suresh.prasad@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(2, 'Kiran', 'Bhat', 'kiran.bhat@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(3, 'Ramesh', 'Nair', 'ramesh.nair@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(4, 'Geeta', 'Rao', 'geeta.rao@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(5, 'Anil', 'Kapoor', 'anil.kapoor@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 2),
(6, 'Sunita', 'Williams', 'sunita.williams@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(7, 'Harish', 'Kumar', 'harish.kumar@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3),
(8, 'Kavita', 'Sharma', 'kavita.sharma@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(9, 'Vijay', 'Singh', 'vijay.singh@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(10, 'Rekha', 'Sen', 'rekha.sen@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(11, 'Manoj', 'Tiwary', 'manoj.tiwary@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 2),
(12, 'Preeti', 'Gupta', 'preeti.gupta@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(13, 'Sandeep', 'Patil', 'sandeep.patil@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 3),
(14, 'Madhuri', 'Sen', 'madhuri.sen@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(15, 'Dinesh', 'Karthik', 'dinesh.karthik@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(16, 'Shilpa', 'Shinde', 'shilpa.shinde@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(17, 'Vinod', 'Kambli', 'vinod.kambli@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 4),
(18, 'Lata', 'Sen', 'lata.sen@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(19, 'Yashwant', 'Sinha', 'yashwant.sinha@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1),
(20, 'Asha', 'Patel', 'asha.patel@gmail.com', '$2b$10$0p8RZHM9dZSUJufvwDdel.iACxvZ5VTLK.6ejgkDnmMUMu.DYFxO.', 1);

-- 10. Insert customer_addresses (20 addresses, primary & secondary address mix)
INSERT INTO customer_addresses (customer_id, address_line, city, state, zip_code, country, is_primary) VALUES
(1, '100 Main St', 'New York', 'NY', '10001', 'USA', 1),
(2, '200 Oak Ave', 'Los Angeles', 'CA', '90001', 'USA', 1),
(3, '300 Pine Rd', 'Chicago', 'IL', '60601', 'USA', 1),
(4, '400 Maple Dr', 'Houston', 'TX', '77001', 'USA', 1),
(5, '500 Cedar St', 'Phoenix', 'AZ', '85001', 'USA', 1),
(6, '600 Birch Ln', 'Philadelphia', 'PA', '19101', 'USA', 1),
(7, '700 Elm St', 'San Antonio', 'TX', '78201', 'USA', 1),
(8, '800 Walnut Ave', 'San Diego', 'CA', '92101', 'USA', 1),
(9, '900 Chestnut St', 'Dallas', 'TX', '75201', 'USA', 1),
(10, '1000 Cypress Rd', 'San Jose', 'CA', '95101', 'USA', 1),
(11, '1100 Redwood Ln', 'Austin', 'TX', '78701', 'USA', 1),
(12, '1200 Magnolia Dr', 'Jacksonville', 'FL', '32201', 'USA', 1),
(13, '1300 Willow St', 'Fort Worth', 'TX', '76101', 'USA', 1),
(14, '1400 Poplar Ave', 'Columbus', 'OH', '43201', 'USA', 1),
(15, '1500 Alder Dr', 'Charlotte', 'NC', '28201', 'USA', 1),
(16, '1600 Spruce St', 'San Francisco', 'CA', '94101', 'USA', 1),
(17, '1700 Ash Ave', 'Indianapolis', 'IN', '46201', 'USA', 1),
(18, '1800 Beech Rd', 'Seattle', 'WA', '98101', 'USA', 1),
(19, '1900 Linden Ln', 'Denver', 'CO', '80201', 'USA', 1),
(20, '2000 Hickory Dr', 'Boston', 'MA', '02101', 'USA', 1);

-- 11. Insert customer_phones (20 phone numbers)
INSERT INTO customer_phones (customer_id, phone_number, type, is_primary) VALUES
(1, '212-555-0100', 'mobile', 1),
(2, '310-555-0101', 'mobile', 1),
(3, '312-555-0102', 'work', 1),
(4, '713-555-0103', 'mobile', 1),
(5, '602-555-0104', 'home', 1),
(6, '215-555-0105', 'mobile', 1),
(7, '210-555-0106', 'mobile', 1),
(8, '619-555-0107', 'work', 1),
(9, '214-555-0108', 'mobile', 1),
(10, '408-555-0109', 'mobile', 1),
(11, '512-555-0110', 'mobile', 1),
(12, '904-555-0111', 'mobile', 1),
(13, '817-555-0112', 'work', 1),
(14, '614-555-0113', 'mobile', 1),
(15, '704-555-0114', 'mobile', 1),
(16, '415-555-0115', 'mobile', 1),
(17, '317-555-0116', 'home', 1),
(18, '206-555-0117', 'mobile', 1),
(19, '303-555-0118', 'mobile', 1),
(20, '617-555-0119', 'work', 1);

-- 12. Insert customer_preferences (20 records)
INSERT INTO customer_preferences (customer_id, preferred_language, newsletter_opt_in, marketing_opt_in) VALUES
(1, 'en', 1, 1), (2, 'en', 1, 0), (3, 'en', 0, 0), (4, 'en', 1, 1), (5, 'en', 1, 1),
(6, 'es', 1, 1), (7, 'en', 0, 1), (8, 'en', 1, 1), (9, 'en', 1, 0), (10, 'en', 0, 0),
(11, 'fr', 1, 1), (12, 'en', 1, 1), (13, 'en', 1, 1), (14, 'en', 0, 1), (15, 'en', 1, 1),
(16, 'en', 1, 0), (17, 'es', 1, 1), (18, 'en', 1, 1), (19, 'en', 0, 0), (20, 'en', 1, 1);

-- 13. Insert products (20 products)
INSERT INTO products (id, name, sku, description, category_id, price) VALUES
(1, 'CRM Cloud Business Suite', 'SaaS-CRM-BIZ', 'Complete CRM SaaS suite for business scale teams.', 1, 3999.00),
(2, 'CRM Enterprise Package', 'SaaS-CRM-ENT', 'Unlimited CRM license with advanced custom capabilities.', 1, 7999.00),
(3, 'Analytics Engine Addon', 'SaaS-BI-ADD', 'AI analytics module for predictive revenue analysis.', 1, 1599.00),
(4, 'Support Desk Standard License', 'SaaS-SUP-STD', 'Dedicated customer ticket desks and live chat module.', 1, 2499.00),
(5, 'ERP Database Server License', 'ENT-LIC-ERP', 'On-premise database license for secure records storage.', 2, 350000.00),
(6, 'Unified Auth Server Engine', 'ENT-LIC-AUTH', 'Single sign-on enterprise infrastructure server.', 2, 180000.00),
(7, 'Workflow Engine Core Library', 'ENT-LIC-WORK', 'Customizable automation API core orchestrator.', 2, 150000.00),
(8, 'CRM Desk Phone V10', 'HDW-PHN-V10', 'VoIP hardware desktop phone with CRM interface.', 3, 12500.00),
(9, 'CRM Barcode Scanner Wireless', 'HDW-SCN-WRLS', 'Wireless barcode scanner linked directly to inventory database.', 3, 7500.00),
(10, 'Enterprise Backup Appliance', 'HDW-BKP-APP', 'Secure local backup system, RAID configured storage.', 3, 70000.00),
(11, 'System Setup & Implementation', 'CON-SET-IMP', 'Professional services setup, configuration and system launch.', 4, 120000.00),
(12, 'API Custom Development (10hr Block)', 'CON-DEV-API', 'Custom developer coding block for custom systems connection.', 4, 95000.00),
(13, 'Staff Training Workshop (4hr)', 'CON-WRK-TRN', 'Full team workshop for training staff on CRM best practices.', 4, 45000.00),
(14, 'Strategic Database Migration Service', 'CON-DB-MIG', 'Advanced data cleansing and legacy file formatting.', 4, 250000.00),
(15, 'Standard SLA Support Plan (Monthly)', 'SUP-PLA-STD', 'Next-business-day email and chat customer support.', 5, 2499.00),
(16, 'Premium 24/7 Support Plan (Monthly)', 'SUP-PLA-PRM', 'Guaranteed 1-hour ticket response, telephone hotline.', 5, 12500.00),
(17, 'Dedicated Engineer Retainer (Monthly)', 'SUP-ENG-RET', 'Access to a designated systems consultant helper.', 5, 95000.00),
(18, 'Self-Service Portal Engine', 'SaaS-PORT-SS', 'Interactive customer profile self-service billing system.', 1, 1200.00),
(19, 'Legacy Terminal Interface Controller', 'HDW-TRM-CTRL', 'Hardware adapter linking POS systems to API interface.', 3, 19999.00),
(20, 'Custom Branding Toolkit addon', 'SaaS-BRAND-KIT', 'CSS white-label setup addon for custom domains.', 1, 799.00);

-- 14. Insert leads (20 leads)
INSERT INTO leads (id, title, description, source_id, status_id, assigned_to_id, customer_id) VALUES
(1, 'Lead - Acme Corp', 'Interested in Enterprise SaaS Licenses.', 1, 3, 3, 1),
(2, 'Inquiry - Tech Solutions', 'Needs help with POS integration adapters.', 2, 4, 4, 2),
(3, 'Contact - David Miller', 'Interested in database migration services.', 3, 2, 7, NULL),
(4, 'Webinar attendee - Alpha Co', 'Follow up after CRM automation seminar.', 9, 1, 8, NULL),
(5, 'Ad click - Beta Systems', 'Downloaded PDF about analytics engines.', 8, 3, 11, 3),
(6, 'Partner Referral - Delta Group', 'Wants a customized quote for consulting.', 6, 2, 12, NULL),
(7, 'Direct mail - Echo Holdings', 'Responded to brochure campaign mailer.', 10, 1, 15, NULL),
(8, 'Form - Fox Enterprises', 'Requested product pricing catalog list.', 1, 3, 16, 4),
(9, 'LinkedIn - Gamma Tech', 'Expressed interest in 24/7 Support SLA plans.', 4, 2, 19, NULL),
(10, 'SEO query - Hotel Partners', 'Looking for wireless scanners systems.', 7, 3, 3, 6),
(11, 'Form - Ivy Industries', 'Wants setup implementation pricing.', 1, 2, 4, NULL),
(12, 'Referral - Jet Corp', 'Warm intro from partner company.', 2, 4, 7, 8),
(13, 'Cold outreach - Kilo Group', 'Spoke briefly, scheduled email follow up.', 3, 2, 8, NULL),
(14, 'Form - Lima LLC', 'Downloaded trial database developer pack.', 1, 1, 11, NULL),
(15, 'SEO click - Mega Logistics', 'Looking for dispatch console telephone units.', 7, 3, 12, 9),
(16, 'Ad click - Nano Security', 'Interested in Single Sign On server pack.', 8, 4, 15, 10),
(17, 'Webinar - Oasis Retail', 'Attendee in inventory scanning session.', 9, 2, 16, NULL),
(18, 'Form - Peak Builders', 'Wants standard CRM team license bundle.', 1, 3, 19, 12),
(19, 'LinkedIn - Quad Consulting', 'Interested in partnership commission system.', 4, 1, 3, NULL),
(20, 'Partner - Radius Media', 'Wants bulk rate white label options.', 6, 2, 4, NULL);

-- 15. Insert opportunities (20 opportunities)
INSERT INTO opportunities (id, lead_id, product_id, amount, stage, expected_close) VALUES
(1, 1, 2, 200000.00, 'Closed Won', '2026-05-15'),
(2, 2, 19, 39998.00, 'Negotiation', '2026-06-25'),
(3, 3, 14, 250000.00, 'Proposal', '2026-07-10'),
(4, 4, 1, 48000.00, 'Prospecting', '2026-08-01'),
(5, 5, 3, 19200.00, 'Closed Won', '2026-05-20'),
(6, 6, 11, 120000.00, 'Qualification', '2026-07-15'),
(7, 7, 8, 24000.00, 'Prospecting', '2026-09-01'),
(8, 8, 1, 96000.00, 'Closed Won', '2026-05-28'),
(9, 9, 16, 143040.00, 'Qualification', '2026-08-15'),
(10, 10, 9, 14400.00, 'Closed Won', '2026-06-02'),
(11, 11, 11, 120000.00, 'Proposal', '2026-07-20'),
(12, 12, 2, 400000.00, 'Negotiation', '2026-06-30'),
(13, 13, 15, 27840.00, 'Qualification', '2026-08-10'),
(14, 14, 7, 144000.00, 'Prospecting', '2026-09-15'),
(15, 15, 8, 48000.00, 'Closed Won', '2026-06-05'),
(16, 16, 6, 176000.00, 'Closed Won', '2026-06-10'),
(17, 17, 9, 36000.00, 'Proposal', '2026-07-30'),
(18, 18, 1, 24000.00, 'Closed Won', '2026-06-12'),
(19, 19, 20, 9600.00, 'Prospecting', '2026-10-01'),
(20, 20, 20, 19200.00, 'Proposal', '2026-08-20');

-- 16. Insert tickets (20 tickets)
INSERT INTO tickets (id, customer_id, assigned_to_id, priority, status, subject, description) VALUES
(1, 1, 5, 'Medium', 'Resolved', 'SSO Login Integration error.', 'SSO integration shows authentication token errors.'),
(2, 2, 6, 'High', 'In Progress', 'Database migration timeout.', 'Import process times out after 1000 lines.'),
(3, 3, 9, 'Low', 'Open', 'Change invoice details.', 'Requesting company logo and metadata additions to PDF invoices.'),
(4, 4, 10, 'Critical', 'Open', 'System downtime after patch.', 'CRM main portal dashboard fails loading with a 500 error.'),
(5, 5, 13, 'Medium', 'Closed', 'Newsletter email preferences.', 'Customer wants to opt out of marketing campaigns manually.'),
(6, 6, 14, 'High', 'In Progress', 'Wireless scanner pairing.', 'Device is not discovering connection with POS bridge adapter.'),
(7, 7, 17, 'Low', 'Open', 'Tutorial documentation link.', 'Asking where to find the custom CSV schema formats guide.'),
(8, 8, 18, 'Medium', 'Resolved', 'Pricing discrepancy.', 'Invoice billed at regular tier instead of approved discount.'),
(9, 9, 5, 'High', 'Open', 'Call routing failure.', 'VoIP hardware telephone reports connection failure status code 404.'),
(10, 10, 6, 'Critical', 'In Progress', 'Data leak alert notification.', 'Warning messages shown for insecure MySQL backend passwords.'),
(11, 11, 9, 'Low', 'Resolved', 'Modify billing email.', 'Update accounting contacts to accounts@delta.com.'),
(12, 12, 10, 'Medium', 'Closed', 'Reset supervisor password.', 'Forgotten admin password, requesting password override link.'),
(13, 13, 13, 'High', 'Open', 'Custom field limits exceeded.', 'Unable to add more custom variables to contacts table.'),
(14, 14, 14, 'Low', 'Open', 'CSV import fails.', 'CSV parser rejects special character punctuation accents.'),
(15, 15, 17, 'Medium', 'Resolved', 'Setup backup location.', 'How to change local database backups save location path.'),
(16, 16, 18, 'High', 'In Progress', 'Slow loading query reporting.', 'Dashboard reports load extremely slowly for multi-region counts.'),
(17, 17, 5, 'Low', 'Open', 'White label favicon image.', 'Favicon logo not showing up inside safari web browser pages.'),
(18, 18, 6, 'Medium', 'Closed', 'Duplicate contact profile merges.', 'Requesting merge instructions for matching email profiles.'),
(19, 19, 9, 'High', 'Open', 'SLA credits request.', 'Service downtime refund calculations application inquiry.'),
(20, 20, 10, 'Critical', 'Open', 'API Gateway SSL certificate.', 'Secure server bridge handshake expired notification.');

-- 17. Insert customer_interactions (20 records)
INSERT INTO customer_interactions (customer_id, employee_id, type, notes) VALUES
(1, 3, 'Call', 'Brief introductory discussion, Acme Corp is seeking enterprise software licenses.'),
(2, 4, 'Email', 'Sent price quote list and draft SLA documentation packet.'),
(3, 7, 'Meeting', 'Met at main office to map custom database schemas conversion requirements.'),
(4, 8, 'Note', 'Customer prefers being reached afternoon, standard timezone GMT-5.'),
(5, 11, 'Call', 'Discussed newsletter opt out issue. Verified update in preferences.'),
(6, 12, 'Meeting', 'Demonstrated how wireless scanning adapter links with POS register.'),
(7, 15, 'Email', 'Shared help guides links page for custom template uploads.'),
(8, 16, 'Call', 'Settled the invoice mismatch problem, processed refund adjustment credits.'),
(9, 19, 'Note', 'Left voice message regarding VOIP handset replacement shipments status.'),
(10, 3, 'Email', 'Alerted client regarding database security protocols setup verification.'),
(11, 4, 'Call', 'Confirmed accounting billing addresses changes successfully saved.'),
(12, 7, 'Meeting', 'Assisted supervisor on screen share to set new credentials.'),
(13, 8, 'Email', 'Shared developer API logs clarifying max custom parameters bounds.'),
(14, 11, 'Note', 'Suggested using sanitization tools before batch CSV files parsing.'),
(15, 12, 'Call', 'Guided admin on target paths folder settings config parameters.'),
(16, 15, 'Meeting', 'Presented database indexing solution which fixed reports queries lag.'),
(17, 16, 'Email', 'Instructed user to delete cached browser records to display logo.'),
(18, 19, 'Call', 'Coached support desk lead on profiles merge tool UI selections.'),
(19, 3, 'Email', 'Replied with server availability history uptime metrics document.'),
(20, 4, 'Meeting', 'Updated client on security certificate updates timetable calendar.');

-- 18. Insert customer_products (20 records)
INSERT INTO customer_products (customer_id, product_id, purchase_date) VALUES
(1, 2, '2026-05-15'),
(2, 19, '2026-04-10'),
(3, 14, '2026-05-01'),
(4, 1, '2026-06-01'),
(5, 3, '2026-05-20'),
(6, 9, '2026-03-12'),
(7, 11, '2026-04-18'),
(8, 1, '2026-05-28'),
(9, 16, '2026-05-05'),
(10, 9, '2026-06-02'),
(11, 11, '2026-06-11'),
(12, 2, '2026-05-30'),
(13, 15, '2026-04-20'),
(14, 7, '2026-05-15'),
(15, 8, '2026-06-05'),
(16, 6, '2026-06-10'),
(17, 9, '2026-03-25'),
(18, 1, '2026-06-12'),
(19, 20, '2026-05-01'),
(20, 20, '2026-06-03');

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
