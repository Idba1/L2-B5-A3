import express, { NextFunction, Request, Response } from 'express';
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
    try {
        const {
            page = '1',
            limit = '10',
            filter,
            search,
            sortBy = 'createdAt',
            sort = 'asc',
        } = req.query as Record<string, string>;

        const pageNum = Math.max(parseInt(page) || 1, 1);
        const pageSize = Math.max(parseInt(limit) || 10, 1);
        const skip = (pageNum - 1) * pageSize;

        /* build query */
        const query: any = {};
        if (filter) query.genre = filter;
        if (search)
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];

        const [books, total] = await Promise.all([
            Book.find(query)
                .sort({ [sortBy]: sort === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(pageSize)
                .exec(),
            Book.countDocuments(query).exec(),
        ]);

        res.json({
            success: true,
            message: 'Books retrieved successfully',
            data: books,
            pagination: {
                total,
                page: pageNum,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch books', error: err });
    }
});


bookRoutes.get('/:bookId', async (req: Request, res: Response) => {
    const book = await Book.findById(req.params.bookId);
    res.json({ success: true, message: 'Book retrieved successfully', data: book });
});


bookRoutes.put('/:bookId', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const book = await Book.findById(req.params.bookId);

        if (!book) {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }

        Object.assign(book, req.body);

        book.updateAvailability();

        await book.save();

        res.json({
            success: true,
            message: 'Book updated successfully',
            data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to update book',
            error
        });
    }
});


bookRoutes.delete('/:bookId', async (req: Request, res: Response) => {
    await Book.findByIdAndDelete(req.params.bookId);
    res.json({ success: true, message: 'Book deleted successfully', data: null });
});
