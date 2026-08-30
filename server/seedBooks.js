const mongoose = require("mongoose");
const dns = require("dns");

require("dotenv").config();

const Book = require("./models/Book");

// Use Google DNS for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "Learn how small habits can create remarkable changes.",
    price: 650,
    category: "Self Help",
    image: "https://picsum.photos/300/400?random=1",
    stock: 20,
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    description: "A practical guide to writing clean and maintainable software.",
    price: 800,
    category: "Programming",
    image: "https://picsum.photos/300/400?random=2",
    stock: 15,
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A timeless story about dreams, destiny, and finding your path.",
    price: 500,
    category: "Fiction",
    image: "https://picsum.photos/300/400?random=3",
    stock: 25,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    description: "Explore how people think about money, wealth, and financial decisions.",
    price: 700,
    category: "Finance",
    image: "https://picsum.photos/300/400?random=4",
    stock: 18,
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    description: "A popular introduction to financial education and wealth building.",
    price: 550,
    category: "Finance",
    image: "https://picsum.photos/300/400?random=5",
    stock: 22,
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A classic novel about wealth, love, ambition, and the American Dream.",
    price: 450,
    category: "Classic",
    image: "https://picsum.photos/300/400?random=6",
    stock: 12,
  },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Book.deleteMany();

    await Book.insertMany(books);

    console.log("Books added successfully!");

    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Seed error:", error);
  }
};

seedBooks();