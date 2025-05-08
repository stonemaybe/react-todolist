import React from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTodo } from '../contexts/TodoContext';
import { Todo } from '../types';
import dayjs from 'dayjs';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleTodo, deleteTodo } = useTodo();
  
  // Check if task is overdue
  const isOverdue = todo.deadline && 
    !todo.completed && 
    dayjs(todo.deadline).isBefore(dayjs(), 'day');
  
  // Format deadline date
  const formattedDate = todo.deadline 
    ? dayjs(todo.deadline).format('MMM D, YYYY') 
    : 'No deadline';
  
  return (
    <Paper 
      elevation={1} 
      sx={{ 
        mb: 1,
        bgcolor: isOverdue ? 'rgba(255, 0, 0, 0.05)' : 'background.paper',
        borderLeft: isOverdue ? '4px solid #f44336' : 'none'
      }}
    >
      <ListItem
        disablePadding
        secondaryAction={
          <IconButton 
            edge="end" 
            aria-label="delete"
            onClick={() => deleteTodo(todo.id)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => toggleTodo(todo.id)}>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={todo.completed}
              disableRipple
              inputProps={{ 'aria-labelledby': `todo-item-${todo.id}` }}
            />
          </ListItemIcon>
          <ListItemText
            id={`todo-item-${todo.id}`}
            primary={
              <Typography
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.disabled' : (isOverdue ? 'error.main' : 'text.primary'),
                }}
              >
                {todo.text}
              </Typography>
            }
            secondary={
              <Box component="span" sx={{ 
                color: isOverdue ? 'error.main' : 'text.secondary',
                fontWeight: isOverdue ? 'medium' : 'regular'
              }}>
                {isOverdue && !todo.completed ? '⚠️ Overdue - ' : ''}
                {formattedDate}
              </Box>
            }
          />
        </ListItemButton>
      </ListItem>
    </Paper>
  );
};

export default TodoItem;