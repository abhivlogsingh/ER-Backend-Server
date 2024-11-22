const db = require('../db/connection'); // MySQL connection pool

// Create a new request
exports.createRequest = async (data) => {
    const query = 'INSERT INTO requests SET ?';
    const [result] = await db.query(query, data);
    return result;
};

// Get all requests
exports.getAllRequests = async () => {
    const query = 'SELECT * FROM requests';
    const [rows] = await db.query(query);
    return rows;
};

// Get a single request by ID
exports.getRequestById = async (id) => {
    const query = 'SELECT * FROM requests WHERE id = ?';
    const [rows] = await db.query(query, [id]);
    return rows[0];
};

// Update a request by ID
exports.updateRequest = async (id, data) => {
    const query = 'UPDATE requests SET ? WHERE id = ?';
    const [result] = await db.query(query, [data, id]);
    return result;
};

// Delete a request by ID
exports.deleteRequest = async (id) => {
    const query = 'DELETE FROM requests WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result;
};
