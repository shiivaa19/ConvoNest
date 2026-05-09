import { query } from "../lib/db.js";

const toInt = (val) => {
    const num = parseInt(val);
    return isNaN(num) ? null : num;
};

export const getAllUsersExcept = async (userId) => {
    const id = toInt(userId);
    if (!id) return [];
    const result = await query("SELECT id, fullName, profilePic FROM users WHERE id != $1", [id]);
    return result.rows;
};

export const getUnseenMessagesCount = async (senderId, receiverId) => {
    const sId = toInt(senderId);
    const rId = toInt(receiverId);
    if (!sId || !rId) return 0;

    try {
        const result = await query(
            "SELECT COUNT(*) as count FROM messages WHERE senderId = $1 AND receiverId = $2",
            [sId, rId]
        );
        return parseInt(result.rows[0].count);
    } catch (error) {
        console.error('Error getting unseen count:', error.message);
        return 0;
    }
};

export const getMessagesForUsers = async (userId1, userId2) => {
    const id1 = toInt(userId1);
    const id2 = toInt(userId2);
    if (!id1 || !id2) return [];

    try {
        const result = await query(
            `SELECT * FROM messages
             WHERE (senderId = $1 AND receiverId = $2)
             OR (senderId = $2 AND receiverId = $1)
             ORDER BY createdAt ASC`,
            [id1, id2]
        );
        return result.rows;
    } catch (error) {
        console.error('Error getting messages:', error.message);
        return [];
    }
};

export const markMessagesAsSeen = async (senderId, receiverId) => {
    const sId = toInt(senderId);
    const rId = toInt(receiverId);
    if (!sId || !rId) return [];

    try {
        const result = await query(
            "UPDATE messages SET seen = true WHERE senderId = $1 AND receiverId = $2 RETURNING *",
            [sId, rId]
        );
        return result.rows;
    } catch (error) {
        console.error('Error marking messages seen:', error.message);
        return [];
    }
};

export const createMessage = async (senderId, receiverId, text, imageUrl = null) => {
    const sId = toInt(senderId);
    const rId = toInt(receiverId);
    if (!sId || !rId) {
        console.error('Invalid user IDs:', { senderId, receiverId, sId, rId });
        return null;
    }

    try {
        const result = await query(
            "INSERT INTO messages (senderId, receiverId, message, image) VALUES ($1, $2, $3, $4) RETURNING *",
            [sId, rId, text || null, imageUrl]
        );
        if (!result.rows || result.rows.length === 0) {
            console.error('No rows returned from insert');
            return null;
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error creating message:', error.message, error.code);
        return null;
    }
};

export const markMessageAsSeen = async (messageId) => {
    const mId = toInt(messageId);
    if (!mId) return null;

    try {
        const result = await query(
            "UPDATE messages SET seen = true WHERE id = $1 RETURNING *",
            [mId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error marking message seen:', error.message);
        return null;
    }
};
