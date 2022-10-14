import puppeteer from "puppeteer";
const url = "https://www.sachsen.schule/~humboldt-leipzig/vertretungsplan/login.html";
/**
 * 
 * @param {*} type `String` valid arguments are "tomorrow" and "today"
 * @param {*} page the puppeteer page instance
 * @returns an object with the substition lessons for one day stored in the `data` property and the additional information stored  in the `additional` property
 * @since 1.2.1
 */
const search = async (type, page) => {
	let additionalInformation;
	const searchAlgorithm = await page.$$eval(".tablekopf tr", (e) => {
		return e.map((e) => e.innerHTML);
	});
	const filter = searchAlgorithm
		.filter((e) => e.includes(">103<"))
		.map((e) => {
			return { info: e, type: type };
		});
	// Tryes to get the 5th table which usually holds the additional Information on the substition plan
	try {
		additionalInformation = await page.$$eval("table", (e) => {
			return e[4].innerHTML;
		});
	} catch (err) {
		additionalInformation = "---";
	}
	console.log("table", additionalInformation);
	return { data: filter, additional: additionalInformation };
};

/**
 * @param void
 * @returns a `map` with all matching Substitution lessons
 * @since 1.2.0
 */
const gatherData = async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(url);
	await Promise.all([
		page.waitForNavigation(),
		page.$eval("input#xform-formular-field-1", (el) => (el.value = "humboldt")),
		page.$eval("input#xform-formular-field-2", (el) => (el.value = "1819jh")),
		page.click("input#xform-formular-field-3"),
		page.waitForNavigation(),
	]);

	let URLpath = await page.$eval(".vertretungsplaene > li:first-child > a", (e) => e.href);
	await page.goto(URLpath, { waitUntil: "load" });
	const td = await search("today", page);
	await page.goBack({ waitUntil: "load" });
	URLpath = await page.$eval(".vertretungsplaene > li:last-child > a", (e) => e.href);
	await page.goto(URLpath);
	const tm = await search("tomorrow", page);
	await browser.close();
	return [td, tm];
};

export { gatherData };
