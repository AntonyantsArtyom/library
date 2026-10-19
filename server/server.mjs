import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ensure directories exist
const coversDir = path.join(__dirname, "uploads", "covers");
const booksDir = path.join(__dirname, "uploads", "books");
const dataDir = path.join(__dirname, "data");

[coversDir, booksDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "cover") {
      cb(null, coversDir);
    } else if (file.fieldname === "file") {
      cb(null, booksDir);
    } else {
      cb(null, path.join(__dirname, "uploads"));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Helper function to read books data
const readBooksData = () => {
  const filePath = path.join(dataDir, "books.json");
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
};

// Helper function to write books data
const writeBooksData = (books) => {
  const filePath = path.join(dataDir, "books.json");
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
};

// API Routes

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route works" });
});

// GET all books
app.get("/api/books", (req, res) => {
  try {
    const books = readBooksData();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to read books data" });
  }
});

// POST increment download count
app.post("/api/books/:id/download", (req, res) => {
  console.log("POST /api/books/:id/download called with id:", req.params.id);
  try {
    const id = parseInt(req.params.id);
    const books = readBooksData();
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      console.log("Book not found with id:", id);
      return res.status(404).json({ error: "Book not found" });
    }

    // Initialize downloadCount if it doesn't exist
    if (!books[bookIndex].downloadCount) {
      books[bookIndex].downloadCount = 0;
    }

    books[bookIndex].downloadCount += 1;
    writeBooksData(books);

    console.log("Download count updated to:", books[bookIndex].downloadCount);
    res.json({ downloadCount: books[bookIndex].downloadCount });
  } catch (error) {
    console.error("Error incrementing download count:", error);
    res.status(500).json({ error: "Failed to increment download count" });
  }
});

// GET single book by ID
app.get("/api/books/:id", (req, res) => {
  try {
    const books = readBooksData();
    const book = books.find((b) => b.id === parseInt(req.params.id));
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Failed to read book data" });
  }
});

// POST new book with file uploads
app.post("/api/books", upload.fields([{ name: "cover" }, { name: "file" }]), (req, res) => {
  try {
    const { title, author, genres } = req.body;

    if (!title || !author || !genres) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const books = readBooksData();
    const newId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;

    const files = req.files;
    const coverPath = files.cover ? `uploads/covers/${files.cover[0].filename}` : "uploads/covers/default.svg";
    const filePath = files.file ? `uploads/books/${files.file[0].filename}` : "uploads/books/default.epub";

    const newBook = {
      id: newId,
      title,
      author,
      genres: Array.isArray(genres) ? genres : genres.split(","),
      cover: coverPath,
      file: filePath,
      downloadCount: 0,
    };

    books.push(newBook);
    writeBooksData(books);

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Failed to create book" });
  }
});

// DELETE book by ID
app.delete("/api/books/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const books = readBooksData();
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({ error: "Book not found" });
    }

    const book = books[bookIndex];

    // Delete associated files
    const coverPath = path.join(__dirname, book.cover);
    const filePath = path.join(__dirname, book.file);

    if (fs.existsSync(coverPath) && !book.cover.includes("default")) {
      fs.unlinkSync(coverPath);
    }
    if (fs.existsSync(filePath) && !book.file.includes("default")) {
      fs.unlinkSync(filePath);
    }

    books.splice(bookIndex, 1);
    writeBooksData(books);

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
