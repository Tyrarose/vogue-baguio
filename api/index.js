import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views")); // Adjust path since it's inside "api"
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

async function loadArticles() {
	try {
		const rawData = await fs.readFile(path.join(__dirname, "../articles.json"), "utf8");
		return JSON.parse(rawData);
	} catch (error) {
		console.error("Error reading the JSON file:", error);
		return [];
	}
}

// Home page route
app.get("/", async (req, res) => {
	const articles = await loadArticles();
	const mainFeaturedArticle = articles.find((article) => article.id === "1");
	res.render("index", {
		articles,
		mainFeaturedArticle,
	});
});

// Individual post route
app.get("/post/:id", async (req, res) => {
	const articles = await loadArticles();
	const article = articles.find((article) => article.id === req.params.id);
	if (article) {
		res.render("article", { article });
	} else {
		res.status(404).send("Article not found");
	}
});

// ✅ Export the handler for Vercel
export default app;
