import express from 'express';
import { Request, Response } from 'express';
import { bookRoutes } from './app/controllers/book.controller';
import { borrowRoutes } from './app/controllers/borrow.controller';

const app = express();
app.use(express.json());

app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send(' Library Management API');
});

export default app;



