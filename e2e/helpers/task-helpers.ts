import { Page, expect } from '@playwright/test';

export class TaskBoard {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5173/');
  }

  async createTask(name: string) {
    await this.page.fill('input[placeholder="What needs doing?"]', name);
    await this.page.click('button:has-text("Add task")');
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  async deleteTask(name: string) {
    await this.page.click('button:has-text("Delete")');
    await expect(this.page.locator(`text=${name}`)).not.toBeVisible();
  }

  async completeFirstTask() {
    await this.page.locator('input[type="checkbox"]').first().click();
    await this.page.waitForTimeout(300);
  }

  async filterBy(filter: 'All' | 'Active' | 'Completed') {
    await this.page.click(`button:has-text("${filter}")`);
    await this.page.waitForTimeout(300);
  }

  async taskShouldBeVisible(name: string) {
    await expect(this.page.locator(`text=${name}`)).toBeVisible();
  }

  async taskShouldNotBeVisible(name: string) {
    await expect(this.page.locator(`text=${name}`)).not.toBeVisible();
  }

  async addEmptyTask() {
    await this.page.click('button:has-text("Add task")');
  }

  getErrorMessage() {
    return this.page.locator('.form-error');
  }
}