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