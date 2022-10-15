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
	console.log("SEARCHALGO: ", searchAlgorithm);
	let filter = searchAlgorithm
		.filter(
			(e) =>
				e.includes('<td class="tdaktionen">103</td>') ||
				e.includes(",103</td>") ||
				e.includes('<td class="tdaktionen">103')
		)
		.map((e) => {
			return { info: e, type: type };
		});
	if (filter.length == 0) {
		filter = [{ info: "No substitute lessons", type: type }];
	}
	// Tryes to get the last table which usually holds the additional Information on the substition plan
	try {
		additionalInformation = await page
			.$("table:last-of-type")
			.then((e) => e.getProperty("className"))
			.then((cn) => cn.jsonValue())
			.then(async (cn) => {
				if (cn == "") {
					let innerHTML = await page.$eval("table:last-of-type", (e) => e.innerHTML);
					return { info: innerHTML, type: type };
				} else {
					return { info: "---", type: type };
				}
			});
	} catch (err) {
		additionalInformation = { info: "---", type: type };
	}
	if (type === "tomorrow") {
		let date = await page.$eval("span.vpfuerdatum", (e) => e.innerHTML);
		return { data: filter, additional: additionalInformation, date: date };
	}
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
	let ul_children = await page.$$eval(".vertretungsplaene > li", (e) => {
		let array = [];
		e.forEach((e) => array.push(e.outerHTML));
		return array;
	});
	if (ul_children.length > 1) {
		let URLpath = await page.$eval(".vertretungsplaene > li:first-child > a", (e) => e.href);
		await page.goto(URLpath, { waitUntil: "load" });
		const td = await search("today", page);
		await page.goBack({ waitUntil: "load" });
		URLpath = await page.$eval(".vertretungsplaene > li:last-child > a", (e) => e.href);
		await page.goto(URLpath);
		const tm = await search("tomorrow", page);
		await browser.close();
		return [td, tm];
	} else {
		let URLpath = await page.$eval(".vertretungsplaene > li:first-child > a", (e) => e.href);
		await page.goto(URLpath, { waitUntil: "load" });
		const tm = await search("tomorrow", page);
		return [
			{
				data: [{ info: "No substitute lessons", type: "today" }],
				additional: { info: "---", type: "today" },
			},
			tm,
		];
	}
};

export { gatherData };
