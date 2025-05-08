import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { Todo, FilterType, SortType } from '../types';

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string, deadline: Date | null) => void;
  updateTodo: (id: number, text: string, deadline: Date | null) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  sortType: SortType;
  setSortType: (sort: SortType) => void;
  filteredTodos: Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchText, setSearchText] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>('date');

  const addTodo = useCallback((text: string, deadline: Date | null) => {
    setTodos(prevTodos => [
      ...prevTodos,
      {
        id: Date.now(),
        text,
        deadline,
        completed: false,
      },
    ]);
  }, []);

  const updateTodo = useCallback((id: number, text: string, deadline: Date | null) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text, deadline } : todo
      )
    );
  }, []);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const filteredTodos = useMemo(() => {
    // First apply status filters
    let result = todos.filter(todo => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'completed') return todo.completed;
      if (activeFilter === 'pending') return !todo.completed;
      if (activeFilter === 'overdue') {
        return !todo.completed && 
               todo.deadline !== null && 
               new Date(todo.deadline) < new Date();
      }
      return true;
    });

    // Then apply text search filter
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      result = result.filter(todo => 
        todo.text.toLowerCase().includes(searchLower)
      );
    }

    // Finally sort the results
    return result.sort((a, b) => {
      if (sortType === 'alphabetical') {
        return a.text.localeCompare(b.text);
      } else { // sort by date
        if (a.deadline === null) return 1;
        if (b.deadline === null) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      }
    });
  }, [todos, activeFilter, searchText, sortType]);

  // Persist todos to localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        // Convert ISO date strings back to Date objects
        const formattedTodos = parsedTodos.map((todo: any) => ({
          ...todo,
          deadline: todo.deadline ? new Date(todo.deadline) : null
        }));
        setTodos(formattedTodos);
      } catch (error) {
        console.error('Failed to parse todos from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    // Convert Date objects to ISO strings before storing
    const todosToStore = todos.map(todo => ({
      ...todo,
      deadline: todo.deadline ? todo.deadline.toISOString() : null
    }));
    localStorage.setItem('todos', JSON.stringify(todosToStore));
  }, [todos]);

  const value = {
    todos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    activeFilter,
    setActiveFilter,
    searchText,
    setSearchText,
    sortType,
    setSortType,
    filteredTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export default TodoContext;