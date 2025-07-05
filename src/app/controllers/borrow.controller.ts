import express, { NextFunction, Request, Response } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book, IBookDocument } from '../models/book.model';

export const borrowRoutes = express.Router();


borrowRoutes.post('/', async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;

        const book = await Book.findById(bookId) as IBookDocument;
        if (!book) return res.status(404).json({ success: false, message: 'Book not found' });

        if (book.copies < quantity) {
            return res.status(400).json({ success: false, message: 'Not enough copies available' });
        }

        book.copies -= quantity;
        book.updateAvailability();
        await book.save();

        const borrow = await Borrow.create({ book: bookId, quantity, dueDate });

        res.status(201).json({
            success: true,
            message: 'Book borrowed successfully',
            data: borrow,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Borrowing failed',
            error,
        });
    }
});

borrowRoutes.get('/list', async (req: Request, res: Response) => {
    try {
        const pageNum = Math.max(parseInt(String(req.query.page)) || 1, 1);
        const pageSize = Math.max(parseInt(String(req.query.limit)) || 10, 1);
        const skip = (pageNum - 1) * pageSize;

        const [borrows, total] = await Promise.all([
            Borrow.find()
                .skip(skip)
                .limit(pageSize)
                .populate('book', 'title isbn copies')
                .exec(),
            Borrow.countDocuments().exec(),
        ]);

        res.json({
            success: true,
            message: 'Borrow records retrieved successfully',
            data: borrows,
            pagination: {
                total,
                page: pageNum,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve borrow records',
            error,
        });
    }
});