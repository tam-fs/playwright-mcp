import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class Helper {
  /**
   * Take a screenshot and save it to the screenshots folder
   * @param page - Playwright page object
   * @param name - Name of the screenshot
   */
  static async takeScreenshot(page: Page, name: string): Promise<void> {
    const screenshotDir = path.join(process.cwd(), 'test-results', 'screenshots');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${name}-${timestamp}.png`;
    const filepath = path.join(screenshotDir, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`Screenshot saved: ${filepath}`);
  }
}
