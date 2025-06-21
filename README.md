# 📚 Library Management System

A full-featured RESTful API built with **Express**, **TypeScript**, and **MongoDB** using **Mongoose**, designed to manage a library's collection of books and borrowing records.

---

## 🛠️ Features

- ✅ Add, update, get, delete books
- ✅ Borrow books with validation and availability logic
- ✅ Borrowed book summary with aggregation
- ✅ Filtering & sorting support for books
- ✅ Proper Mongoose schema validation
- ✅ Instance method & middleware usage
- ✅ Centralized error handling
- ✅ Clean folder structure with TypeScript interfaces

---

## 🚀 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB (via Mongoose)
- **Runtime Tools**: ts-node-dev

---

## 📁 Project Structure

```

Library-Management-System/
├── src/
│   ├── app/
│   │   ├── controllers/
│   │   │   ├── book.controller.ts
│   │   │   └── borrow\.controller.ts
│   │   ├── interfaces/
│   │   │   ├── book.interface.ts
│   │   │   └── borrow\.interface.ts
│   │   └── models/
│   │       ├── book.model.ts
│   │       └── borrow\.model.ts
│   ├── app.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── README.md

````

---

## ✅ Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or local MongoDB
- [Git](https://git-scm.com/)

---

## ⚙️ Installation & Setup

### 1. Clone the project

```bash
git clone https://github.com/Idba1/L2-B5-A3.git
cd L2-B5-A3
````

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MongoDB

Open `src/server.ts` and replace the MongoDB URI:

```ts
await mongoose.connect("YOUR_MONGODB_URI");
```

Use your own MongoDB URI (Atlas or local).

### 4. Run the server

```bash
npm run dev
```

The server will run at:

```
http://localhost:5000
```

---

## 📌 API Endpoints

### 📘 Book Routes

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/books`         | Create a new book           |
| GET    | `/api/books`         | Get all books (filter/sort) |
| GET    | `/api/books/:bookId` | Get book by ID              |
| PUT    | `/api/books/:bookId` | Update a book               |
| DELETE | `/api/books/:bookId` | Delete a book               |

**Filtering and Sorting Example:**

```
GET /api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5
```

---

### 📕 Borrow Routes

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| POST   | `/api/borrow` | Borrow a book                  |
| GET    | `/api/borrow` | Get borrow summary (aggregate) |

---

## 🧠 Business Logic

* Book must have `copies >= 0`
* Borrowing checks:

  * Book must exist
  * Enough copies must be available
  * Updates the book’s `available` status via **instance method**
* `createdAt` and `updatedAt` managed by Mongoose timestamps
* Aggregation used for summary in `/api/borrow`

---

## ✨ Developer Tips

* Update `tsconfig.json` to use:

  ```json
  {
    "compilerOptions": {
      "target": "ES6",
      "module": "CommonJS",
      "moduleResolution": "node",
      ...
    }
  }
  ```
* Use tools like **Postman** or **Insomnia** to test endpoints
* Logs will show when connected to MongoDB and server starts


## 🔒 Security Note

❗ Never expose your actual MongoDB URI publicly.
Use environment variables with `.env` and `dotenv` in real-world apps.

---

## 📄 License

This project is for academic purposes only.

---

## 🙌 Author

**Monira Islam Idba**
https://www.linkedin.com/in/monira-islam1/
