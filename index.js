const puppeteer = require('puppeteer');
// console.log(`${__dirname}/ublock/ublock`)

async function scrape(link) {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({
            headless: true, defaultViewport: null,
            args: ['--blink-settings=imagesEnabled=false', `--disable-extensions-except=${__dirname}/ublock/ublock`, `--load-extension=${__dirname}/ublock/ublock`]
        });
        try {
            const page = await browser.newPage();

            await page.goto(link);
            let i = 0;
            page.on("response", async e => {
                let po = await page.evaluate(() => {
                    return document.getElementById("detecting_bot_info").getAttribute("class")
                })
                console.log(po)
                if (po.indexOf("show") != -1) {
                    reject("s")
                    browser.close()
                }
                // if (e.request().resourceType() === "xhr") {
                //     console.log(e.request().resourceType())
                //     const pa = await e.text()
                //     console.log(pa)
                // }
                // if (i === 9) {
                //     throw new Error("s")
                //     // await browser.close();
                // }
                if (e.request().resourceType() === "script") {
                    console.log(e.request().resourceType())
                    const pa = await e.text()
                    if (pa.indexOf("destinationUrl") != -1) {
                        const hasilnya = pa.split("(")[1].replace(";", "").replace(")", "");
                        let me = JSON.parse(hasilnya).destinationUrl

                        resolve(me)
                        await browser.close();
                    }
                    // console.log(pa)
                }
            })


            // page.on("response", e => {
            //     console.log(e)
            // })
            // console.log("remove iframe")
            // page.waitFor(3000)
            // var aj = await page.evaluate(() => {
            //     const j = document.getElementsByTagName("iframe");
            //     return j
            // })
            // while (aj === undefined) {
            //     aj = await page.evaluate(() => {
            //         const j = document.getElementsByTagName("iframe");
            //         return j
            //     })
            // }
            // await page.evaluate(() => {
            //     const j = document.getElementsByTagName("iframe");
            //     j.forEach(a => a.remove())
            //     // return j
            // })

            // await page.click("#skip_button")
            // console.log("skip")
            // await page.waitFor(3000)
            // console.log("get the url")
            // var title = await page.url();
            // let i = 0;
            // // await page.waitForNavigation({ waitUntil: 'networkidle0' })

            // while (title.trim() === link.trim()) {
            //     i++
            //     title = await page.url()
            //     if (i === 3) {
            //         break;
            //     }
            //     // await page.waitFor(1000)
            // }
            // if (title.trim() === link.trim()) {
            //     throw new Error("try")
            // } else {
            //     resolve(title)
            // }


        } catch (e) {
            reject(e.message)
            await browser.close();

        }

    })

}
async function tryAgain(link) {
    return new Promise(async (resolve, reject) => {
        try {
            const title = await scrape(link);
            resolve(title)
        } catch (e) {
            // reject(e.message)
            console.log("try again 2")
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
            // reject(e.message)
            console.log("try again 1")
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
    fs.writeFileSync('final_link.txt', pop.join('\n'));
    console.log("FINISH")
}
readFile(argv.file)
// runUntilWorks()