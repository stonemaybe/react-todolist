import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { FilterType, SortType } from '../types';
import { useTodo } from '../contexts/TodoContext';

const FilterBar: React.FC = () => {
  const {
    activeFilter,
    setActiveFilter,
    searchText,
    setSearchText,
    sortType,
    setSortType,
  } = useTodo();

  const handleFilterChange = (
    _event: React.MouseEvent<HTMLElement>,
    newFilter: FilterType | null,
  ) => {
    if (newFilter !== null) {
      setActiveFilter(newFilter);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortType(event.target.value as SortType);
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Filter Tasks
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Filter buttons */}
        <ToggleButtonGroup
          value={activeFilter}
          exclusive
          onChange={handleFilterChange}
          aria-label="task filter"
          fullWidth
          sx={{ mb: 1 }}
        >
          <ToggleButton value="all" aria-label="all tasks">
            All
          </ToggleButton>
          <ToggleButton value="pending" aria-label="pending tasks">
            Pending
          </ToggleButton>
          <ToggleButton value="completed" aria-label="completed tasks">
            Completed
          </ToggleButton>
          <ToggleButton value="overdue" aria-label="overdue tasks">
            Overdue
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Search input */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tasks"
          value={searchText}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          size="small"
        />

        {/* Sort dropdown */}
        <FormControl fullWidth size="small">
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            id="sort-select"
            value={sortType}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="date">Deadline (Earliest First)</MenuItem>
            <MenuItem value="alphabetical">Alphabetically (A-Z)</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default FilterBar;