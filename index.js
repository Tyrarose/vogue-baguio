import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import articles from "./articles.js";

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));



// let articles = [];

// // Load articles before starting the server
// async function loadArticles() {
// 	try {
// 		const rawData = await fs.readFile(path.join(__dirname, "articles.js"), "utf8");
// 		articles = JSON.parse(rawData);
// 		console.log("Articles loaded successfully.");
// 	} catch (error) {
// 		console.error("Error reading the JSON file:", error);
// 	}
// }

// Add error handling middleware
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.avif')) {
        res.set('Content-Type', 'image/avif');
      }
      if (filePath.endsWith('.webp')) {
        res.set('Content-Type', 'image/webp');
      }
    }
  }));

// Basic error logging
app.on('error', (error) => {
    console.error('Server error:', error);
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
}).on('error', (e) => {
    console.error('Server failed to start:', e);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server shutdown completed');
    });
});

// Home page that lists articles
app.get("/", (req, res) => {
	const mainFeaturedArticle = articles.find(a => a.id === "1"); // ID is a string
	res.render("index", { articles, mainFeaturedArticle });
});


// Individual post page
app.get("/article/:id", (req, res) => {
	const article = articles.find(a => a.id === req.params.id); // Match as a string
	if (!article) return res.status(404).send("Article not found");
	res.render("article", { article });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Only start server if running directly (not in Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


export default app;