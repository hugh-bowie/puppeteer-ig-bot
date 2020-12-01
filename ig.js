const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone X'];
const caseId = process.argv[2]; //node be.js 1226
const badEmail = process.argv[3]; // node be.js 1226 hughbowie@me.com

(async () => {
	try {
		const browser = await puppeteer.launch({ headless: false });
		const page = await browser.newPage();
		await page.emulate(iPhone);
		//LOGIN
		await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher');
		await page.waitForSelector("[name='username']");
		await page.click("[name='username']");
		await page.type("[name='username']", 'hb.iv');
		await page.keyboard.press('Tab');
		await page.keyboard.type('Fabweld112358');
		//FIRST OPTIONAL SCREEN 
		await page.evaluate(() => {
			const btns = [...document.querySelector('.HmktE').querySelectorAll('button')];
			btns.forEach(function (btn) {
				if (btn.innerText === 'Log In') {
					btn.click();
				}
			});
		});
		await page.waitForNavigation();
	//2ND OPTIONAL SCREEN 
		await page.evaluate(() => {
			const btns2 = [...document.querySelector('#react-root').querySelectorAll('button')];
			btns2.forEach(function (btn2) {
				if (btn2.innerText === 'Not Now') {
					btn2.click();
				}
			});
		});
		await page.waitForNavigation();
				//3rd OPTIONAL SCREEN 
		await page.evaluate(() => {
			const btns3 = [...document.querySelector('#react-root').querySelectorAll('button')];
			btns3.forEach(function (btn3) {
				if (btn3.innerText === 'Cancel') {
					btn3.click();
				}
			});
		});
		await page.waitForNavigation();
		//await page.waitForSelector('#react-root > section > nav > div > div > div > div > div > div:nth-child(2) > a > svg');

		/*await page.click('#react-root > section > main > article > div > div > div > div:nth-child(2) > button');
		// LOGIN INPUT DETAILS
		await page.click('#loginForm > div > div:nth-child(1) > div > label > input');
		await page.type('#loginForm > div > div:nth-child(1) > div > label > input', 'hb.iv');
		await page.click('#loginForm > div > div:nth-child(2) > div > label > input');
		await page.type('#loginForm > div > div:nth-child(2) > div > label > input', 'Fabweld112358');
		await Promise.all([page.waitForNavigation(), page.focus('#loginForm > div > div:nth-child(3) > button'), page.click('#loginForm > div > div:nth-child(3) > button')]);
		//DO STUFF*/
		//await browser.close();
		//process.exit(1);
	} catch (e) {
		console.log('error = ', e);
		//process.exit(1);
	}
})();
