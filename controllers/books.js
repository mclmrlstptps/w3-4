const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

const validateBook = (book) => { 
    
    const errors = [];

    if (!book.title || typeof book.title !== 'string' || book.title.trim() === '') {
        errors.push('Title is required');
    } 

    if (!book.author || typeof book.author !== 'string' || book.author.trim() === '') {
        errors.push('Author is required');
    } 

    if (!book.genre || typeof book.genre !== 'string' || book.genre.trim() === '') {
        errors.push('Genre is required');
    } 

    if (book.pages !== undefined && book.pages !== null && book.pages !== '') {
        const pages = parseInt(book.pages);
        if (isNaN(pages) || pages < 1) {
            errors.push('Pages must be a positive number');
        }
    }

    if (book.published && book.published !== '') {
        const publishedDate = new Date(book.published);
        if (isNaN(publishedDate.getTime())) {
            errors.push('Published date must be valid or undefined');
        }
    }

    if (book.purchase && book.purchase !== '') {
        if (typeof book.purchase !== 'string') {
            errors.push('Purchase URL must be a string');
        } else if (!isValidURL(book.purchase)) {
            errors.push('Purchase must be a valid URL (e.g., https://example.com)');
        }
    }

    return errors; 
};

const isValidURL = (string) => {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
};

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('books').find();
        const books = await result.toArray();
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Error retrieving books' });
    }
};

const getSingle = async (req, res) => {
    try {
        // Validate ObjectId format
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        const bookId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('books').find({ _id: bookId });
        const books = await result.toArray();

        if (books.length === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(books[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Error retrieving book' });
    }
};

const createBook = async (req, res) => {
    try {
        const book = {
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            genre: req.body.genre,
            published: req.body.published,
            purchase: req.body.purchase,
            languages: req.body.languages,
            publisher: req.body.publisher
        };

        
        const validationErrors = validateBook(book);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validationErrors 
            });
        }

        const response = await mongodb.getDatabase().db().collection('books').insertOne(book);

        if (response.acknowledged) {
            res.status(201).json({ 
                message: 'Book created successfully',
                id: response.insertedId 
            });
        } else {
            res.status(500).json({ message: 'Failed to create book' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Some error occurred while creating the book' });
    }
};

const updateBook = async (req, res) => {
    try {
       
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        const bookId = new ObjectId(req.params.id);
        const book = {
            title: req.body.title,
            author: req.body.author,
            pages: req.body.pages,
            genre: req.body.genre,
            published: req.body.published,
            purchase: req.body.purchase,
            languages: req.body.languages,
            publisher: req.body.publisher
        };

        
        const validationErrors = validateBook(book);
        if (validationErrors.length > 0) {
            return res.status(400).json({ 
                message: 'Validation failed', 
                errors: validationErrors 
            });
        }

        const response = await mongodb.getDatabase().db().collection('books').replaceOne({ _id: bookId }, book);

        if (response.matchedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (response.acknowledged) {
            res.status(200).json({ message: 'Book updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to update book' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Some error occurred while updating the book' });
    }
};

const deleteBook = async (req, res) => {
    try {
       
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid book ID format' });
        }

        const bookId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('books').deleteOne({ _id: bookId });

        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Book deleted successfully' });
        } else {
            res.status(404).json({ message: 'Book not found or already deleted' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Some error occurred while deleting the book' });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook,
    validateBook,
    isValidURL
};