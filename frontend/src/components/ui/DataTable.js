import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Chip,
  Tooltip,
  Typography,
  Input,
  InputAdornment,
  TextField,
  Card,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

/**
 * A modern styled data table component with sort, filtering and pagination
 *  
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {Array} props.columns - Array of column definitions with {id, label, numeric, sortable, render}
 * @param {Array} props.data - Array of data objects
 * @param {boolean} props.selectable - Whether rows can be selected
 * @param {function} props.onSelectAll - Callback when all rows are selected
 * @param {function} props.onRowSelect - Callback when a row is selected
 * @param {Array} props.selected - Array of selected row ids
 * @param {string} props.idField - Field to use as ID (default: 'id')
 * @param {Object} props.pagination - Pagination options {page, rowsPerPage, rowsPerPageOptions, totalCount}
 * @param {function} props.onPageChange - Callback when page changes
 * @param {function} props.onRowsPerPageChange - Callback when rows per page changes
 * @param {boolean} props.loading - Whether the table is loading
 * @param {function} props.onRowClick - Callback when a row is clicked
 * @param {React.ReactNode} props.toolbar - Custom toolbar component
 * @param {function} props.searchFunc - Function to handle search
 * @param {boolean} props.showSearch - Whether to show search field
 * @param {Object} props.sx - Additional styles
 */
const DataTable = ({
  title,
  columns = [],
  data = [],
  selectable = false,
  onSelectAll,
  onRowSelect,
  selected = [],
  idField = 'id',
  pagination = {
    page: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    totalCount: 0,
  },
  onPageChange,
  onRowsPerPageChange,
  loading = false,
  onRowClick,
  toolbar,
  searchFunc,
  showSearch = true,
  sx = {},
}) => {
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle search change
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (searchFunc) {
      searchFunc(value);
    }
  };

  // Handle select all
  const handleSelectAll = (event) => {
    if (onSelectAll) {
      onSelectAll(event.target.checked);
    }
  };

  // Handle single row selection
  const handleRowSelect = (id) => {
    if (onRowSelect) {
      onRowSelect(id);
    }
  };

  // Check if row is selected
  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <Card
      sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)',
        ...sx,
      }}
    >
      {/* Table Header with title and tools */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search input */}
          {showSearch && (
            <TextField
              size="small"
              placeholder="Szukaj..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  '&.Mui-focused': {
                    backgroundColor: 'white',
                  },
                },
                width: { xs: 100, sm: 150, md: 240 },
              }}
            />
          )}

          {/* Custom toolbar */}
          {toolbar}
        </Box>
      </Box>

      {/* Table container */}
      <TableContainer sx={{ maxHeight: '60vh' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {/* Checkbox column */}
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < data.length}
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.numeric ? 'right' : 'left'}
                  padding={column.disablePadding ? 'none' : 'normal'}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, index) => {
              const isItemSelected = isSelected(row[idField]);
              const rowId = row[idField];

              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={rowId || index}
                  selected={isItemSelected}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  sx={{ 
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&.Mui-selected': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    },
                  }}
                >
                  {/* Checkbox cell */}
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleRowSelect(rowId)}
                        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${index}` }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}

                  {/* Data cells */}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.numeric ? 'right' : 'left'}
                      padding={column.disablePadding ? 'none' : 'normal'}
                    >
                      {column.render ? column.render(row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* Empty state */}
            {data.length === 0 && !loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  align="center"
                  sx={{ py: 10 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Brak danych do wyświetlenia
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {/* Loading state */}
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Ładowanie danych...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && (
        <TablePagination
          rowsPerPageOptions={pagination.rowsPerPageOptions || [5, 10, 25, 50]}
          component="div"
          count={pagination.totalCount || data.length}
          rowsPerPage={pagination.rowsPerPage || 10}
          page={pagination.page || 0}
          onPageChange={onPageChange || (() => {})}
          onRowsPerPageChange={onRowsPerPageChange || (() => {})}
          labelRowsPerPage="Wierszy na stronę:"
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} z ${count !== -1 ? count : `więcej niż ${to}`}`
          }
        />
      )}
    </Card>
  );
};

export default DataTable;
