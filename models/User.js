import db from '../config/db.js';

class User {
    static async create(userData) {
        const { name, email, password, provider = 'local', provider_id = null, avatar = null } = userData;
        
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, provider, provider_id, avatar) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, provider, provider_id, avatar]
        );
        
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findByProviderId(provider, provider_id) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE provider = ? AND provider_id = ?',
            [provider, provider_id]
        );
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, name, email, provider, avatar, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    }

    static async updateUser(id, updateData) {
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (fields.length === 0) return null;

        values.push(id);
        
        const [result] = await db.execute(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result.affectedRows;
    }
}

export default User;