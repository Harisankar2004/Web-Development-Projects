// server.js
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Set up static file serving
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "public")));

// --- In-memory data store (CRUD demo) ---
let users = [
  { id: uuidv4(), name: "Alice", email: "alice@example.com" },
  { id: uuidv4(), name: "Bob", email: "bob@example.com" }
];

// --- CRUD API Endpoints ---

// READ all
app.get("/api/users", (req, res) => {
  res.json(users);
});

// CREATE
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email)
    return res.status(400).json({ message: "Name and email are required" });
  const newUser = { id: uuidv4(), name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// UPDATE
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.name = name || user.name;
  user.email = email || user.email;
  res.json(user);
});

// DELETE
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter((u) => u.id !== id);
  res.json({ message: "User deleted successfully" });
});

// Serve front-end
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// --- Start Server ---
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

