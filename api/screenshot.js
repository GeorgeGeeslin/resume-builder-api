import chromium from "chrome-aws-lambda";
import handler from "../libs/handler-lib";

export const main = handler(async (event, context) => {

    // get POST body.
    const html = JSON.parse(event.body);

    //Create browser object
    const browser = await chromium.puppeteer.launch({
        headless: true,
        executablePath: await chromium.executablePath,
        args: chromium.args
    });

    //Create page object.
    const page = await browser.newPage();

    page.setViewport({width: 816, height: 1056, deviceScaleFactor: 1});

    //Build page from html string.
    await page.setContent(html.data);

    const png = await page.screenshot({
        encoding: "base64",
        type: "png",

    });

    return png;
});