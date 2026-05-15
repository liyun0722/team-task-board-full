import type { FilterMode, Task } from "../types/task";

function isVisible(task: Task): boolean {
  return !task.archived;
}

export function filterTasks(tasks: Task[], mode: FilterMode): Task[] {
  switch (mode) {
    case "all":
      return tasks.filter(isVisible);
    case "active":
      return tasks.filter((t) => isVisible(t) && !t.completed);
    case "completed":
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}

export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) return tasks;
  
  const searchTerms = query.toLowerCase().split(/\s+/);
  
  return tasks.filter((task) => {
    const titleLower = task.title.toLowerCase();
    return searchTerms.some(term => titleLower.includes(term));
  });
}

