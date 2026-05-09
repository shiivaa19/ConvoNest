import { query } from "../lib/db.js";

export const findUserByEmail = async (email) => {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] || null;
};

export const findUserById = async (id) => {
    const result = await query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] || null;
};

export const createUser = async (fullName, email, password, bio = "") => {
    const result = await query(
        "INSERT INTO users (fullName, email, password, profilePic) VALUES ($1, $2, $3, $4) RETURNING *",
        [fullName, email, password, ""]
    );
    return result.rows[0];
};

export const updateUserProfile = async (userId, fullName, bio, profilePic) => {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (fullName !== undefined) {
        updateFields.push(`fullName = $${paramCount++}`);
        values.push(fullName);
    }
    if (bio !== undefined) {
        updateFields.push(`bio = $${paramCount++}`);
        values.push(bio);
    }
    if (profilePic !== undefined) {
        updateFields.push(`profilePic = $${paramCount++}`);
        values.push(profilePic);
    }

    values.push(userId);
    const result = await query(
        `UPDATE users SET ${updateFields.join(", ")} WHERE id = $${paramCount} RETURNING *`,
        values
    );
    return result.rows[0];
};

export const getAllUsers = async () => {
    const result = await query("SELECT id, fullName, profilePic FROM users");
    return result.rows;
};
