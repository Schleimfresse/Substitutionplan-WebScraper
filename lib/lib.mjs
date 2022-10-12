import puppeteer from "puppeteer";
const url = "https://www.sachsen.schule/~humboldt-leipzig/vertretungsplan/login.html";

/**
 * @param no parameters needed
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
    const URLpath = await page.$eval(".vertretungsplaene > li:last-child > a", (e) => e.href);
    page.goto(URLpath);
    await page.waitForNavigation();
    const searchAlgorithm = await page.$$eval(".tablekopf tr", (e) => {
        return e.map((elm) => elm.innerHTML);
    });
    await browser.close();
    const filter = searchAlgorithm.filter((e) => e.includes("053")).map((e) => { return {info: e}});
    return filter
};

export {gatherData};