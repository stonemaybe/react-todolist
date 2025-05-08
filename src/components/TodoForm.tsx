import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { useTodo } from '../contexts/TodoContext';

const TodoForm: React.FC = () => {
  const { addTodo } = useTodo();
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim() === '') {
      setError(true);
      return;
    }

    // Convert Dayjs to Date or null
    const deadlineDate = deadline ? deadline.toDate() : null;
    
    addTodo(text.trim(), deadlineDate);
    
    // Reset form
    setText('');
    setDeadline(null);
    setError(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (e.target.value.trim() !== '') {
      setError(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Add New Task
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            fullWidth
            variant="outlined"
            label="Task"
            placeholder="What needs to be done?"
            value={text}
            onChange={handleTextChange}
            error={error}
            helperText={error ? 'Task text is required' : ''}
          />
          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Deadline (optional)"
              value={deadline}
              onChange={(newValue) => setDeadline(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                },
              }}
            />
          </LocalizationProvider>
          
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            fullWidth
          >
            Add Task
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TodoForm;