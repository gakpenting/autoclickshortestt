const puppeteer = require('puppeteer');
// console.log(`${__dirname}/ublock/ublock`)

async function scrape(link) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: true, defaultViewport: null,
            args: [`--disable-extensions-except=${__dirname}/ublock/ublock`, `--load-extension=${__dirname}/ublock/ublock`]
        });
        try {
            const page = await browser.newPage();
            await page.goto(link);
            await page.waitFor(10000)
            await page.click("#skip_button")
            await page.waitFor(3000)
            let title = await page.url();
            await page.waitForNavigation({ waitUntil: 'networkidle0' })
            // while (title.trim() === link.trim()) {
            //     title = await page.url()
            //     // await page.waitFor(1000)
            // }
            resolve(title)
            await browser.close();
        } catch (e) {
            await browser.close();
            reject(e.message)
        }

    })

}
async function tryAgain(link) {
    return new Promise(async (resolve, reject) => {
        try {
            const title = await scrape(link);
            resolve(title)
        } catch (e) {
            console.log("try again")
            // await browser.close();
            await sleep(3000)
            const title = await runUntilWorks(link);
            resolve(title)
        }
    })

}
async function runUntilWorks(link) {
    return new Promise(async (resolve, reject) => {
        try {
            const title = await scrape(link);
            resolve(title)
        } catch (e) {
            console.log("try again")
            // await browser.close();
            await sleep(3000)
            const title = await tryAgain(link);
            resolve(title)
        }
    })
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}
const argv = require('yargs').argv
async function readFile(file) {
    var fs = require('fs');

    var contents = fs.readFileSync(file, 'utf8');
    const links = contents.split("\n")

    console.log(links)
    let pop = []
    for (let i = 0; i < links.length; i++) {

        console.log(links[i].replace(/(?:\r\n|\r|\n)/g, ''))
        const hasil = await runUntilWorks(links[i].replace(/(?:\r\n|\r|\n)/g, ''))
        pop.push(hasil)
        console.log(hasil)
    }
    var fs = require('fs');
    fs.writeFileSync('final_link.txt', pop.join('\n '));
}
readFile(argv.file)
// runUntilWorks()