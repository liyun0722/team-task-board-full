 /*import { test, expect } from '@playwright/test';

test('User can create and delete a task', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // CREATE a task
  await page.fill('input[placeholder="What needs doing?"]', 'Buy milk');
  await page.click('button:has-text("Add task")');
  
  // Verify task appears
  await expect(page.locator('text=Buy milk')).toBeVisible();
  
  // DELETE the task
  await page.click('button:has-text("Delete")');
  
  // Verify task is gone
  await expect(page.locator('text=Buy milk')).not.toBeVisible();
});

 test('User can complete a task', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // CREATE a task
  await page.fill('input[placeholder="What needs doing?"]', 'Complete me');
  await page.click('button:has-text("Add task")');
  
  // Verify task appears
  await expect(page.locator('text=Complete me')).toBeVisible();
  
  // Click checkbox to complete - wait a moment
  const checkbox = page.locator('input[type="checkbox"]').first();
  await checkbox.click();
  
  // Wait for state to update
  await page.waitForTimeout(500);
  
  // Filter to completed tasks
  await page.click('button:has-text("Completed")');
  
  // Wait for filter to apply
  await page.waitForTimeout(500);
  
  // Take screenshot to debug
  await page.screenshot({ path: 'completed-filter.png' });
  
  // Check if task appears in completed filter
  const completedTask = page.locator('text=Complete me');
  const isVisible = await completedTask.isVisible().catch(() => false);
  
  if (!isVisible) {
    // Log what tasks are visible
    const visibleText = await page.locator('.task-item').allTextContents();
    console.log('Visible tasks after filter:', visibleText);
  }
  
  await expect(completedTask).toBeVisible();
  
  // Filter back to All
  await page.click('button:has-text("All")');
  
  // Clean up - delete the task
  await page.click('button:has-text("Delete")');
});

test('Validation prevents empty task', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  // Try to add empty task
  await page.click('button:has-text("Add task")');
  
  // Should show error message
  await expect(page.locator('.form-error')).toBeVisible();
});*/
import { test, expect } from '@playwright/test';
import { TaskBoard } from './helpers/task-helpers';

test.describe('Critical User Journeys', () => {
  let board: TaskBoard;

  test.beforeEach(async ({ page }) => {
    board = new TaskBoard(page);
    await board.goto();
  });

  test('User can create and delete a task', async () => {
    await board.createTask('Buy milk');
    await board.deleteTask('Buy milk');
  });

  test('User can complete a task', async () => {
    await board.createTask('Complete me');
    await board.completeFirstTask();
    await board.filterBy('Completed');
    await board.taskShouldBeVisible('Complete me');
    await board.filterBy('All');
    await board.deleteTask('Complete me');
  });

  test('Validation prevents empty task', async () => {
    await board.addEmptyTask();
    await expect(board.getErrorMessage()).toBeVisible();
  });
});