const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

const PORT = process.env.PORT || 5000;

// Get all movies
app.get("/peliculas", (req, res) => {
    db.query("SELECT * FROM peliculas", (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Get a single movie
app.get("/peliculas/:id", (req, res) => {
    db.query("SELECT * FROM peliculas WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results[0]);
    });
});

// Add a new movie
app.post("/peliculas", (req, res) => {
    const { nombre, año_de_lanzamiento, genero } = req.body;
    db.query(
        "INSERT INTO peliculas (nombre, año_de_lanzamiento, genero) VALUES (?, ?, ?)",
        [nombre, año_de_lanzamiento, genero],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ id: result.insertId });
        }
    );
});

// Update a movie
app.put("/peliculas/:id", (req, res) => {
    const { nombre, año_de_lanzamiento, genero } = req.body;
    db.query(
        "UPDATE peliculas SET nombre = ?, año_de_lanzamiento = ?, genero = ? WHERE id = ?",
        [nombre, año_de_lanzamiento, genero, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err });
            res.json({ message: "Movie updated" });
        }
    );
});

// Delete a movie
app.delete("/peliculas/:id", (req, res) => {
    db.query("DELETE FROM peliculas WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "Movie deleted" });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
