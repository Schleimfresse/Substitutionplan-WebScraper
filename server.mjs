import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
import cors from "cors";
import * as lib from "./lib/lib.mjs";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views/"));

// Routes

app.get("/", async (req, res) => {
	res.render(__dirname + "/public/views/index.ejs", { data: JSON.stringify(await lib.gatherData()) });
});

server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
