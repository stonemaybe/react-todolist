export interface Todo {
  id: number;
  text: string;
  deadline: Date | null;
  completed: boolean;
}

export type FilterType = 'all' | 'completed' | 'pending' | 'overdue';
export type SortType = 'date' | 'alphabetical';