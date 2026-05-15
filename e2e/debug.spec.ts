import { test, expect } from '@playwright/test';

test('Debug - see what\'s on the page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Create a task
  await page.fill('input[placeholder="What needs doing?"]', 'Debug Task');
  await page.click('button:has-text("Add task")');
  
  // Wait and take screenshot
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'debug.png' });
  
  // Log all text content
  const text = await page.locator('body').innerText();
  console.log('Page text:', text);
  
  // Check for the task
  const taskVisible = await page.locator('text=Debug Task').isVisible();
  console.log('Task visible:', taskVisible);
});