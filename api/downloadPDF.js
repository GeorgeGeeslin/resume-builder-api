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

    //Build page from html string.
    await page.setContent(html.data);

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
            pageRanges: '1-2'
        }
    );

    const resume = pdf.toString('base64');

    return resume;
});