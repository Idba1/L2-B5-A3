import express, { Request, Response } from 'express';
import { Book } from '../models/book.model';

export const bookRoutes = express.Router();


bookRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const book = await Book.create(req.body);

        const responseData = {
            _id: book._id,
            title: book.title,
            author: book.author,
            genre: book.genre,
            isbn: book.isbn,
            description: book.description,
            copies: book.copies,
            available: book.available,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt
        };

        res.status(201).json({
            success: true,
            message: 'Book created successfully',
            data: responseData
        });
    } catch (error: any) {
        if (error.name === 'ValidationError') {
            const formattedErrors: Record<string, any> = {};

            for (const field in error.errors) {
                const err = error.errors[field];

                const cleanedProps = { ...err.properties };
                delete cleanedProps.path;
                delete cleanedProps.value;

                formattedErrors[field] = {
                    message: err.message,
                    name: err.name,
                    properties: cleanedProps,
                    kind: err.kind,
                    path: err.path,
                    value: err.value
                };
            }

            res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: {
                    name: error.name,
                    errors: formattedErrors
                }
            });
        } else {
            res.status(500).json({
                message: 'Something went wrong',
                success: false,
                error: error.message || error
            });
        }
    }
});


bookRoutes.get('/', async (req: Request, res: Response) => {
    const { filter, sortBy = 'createdAt', sort = 'asc', limit = 10 } = req.query;
    const query: any = {};
    if (filter) query.genre = filter;
    const books = await Book.find(query).sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 }).limit(Number(limit));
    res.json({ success: true, message: 'Books retrieved successfully', data: books });
});

bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.bookId);
    res.json({ success: true, message: 'Book retrieved successfully', data: book });
});

bookRoutes.put('/:bookId', async (req: Request, res: Response) => {
    const book = await Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    res.json({ success: true, message: 'Book updated successfully', data: book });
});

bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    await Book.findByIdAndDelete(req.params.bookId);
    res.json({ success: true, message: 'Book deleted successfully', data: null });
});
