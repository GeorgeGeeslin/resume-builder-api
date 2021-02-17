import chromium from "chrome-aws-lambda";
import handler from "../libs/handler-lib";

export const main = handler(async (event, context) => {

    // get POST body.
    const data = JSON.parse(event.body);

    // options
    const pageRange = event.pageRange ? event.pageRange : '1-2';

    //Create browser object
    const browser = await chromium.puppeteer.launch({
        headless: true,
        executablePath: await chromium.executablePath,
        args: chromium.args
    });

    //Create page object.
    const page = await browser.newPage();

    //Build page from html string.
    await page.setContent(data.html);

    // Create pdf file with puppeteer
    const pdf = await page.pdf(
        {
            format: 'Letter',
            margin: {
                top: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
                right: '0.5in'
            },
            pageRanges: pageRange
        }
    );

    const resume = pdf.toString('base64');

    return resume;
});