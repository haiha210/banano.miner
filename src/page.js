
const puppeteer = require('puppeteer'),
	ENUM = require('./enum.js');

class Page {

	get app() {
		return this.core.app;
	}

	constructor(core) {
		this.log = (...arg) => core.log(...arg);
		this.health = (...arg) => core.health(...arg);
		this.core = core;
	}

	async load() {
		let url = `https://powerplant.banano.cc/?address=${this.core.app.account}`
		let exitProcess = false;
		let inputStartXpath = "//center/table[@class='coinimp_miner']/tbody/tr[5]/td/input[1]";
		let browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
		let page = await browser.newPage();
		await page.goto(url);
		await page.waitForXPath(inputStartXpath);
		let inputStart = await page.$x(inputStartXpath);
		if (inputStart.length > 0) {
			await page.evaluate(thread => {
				web_client.setNumThreads(thread)
			}, this.core.app.thread)
			await inputStart[0].click();
		} else {
			exitProcess = true;
		}
		return new Promise(resolve => resolve({ browser, exitProcess }));
	}

}

module.exports = Page;
