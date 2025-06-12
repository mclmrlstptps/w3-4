const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const register = async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'All fields are required'});
    }
    
    const user = { email, password, name }; 
    
    try {
        const existing = await mongodb.getDatabase().db().collection('users').findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const response = await mongodb.getDatabase().db().collection('users').insertOne(user);
        res.status(201).json({ message: 'User created', userId: response.insertedId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await mongodb.getDatabase().db().collection('users').findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await mongodb.getDatabase().db().collection('users').find({}).toArray();

        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });
        res.status(200).json(safeUsers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await mongodb.getDatabase().db().collection('users').findOne({ _id: new ObjectId(userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password, ...safeUser } = user;
        res.status(200).json(safeUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const { email, name } = req.body;
        if (!email || !name) {
            return res.status(400).json({ message: 'Email and name are required' });
        }

        const updateData = { email, name };
        
        const result = await mongodb.getDatabase().db().collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const result = await mongodb.getDatabase().db().collection('users').deleteOne({ _id: new ObjectId(userId) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { 
    register, 
    login, 
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
};