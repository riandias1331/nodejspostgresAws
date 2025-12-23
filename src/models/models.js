import bcrypt from "bcrypt";
import pool from "../config/db.js";
import neonPool  from "../config/db.js";
import jwt from "jsonwebtoken";
const jwt_secret = process.env.JWT_SECRET;

export const getAllUsersService = async () => {
    try {
        const result = await neonPool.query("SELECT * FROM users");
        console.log("Result rows:", result.rows);
        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar todos os usuários:", error);
        throw error;
    }
};

export const getUserByIdService = async (id) => {
    try {
        const result = await neonPool.query("SELECT * FROM users WHERE id = $1", [id]);
        return result.rows[0] || null;
    } catch (error) {
        console.error(`Erro ao buscar usuário com ID ${id}:`, error);
        throw error;
    }
};

export const createUserService = async (name, email, password) => {
  try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await neonPool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, hashedPassword]
        );
        // return result.rows[0];
        const user = result.rows[0];

        const token = jwt.sign({ id: user.id }, jwt_secret, { expiresIn: "1h" });

        console.log('Token: ', token);
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
    }
};

export const updateUserService = async (id, name, email) => {
    try {
        const result = await neonPool.query(
            "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
            [name, email, id]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
        throw error;
    }
};

export const deleteUserService = async (id) => {
    try {
        const result = await neonPool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0] || null;
    } catch (error) {
        console.error(`Erro ao deletar usuário com ID ${id}:`, error);
        throw error;
    }
};

export const deleteUserAllService = async () => {
    try {
        if (process.env.NODE_ENV === 'production') {
            throw new Error("Operation not allowed in production");
        }

        const result = await neonPool.query("DELETE FROM users RETURNING *");
        return {
            count: result.rowCount,
            users: result.rows,
        };
    } catch (error) {
        console.error("Erro ao deletar todos os usuários:", error);
        throw error;
    }
};