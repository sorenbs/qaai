import { type BrowserContext, type Page, chromium } from "playwright";

export class BrowserWindow {
    private browser!: BrowserContext;
    private page!: Page;

    async openUrl(url: string) {
        if (!this.browser && !this.page) {
            this.browser = await (await chromium.launch()).newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: 'videos', size: { width: 1280, height: 720 } } });
            this.page = await this.browser.newPage();
            await this.page.goto(url);
        }
    }

    async takeScreenshot() {
        return await this.page.screenshot();

    }

    async mouseClick(x: number, y: number) {
        await this.page.mouse.click(x, y);
    }

    async getVideoPath(): Promise<string | undefined> {
        return await this.page.video()?.path();
    }

    async stop() {
        await this.browser.close();
    }
}
