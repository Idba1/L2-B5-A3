import { Server } from 'http';
import mongoose from 'mongoose';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();
let server: Server;

const PORT = 5000;

async function main() {
    try {
        // await mongoose.connect("mongodb+srv://mogodb:Adyy322qumx0jYRZ@cluster0.wwse58h.mongodb.net/assignment-3?retryWrites=true&w=majority&appName=Cluster0");
        // await mongoose.connect("mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wwse58h.mongodb.net/assignment-3?retryWrites=true&w=majority&appName=Cluster0");
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wwse58h.mongodb.net/assignment-3?retryWrites=true&w=majority&appName=Cluster0`);
        console.log("Connected to MongoDB Using Mongoose!!");
        server = app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
}

main()
