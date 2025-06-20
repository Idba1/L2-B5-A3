import express, { Request, Response } from 'express';
import { Borrow } from '../models/borrow.model';
import { Book } from '../models/book.model';

export const borrowRoutes = express.Router();


borrowRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;

        const book = await Book.findById(bookId);
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


borrowRoutes.get('/', async (_req: Request, res: Response) => {
    try {
        const summaryRaw = await Borrow.aggregate([
            {
                $group: {
                    _id: '$book',
                    totalQuantity: { $sum: '$quantity' }
                }
            },
            {
                $lookup: {
                    from: 'books',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'bookInfo'
                }
            },
            { $unwind: '$bookInfo' }
        ]);

        const summary = summaryRaw.map(entry => ({
            book: {
                title: entry.bookInfo.title,
                isbn: entry.bookInfo.isbn
            },
            totalQuantity: entry.totalQuantity
        }));

        res.json({
            success: true,
            message: 'Borrowed books summary retrieved successfully',
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve summary',
            error
        });
    }
});
