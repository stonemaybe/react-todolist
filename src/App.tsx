import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { TodoProvider, useTodo } from './contexts/TodoContext';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import FilterBar from './components/FilterBar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const TodoList: React.FC = () => {
  const { filteredTodos } = useTodo();

  return (
    <Paper elevation={3}>
      <List>
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
        {filteredTodos.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No tasks found"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TodoProvider>
          <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom align="center">
                Todo List
              </Typography>
              <TodoForm />
              <FilterBar />
              <TodoList />
            </Box>
          </Container>
        </TodoProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;