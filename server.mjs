import express from "express";
import cheerio from "cheerio";
import axios from "axios";
import http from "http";
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;
import cors from "cors";
app.use(cors());

const url = "https://www.theguardian.com/uk";

app.get("/", function (req, res) {
	res.json("This is my webscraper");
});

//app.get('/results', (req, res) => {
axios(url)
	.then((response) => {
		const html = response.data;
		const $ = cheerio.load(html);
		const articles = [];

		$(".fc-item__title", html).each(function () {
			const title = $(this).text();
			const url = $(this).find("a").attr("href");
			articles.push({
				title,
				url,
			});
		});
		//res.json(articles);
	})
	.catch((err) => console.log(err));

//})

server.listen(port, () => {
	console.log(`app listening at Port: ${port}`);
});
