import pool from "../config/db.js";

const createUsersTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    try {
        await pool.query(query);
        console.log("users created successfully");
    } catch (error) {
        console.error("Error creating Users table:", error);
    }
}

export default createUsersTable;