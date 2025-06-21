import { Schema, model, Document } from 'mongoose';
import { IBook } from '../interfaces/book.interface';

export interface IBookDocument extends IBook, Document {
    updateAvailability(): void;
}

const validateText = (val: string) => val.trim().length >= 3;

const bookSchema = new Schema<IBookDocument>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            validate: {
                validator: validateText,
                message: 'Title must be at least 3 characters long'
            }
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
            validate: {
                validator: validateText,
                message: 'Author must be at least 3 characters long'
            }
        },
        genre: {
            type: String,
            enum: ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY'],
            required: true
        },
        isbn: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true,
            trim: true,
            validate: {
                validator: validateText,
                message: 'ISBN must be at least 3 characters long'
            }
        },
        description: { type: String },
        copies: {
            type: Number,
            required: true,
            min: [0, 'Copies must be a positive number']
        },
        available: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

bookSchema.methods.updateAvailability = function () {
    this.available = this.copies > 0;
};

bookSchema.pre('save', function (next) {
    this.available = this.copies > 0;
    next();
});

export const Book = model<IBookDocument>('Book', bookSchema);