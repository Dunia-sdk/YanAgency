import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ROUTES = [
    '/login',
    '/signup',
    '/dashboard',
    '/vehicles',
    '/reservations',
    '/clients',
    '/team',
    '/billing',
    '/payments',
    '/notifications',
    '/reporting',
    '/settings'
];

const BASE_URL = 'http://localhost:5174';
const OUTPUT_DIR = path.join(process.cwd(), 'UI UX');

async function extractPages() {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set viewport to a typical desktop size
    await page.setViewport({ width: 1440, height: 900 });

    console.log(`Starting extraction of ${ROUTES.length} routes...`);

    for (const route of ROUTES) {
        const url = `${BASE_URL}${route}`;
        console.log(`\nNavigating to ${url}...`);

        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Wait a bit extra to ensure all React animations/effects finish
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Get the full HTML content
            const htmlContent = await page.content();

            // We'll rename `/` as `index.html`, and others as `name.html`
            let fileName = route === '/' ? 'index' : route.replace('/', '');
            if (!fileName) fileName = 'index';
            fileName += '.html';

            const filePath = path.join(OUTPUT_DIR, fileName);

            fs.writeFileSync(filePath, htmlContent);
            console.log(`Saved: ${fileName}`);
        } catch (err) {
            console.error(`Error saving ${route}:`, err.message);
        }
    }

    await browser.close();
    console.log('\nExtraction complete!');
}

extractPages().catch(console.error);
