import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Grid,
  Tooltip,
  Divider,
  Alert,
  Snackbar,
  Badge,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
  InputAdornment,
  Popover,
  ListItemIcon,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LabelIcon from '@mui/icons-material/Label';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isAfter, isBefore, isToday } from 'date-fns';

// Types
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface FilterOptions {
  search: string;
  priority: string;
  category: string;
  status: string;
  dueDate: string;
}

interface SortOptions {
  field: keyof Todo;
  direction: 'asc' | 'desc';
}

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Categories and Tags
const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Other'];
const defaultTags = ['Urgent', 'Important', 'Later', 'Routine'];

function App() {
  // State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    category: 'all',
    status: 'all',
    dueDate: 'all',
  });
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'createdAt',
    direction: 'desc',
  });
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Handlers
  const handleAddTodo = () => {
    if (input.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        priority: 'medium',
        category: 'Other',
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: [],
      };
      setTodos([...todos, newTodo]);
      setInput('');
      showSnackbar('Task added successfully!');
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
    showSnackbar('Task deleted successfully!');
  };

  const handleEditTodo = (todo: Todo) => {
    setEditTodo(todo);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map(todo => 
      todo.id === updatedTodo.id ? { ...updatedTodo, updatedAt: new Date() } : todo
    ));
    setEditTodo(null);
    showSnackbar('Task updated successfully!');
  };

  const handleToggleComplete = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date() } : todo
    ));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAddTodo();
    }
  };

  const handleFilterChange = (field: keyof FilterOptions, value: string) => {
    setFilterOptions({ ...filterOptions, [field]: value });
  };

  const handleSortChange = (field: keyof Todo, direction: 'asc' | 'desc') => {
    setSortOptions({ field, direction });
  };

  const handleSelectTodo = (id: number) => {
    setSelectedTodos(prev =>
      prev.includes(id) ? prev.filter(todoId => todoId !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
    showSnackbar('Selected tasks deleted successfully!');
  };

  const handleBulkComplete = () => {
    setTodos(todos.map(todo =>
      selectedTodos.includes(todo.id) ? { ...todo, completed: true, updatedAt: new Date() } : todo
    ));
    setSelectedTodos([]);
    showSnackbar('Selected tasks marked as complete!');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Filter and sort todos
  const filteredTodos = todos
    .filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(filterOptions.search.toLowerCase());
      const matchesPriority = filterOptions.priority === 'all' || todo.priority === filterOptions.priority;
      const matchesCategory = filterOptions.category === 'all' || todo.category === filterOptions.category;
      const matchesStatus = filterOptions.status === 'all' || 
        (filterOptions.status === 'completed' && todo.completed) ||
        (filterOptions.status === 'active' && !todo.completed);
      const matchesDueDate = filterOptions.dueDate === 'all' || 
        (filterOptions.dueDate === 'today' && todo.dueDate && isToday(todo.dueDate)) ||
        (filterOptions.dueDate === 'overdue' && todo.dueDate && isBefore(todo.dueDate, new Date())) ||
        (filterOptions.dueDate === 'upcoming' && todo.dueDate && isAfter(todo.dueDate, new Date()));
      return matchesSearch && matchesPriority && matchesCategory && matchesStatus && matchesDueDate;
    })
    .sort((a, b) => {
      const aValue = a[sortOptions.field];
      const bValue = b[sortOptions.field];
      if (sortOptions.direction === 'asc') {
        return String(aValue) > String(bValue) ? 1 : -1;
      }
      return String(aValue) < String(bValue) ? 1 : -1;
    });

  // Statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const overdueTodos = todos.filter(todo => todo.dueDate && isBefore(todo.dueDate, new Date())).length;
  const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg">
          <Box className="flex flex-column gap-3 mt-3">
            <Typography variant="h4" component="h1" className="text-center">
              Advanced Todo List
            </Typography>

            {/* Statistics Cards */}
            <Box className="grid">
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Tasks
                  </Typography>
                  <Typography variant="h5">
                    {totalTodos}
                  </Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Completed
                  </Typography>
                  <Typography variant="h5">
                    {completedTodos}
                  </Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Active
                  </Typography>
                  <Typography variant="h5">
                    {activeTodos}
                  </Typography>
                </CardContent>
              </Card>
              <Card className="card">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Overdue
                  </Typography>
                  <Typography variant="h5">
                    {overdueTodos}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Progress Bar */}
            <Box className="mb-3">
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Completion Progress
              </Typography>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <Typography variant="body2" color="textSecondary" className="text-right">
                {completionRate.toFixed(1)}%
              </Typography>
            </Box>

            {/* Add Todo Form */}
            <Paper elevation={3} className="card">
              <Box className="flex gap-2 p-2">
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add a new task"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AddIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTodo}
                  className="button"
                >
                  Add
                </Button>
              </Box>
            </Paper>

            {/* Filters and Actions */}
            <Paper elevation={3} className="card">
              <Box className="flex gap-2 p-2 flex-wrap">
                <TextField
                  size="small"
                  placeholder="Search tasks"
                  value={filterOptions.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={filterOptions.priority}
                    label="Priority"
                    onChange={(e) => handleFilterChange('priority', e.target.value)}
                    className="input"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterOptions.category}
                    label="Category"
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="input"
                  >
                    <MenuItem value="all">All</MenuItem>
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterOptions.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Due Date</InputLabel>
                  <Select
                    value={filterOptions.dueDate}
                    label="Due Date"
                    onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                    className="input"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="overdue">Overdue</MenuItem>
                    <MenuItem value="upcoming">Upcoming</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                  className="button"
                >
                  More Filters
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<SortIcon />}
                  onClick={(e) => setSortAnchorEl(e.currentTarget)}
                  className="button"
                >
                  Sort
                </Button>
              </Box>
            </Paper>

            {/* Todo List */}
            <Paper elevation={3} className="card">
              <List className="list">
                {filteredTodos.map((todo) => (
                  <ListItem
                    key={todo.id}
                    divider
                    className="list-item"
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo.id)}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box className="flex gap-2 items-center">
                          <Typography
                            style={{
                              textDecoration: todo.completed ? 'line-through' : 'none',
                              color: todo.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                            }}
                          >
                            {todo.text}
                          </Typography>
                          <Chip
                            size="small"
                            label={todo.priority}
                            className="chip"
                            style={{
                              backgroundColor: 
                                todo.priority === 'high'
                                  ? 'var(--error-color)'
                                  : todo.priority === 'medium'
                                  ? 'var(--warning-color)'
                                  : 'var(--success-color)',
                              color: 'white'
                            }}
                          />
                          <Chip
                            size="small"
                            label={todo.category}
                            className="chip"
                          />
                          {todo.dueDate && (
                            <Chip
                              size="small"
                              icon={<CalendarTodayIcon />}
                              label={format(todo.dueDate, 'MMM d, yyyy')}
                              className="chip"
                              style={{
                                backgroundColor: isBefore(todo.dueDate, new Date()) 
                                  ? 'var(--error-color)' 
                                  : 'var(--primary-color)',
                                color: 'white'
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box className="flex gap-2 mt-2">
                          {todo.tags.map(tag => (
                            <Chip
                              key={tag}
                              size="small"
                              label={tag}
                              className="chip"
                            />
                          ))}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <Tooltip title="Edit" className="tooltip">
                        <IconButton
                          edge="end"
                          aria-label="edit"
                          onClick={() => handleEditTodo(todo)}
                          className="button"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" className="tooltip">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="button"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {filteredTodos.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No tasks found"
                      className="text-center"
                      style={{ color: 'var(--text-secondary)' }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>

            {/* Edit Todo Dialog */}
            <Dialog open={!!editTodo} onClose={() => setEditTodo(null)} maxWidth="sm" fullWidth>
              {editTodo && (
                <>
                  <DialogTitle>Edit Task</DialogTitle>
                  <DialogContent>
                    <Box className="flex flex-column gap-3 mt-3">
                      <TextField
                        fullWidth
                        label="Task"
                        value={editTodo.text}
                        onChange={(e) => setEditTodo({ ...editTodo, text: e.target.value })}
                        className="input"
                      />
                      <FormControl fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          value={editTodo.priority}
                          label="Priority"
                          onChange={(e) => setEditTodo({ ...editTodo, priority: e.target.value as Todo['priority'] })}
                          className="input"
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={editTodo.category}
                          label="Category"
                          onChange={(e) => setEditTodo({ ...editTodo, category: e.target.value })}
                          className="input"
                        >
                          {categories.map(category => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <DatePicker
                        label="Due Date"
                        value={editTodo.dueDate}
                        onChange={(date) => setEditTodo({ ...editTodo, dueDate: date })}
                      />
                      <FormControl fullWidth>
                        <InputLabel>Tags</InputLabel>
                        <Select
                          multiple
                          value={editTodo.tags}
                          label="Tags"
                          onChange={(e) => setEditTodo({ ...editTodo, tags: e.target.value as string[] })}
                          className="input"
                          renderValue={(selected) => (
                            <Box className="flex flex-wrap gap-1">
                              {selected.map((value) => (
                                <Chip key={value} label={value} className="chip" />
                              ))}
                            </Box>
                          )}
                        >
                          {defaultTags.map((tag) => (
                            <MenuItem key={tag} value={tag}>
                              {tag}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setEditTodo(null)} className="button">
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateTodo(editTodo)}
                      startIcon={<SaveIcon />}
                      className="button"
                    >
                      Save
                    </Button>
                  </DialogActions>
                </>
              )}
            </Dialog>

            {/* Snackbar */}
            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                className="card"
                style={{ width: '100%' }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
