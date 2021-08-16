require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { device, timeStamp, r, targetAccounts } = require('./src/helpers');
const r23 = r(2000, 3000);
let randomAccount = Math.floor(Math.random() * targetAccounts.length);
puppeteer.use(StealthPlugin());
console.log(process.env.SAVE_PATH + timeStamp + '.png');

(async () => {
	try {
		//----initialize
		const browser = await puppeteer.launch({ headless: true, args: ['--incognito'] });/*slowMo: 100,*/
		const page = await browser.newPage();
		await page.emulate(device);

		//----login
		await page.goto('https://www.instagram.com/accounts/login/?source=auth_switcher', { waitUntil: 'load' });
		await page.waitForSelector("[name='username']");
		await page.tap("[name='username']");
		await page.type("[name='username']", process.env.IG_USER, { delay: r(50, 100) });
		await page.type("[name='password']", process.env.IG_PW, { delay: r(50, 100) });
		await page.screenshot({ path: process.env.SAVE_PATH + timeStamp + '.png', fullPage: true });
		await Promise.all([page.waitForNavigation(), page.tap("[type='submit']")]);
		await page.waitForTimeout(r23);

		//----click notifications
		const notifyBtn = await page.$x('//button[contains(text(), "Not Now")]');
		if (notifyBtn.length > 0) {
			await notifyBtn[0].tap();
			await page.waitForTimeout(r23);
		} else {
			console.log('no notifaction buttons to click');
		}

		//----go to one of the target accounts
		await page.goto(targetAccounts[randomAccount], { waitUntil: 'networkidle2' });
		await page.waitForTimeout(r23);
		console.log('Random Account to Farm: ' + targetAccounts[randomAccount]);

		//----click one random post
		const posts = await page.$x('//*[@class="FFVAD"]');
		if (posts.length > 0) {
			await posts[r(0, posts.length)].tap();
			console.log(await page.url());
			await page.waitForTimeout(r23);
		} else {
			console.log('No Posts found: ' + posts.length);
		}

		//----click the Likes number on the photo
		await page.tap('[href$="liked_by/"]');
		await page.waitForTimeout(r23);

		//----pagedown 4 times to get 72 followers to choose from
		let i;
		for (i = 0; i < 4; i++) {
			await page.keyboard.press('PageDown');
			await page.waitForTimeout(r23);
		}
		//----DYNAMICLY CRAWL OVER EACH FOLLOWER
		let likers = await page.$$eval('a[title]', lis => lis.map(li => li.getAttribute('href')));
		let x;
		//----ADJUST THIS AMMOUNT OF PROFILES TO GO TO
		let y = r(7, 9);
		if (likers.length > 0) {
			for (x = 0; x < y; x++) {
				//----repeat random between 5 to 10 times
				let num = r(0, likers.length);
				//----goto first random link
				await page.goto('https://www.instagram.com' + likers[num]);
				await page.waitForSelector('#react-root');
				await page.waitForTimeout(r23);
				console.log(await page.url());

				//----get This users top 24 posts
				let posts = await page.$x('//*[@class="FFVAD"]');
				//----if users posts are public
				if (posts.length > 0) {
					let p = r(0, posts.length);
					//----click One random Public post to like
					await posts[p].tap();
					await page.waitForTimeout(r23);

					//----get all the like buttons----
					let likeBtn = await page.$x('//*[@aria-label="Like"]');
					if (likeBtn.length > 0) {
						//----SMASH THAT LIKE BUTTON
						await likeBtn[0].tap();
						await page.waitForTimeout(r23);
						console.log('Like Button Tapped');
					}
					// THIS USER HAS No Posts, Request to follow
				} else {
					let follow = await page.$x("//button[contains(text(), 'Follow')]");
					if (follow.length > 0) {
						await follow[0].tap();
						console.log('----Followed Private Page: ' + await page.url());
						await page.waitForTimeout(r23);
					}
				}
			}
		}
		//BACK AND CLOSE BROWSER*/
		await browser.close();
		process.exit(1);
	} catch (e) {
		console.log('error = ', e);
		process.exit(1);
	}
})();

//----accept_cookies
/*const cookieBtn = await page.$x("//button[contains(text(), 'Accept')]");
if (cookieBtn.length > 0) {
	await cookieBtn[0].tap();
	await page.waitForTimeout(r(1000, 2000));
} else {
	console.log('no notifaction buttons to click');
}*/
