/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask
} from './fakeTaskApi';
import type { TaskInput } from '../types/task';

describe('fakeTaskApi', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getTasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const tasks = await getTasks();
      expect(tasks).toEqual([]);
    });

    it('should return tasks from localStorage', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', completed: false, priority: 'high', dueDate: null, archived: false, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
      ];
      localStorage.setItem('team-task-board:tasks', JSON.stringify(mockTasks));
      
      const tasks = await getTasks();
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a new task successfully', async () => {
      const input: TaskInput = {
        title: 'Test Task',
        priority: 'high',
        dueDate: '2024-12-31',
      };
      
      const task = await createTask(input);
      
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.priority).toBe('high');
      expect(task.completed).toBe(false);
      expect(task.archived).toBe(false);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should save task to localStorage', async () => {
      const input: TaskInput = {
        title: 'Saved Task',
        priority: 'medium',
        dueDate: null,
      };
      
      await createTask(input);
      const tasks = await getTasks();
      
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe('Saved Task');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const input: TaskInput = { 
        title: 'Original', 
        priority: 'low', 
        dueDate: null,
      };
      const created = await createTask(input);
      
      const updated = await updateTask(created.id, { title: 'Updated', completed: true });
      
      expect(updated.title).toBe('Updated');
      expect(updated.completed).toBe(true);
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it('should throw error when task not found', async () => {
      await expect(updateTask('non-existent-id', { title: 'New' }))
        .rejects
        .toThrow('Task non-existent-id not found');
    });
  });

 describe('deleteTask', () => {
  it('should delete a task', async () => {
    const input: TaskInput = {
      title: 'To Delete',
      priority: 'high',
      dueDate: null,
    };
    await createTask(input);
    
    let tasks = await getTasks();
    expect(tasks).toHaveLength(1);
    
    // deleteTask returns the remaining tasks
    const remainingTasks = await deleteTask(tasks[0].id);
    expect(remainingTasks).toHaveLength(0);
    
    // Also verify with getTasks
    tasks = await getTasks();
    expect(tasks).toHaveLength(0);
  });
});

describe('Edge Cases - Error Recovery', () => {
  it('should gracefully handle corrupted localStorage data without crashing', async () => {
    // Simulate corrupted JSON in localStorage
    localStorage.setItem('team-task-board:tasks', 'this is not valid json!!!');
    
    // Should not throw an error, should return empty array
    const tasks = await getTasks();
    
    expect(tasks).toEqual([]);
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should handle malformed task data (missing required fields)', async () => {
    // Store malformed task data
    const malformedData = JSON.stringify([
      { id: '1' }, // Missing title, priority, etc.
      { title: 'Valid Task', priority: 'high' } // Missing id
    ]);
    localStorage.setItem('team-task-board:tasks', malformedData);
    
    // Should return empty array or filter out malformed tasks
    const tasks = await getTasks();
    
    // The app should not crash - it should handle gracefully
    expect(Array.isArray(tasks)).toBe(true);
  });

  it('should handle very long task titles (1000+ characters)', async () => {
    const longTitle = 'A'.repeat(1000);
    
    const task = await createTask({
      title: longTitle,
      priority: 'low',
      dueDate: null,
    });
    
    expect(task.title).toBe(longTitle);
    expect(task.title.length).toBe(1000);
    
    // Verify it was saved and retrieved correctly
    const tasks = await getTasks();
    expect(tasks[0].title).toBe(longTitle);
  });

  it('should handle special characters and Unicode/emoji in titles', async () => {
    const specialTitle = '!@#$%^&*()_+{}|:"<>?~` 测试 🎉🚀✨';
    
    const task = await createTask({
      title: specialTitle,
      priority: 'high',
      dueDate: null,
    });
    
    expect(task.title).toBe(specialTitle);
  });

  it('should handle simultaneous operations (race conditions)', async () => {
    // Create multiple tasks concurrently
    const promises = [
      createTask({ title: 'Task 1', priority: 'low', dueDate: null }),
      createTask({ title: 'Task 2', priority: 'medium', dueDate: null }),
      createTask({ title: 'Task 3', priority: 'high', dueDate: null }),
    ];
    
    const results = await Promise.all(promises);
    expect(results).toHaveLength(3);
    
    const tasks = await getTasks();
    expect(tasks).toHaveLength(3);
    
    const titles = tasks.map(t => t.title);
    expect(titles).toContain('Task 1');
    expect(titles).toContain('Task 2');
    expect(titles).toContain('Task 3');
  });
});

});