-- ========================================================
-- Gadget World - Advanced E-Commerce Platform
-- Phase 1: Database Schema (DDL)
-- ========================================================

-- 1️ Create Database

CREATE DATABASE IF NOT EXISTS gadget_world;
USE gadget_world;

-- ========================================================
-- 1 Table: Customers
-- ========================================================
CREATE TABLE Customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    shipping_address TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 2 Table: Suppliers
-- ========================================================
CREATE TABLE Suppliers (
    supplier_id INT AUTO_INCREMENT PRIMARY KEY,
    supplier_name VARCHAR(150) NOT NULL,
    contact_email VARCHAR(100)
);

-- ========================================================
-- 3 Table: Warehouses
-- ========================================================
CREATE TABLE Warehouses (
    warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
    warehouse_location VARCHAR(255) NOT NULL
);

-- ========================================================
-- 4 Table: Categories
-- ========================================================
CREATE TABLE Categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================================
-- 5 Table: ProductsD
-- ========================================================
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    supplier_id INT,
    category_id INT,
    FOREIGN KEY (supplier_id) REFERENCES Suppliers(supplier_id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES Categories(category_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================================
-- 6 Table: Inventory
-- ========================================================
CREATE TABLE Inventory (
    product_id INT,
    warehouse_id INT,
    quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    PRIMARY KEY (product_id, warehouse_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES Warehouses(warehouse_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========================================================
-- 7 Table: Reviews
-- ========================================================
CREATE TABLE Reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    customer_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========================================================
-- 8 Table: Orders
-- ========================================================
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled') DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
        ON UPDATE CASCADE ON DELETE SET NULL
);

-- ========================================================
-- 9 Table: Order_Items
-- ========================================================
CREATE TABLE Order_Items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========================================================
-- 10 Table: Payments
-- ========================================================
CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_method ENUM('Credit Card', 'PayPal', 'Bank Transfer'),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- ========================================================
-- ✅ End of schema.sql
-- ========================================================
