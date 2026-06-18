# Enterprise CRM Suite (5NF Normalized)

A complete, high-performance Customer Relationship Management (CRM) System featuring a database normalized to the **Fifth Normal Form (5NF)**. The system is built with a glassmorphic React/Vite frontend and a secure Node.js/Express backend.

## 🚀 Key Features

* **5NF Database Architecture**: Decoupled multi-valued dependencies (addresses, phone numbers, communication preferences) and ternary relationships (leads, customer products, opportunities) to eliminate redundancy and maintain strict ACID compliance.
* **Modern Dashboard**: Dynamic analytics powered by Recharts (Monthly Revenue Forecasts, Customer Growth trends, Lead Conversions, Ticket Resolution rates).
* **Interactive UI/UX Design**: Access the complete screen interactions, wireframes, and design flows via the [Google Stitch Prototype](https://stitch.withgoogle.com/projects/13988182919957791795).
* **Role-Based Access Control (RBAC)**: Custom middlewares enforcing permissions for Admin, Manager, Sales Executive, and Support Agent roles.
* **Lead Conversion Engine**: Implements a MySQL transaction-safe Stored Procedure (`sp_convert_lead_to_customer`) to handle complex transitions.
* **Audit & Compliance Logging**: Auto-populated audit trails via native MySQL triggers.

## 🛠️ Technology Stack

* **Frontend**: React.js (Vite), Tailwind CSS, Axios, Lucide React, Recharts.
* **Backend**: Node.js, Express.js, Sequelize ORM, JWT Authentication, bcrypt.
* **Database**: MySQL 8.0.

---

## 📂 Database Schema (5NF Normalization Highlights)

1. **4NF Compliance**: Removed multi-valued attributes by decoupling customer addresses and phones into separate tables (`customer_addresses` and `customer_phones`).
2. **5NF Compliance**: Eliminated Join Dependencies (JD) by breaking ternary relations between Customers, Products, and Employees into distinct binary associations (`customer_products` and `opportunities`).

---

## 💻 Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js** and **MySQL 8.0** installed.

### 2. Database Initialization
Log in to your MySQL command line client and execute the scripts:
```sql
CREATE DATABASE crm_management_system;
USE crm_management_system;
SOURCE sql/schema.sql;
SOURCE sql/seed.sql;
```

### 3. Backend Configuration
Create a `backend/.env` file:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=crm_management_system
JWT_SECRET=your_jwt_secret
```

Install dependencies and start the backend:
```bash
cd backend
npm install
npm run dev
```

### 4. Frontend Configuration
Install dependencies and start the client:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3001` in your browser.
