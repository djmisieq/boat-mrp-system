import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  // Mock data for initial development
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 1,
          order_number: 'ORD-2025-001',
          order_type: 'PRODUCTION',
          status: 'CONFIRMED',
          customer_name: 'Jan Kowalski',
          customer_reference: 'REF12345',
          order_date: '2025-02-28T10:30:00Z',
          required_date: '2025-04-15T00:00:00Z',
          estimated_completion_date: '2025-04-10T00:00:00Z',
          actual_completion_date: null,
          notes: 'Zamówienie na łódź sportową.',
          items: [
            { id: 1, product: { id: 3, name: 'Łódź Sport 5m', code: 'BOAT-001' }, quantity: 1, unit_price: 85000 }
          ]
        },
        {
          id: 2,
          order_number: 'ORD-2025-002',
          order_type: 'PRODUCTION',
          status: 'IN_PRODUCTION',
          customer_name: 'Anna Nowak',
          customer_reference: 'REF54321',
          order_date: '2025-02-27T14:15:00Z',
          required_date: '2025-04-01T00:00:00Z',
          estimated_completion_date: '2025-03-25T00:00:00Z',
          actual_completion_date: null,
          notes: 'Zamówienie na łódź wędkarską. Klient prosi o dodatkowe wyposażenie.',
          items: [
            { id: 2, product: { id: 9, name: 'Łódź Wędkarska 4m', code: 'BOAT-002' }, quantity: 1, unit_price: 65000 }
          ]
        },
        {
          id: 3,
          order_number: 'ORD-2025-003',
          order_type: 'PURCHASE',
          status: 'SUBMITTED',
          customer_name: 'Tomasz Wiśniewski',
          customer_reference: 'PO-98765',
          order_date: '2025-02-26T09:00:00Z',
          required_date: '2025-03-10T00:00:00Z',
          estimated_completion_date: null,
          actual_completion_date: null,
          notes: 'Zamówienie na materiały.',
          items: [
            { id: 3, product: { id: 4, name: 'Drewno tekowe', code: 'WOOD-001' }, quantity: 10, unit_price: 350 },
            { id: 4, product: { id: 5, name: 'Farba podkładowa', code: 'PAINT-001' }, quantity: 50, unit_price: 45 }
          ]
        },
        {
          id: 4,
          order_number: 'ORD-2025-004',
          order_type: 'PRODUCTION',
          status: 'COMPLETED',
          customer_name: 'Katarzyna Dąbrowska',
          customer_reference: 'CUS2025-123',
          order_date: '2025-02-25T11:45:00Z',
          required_date: '2025-03-15T00:00:00Z',
          estimated_completion_date: '2025-03-12T00:00:00Z',
          actual_completion_date: '2025-03-10T14:30:00Z',
          notes: 'Zamówienie zostało zrealizowane przed czasem.',
          items: [
            { id: 5, product: { id: 11, name: 'Przegląd techniczny', code: 'MAINT-001' }, quantity: 1, unit_price: 500 }
          ]
        }
      ];
      
      setOrders(mockOrders);
      setTotalCount(mockOrders.length);
      setLoading(false);
    }, 1000);
    
    // Actual API call will be implemented here later
    // const fetchOrders = async () => {
    //   try {
    //     const response = await axios.get('/api/v1/orders', {
    //       params: {
    //         skip: page * rowsPerPage,
    //         limit: rowsPerPage,
    //         search: searchTerm || undefined,
    //         status: statusFilter || undefined
    //       }
    //     });
    //     setOrders(response.data.items);
    //     setTotalCount(response.data.total);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //     toast.error('Błąd podczas pobierania zamówień');
    //     setLoading(false);
    //   }
    // };
    
    // fetchOrders();
  }, [page, rowsPerPage, searchTerm, statusFilter]);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };
  
  const getOrderTypeLabel = (type) => {
    switch (type) {
      case 'PRODUCTION':
        return 'Produkcyjne';
      case 'PURCHASE':
        return 'Zakupowe';
      default:
        return type;
    }
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'Szkic';
      case 'SUBMITTED':
        return 'Złożone';
      case 'CONFIRMED':
        return 'Potwierdzone';
      case 'IN_PRODUCTION':
        return 'W produkcji';
      case 'COMPLETED':
        return 'Zakończone';
      case 'CANCELLED':
        return 'Anulowane';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'DRAFT':
        return 'default';
      case 'SUBMITTED':
        return 'info';
      case 'CONFIRMED':
        return 'primary';
      case 'IN_PRODUCTION':
        return 'warning';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/D';
    return format(new Date(dateString), 'dd.MM.yyyy');
  };
  
  const handleOrderClick = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  const calculateTotalValue = (items) => {
    return items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Zamówienia
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Handle add order */}}
            >
              Dodaj zamówienie
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Szukaj zamówienia"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                label="Status"
              >
                <MenuItem value="">Wszystkie</MenuItem>
                <MenuItem value="DRAFT">Szkice</MenuItem>
                <MenuItem value="SUBMITTED">Złożone</MenuItem>
                <MenuItem value="CONFIRMED">Potwierdzone</MenuItem>
                <MenuItem value="IN_PRODUCTION">W produkcji</MenuItem>
                <MenuItem value="COMPLETED">Zakończone</MenuItem>
                <MenuItem value="CANCELLED">Anulowane</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Orders List */}
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Numer zamówienia</TableCell>
                <TableCell>Klient</TableCell>
                <TableCell>Typ</TableCell>
                <TableCell>Data zamówienia</TableCell>
                <TableCell>Wymagana data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow 
                    hover
                    onClick={() => handleOrderClick(order.id)}
                    sx={{ 
                      cursor: 'pointer',
                      '&.Mui-selected, &.Mui-selected:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      },
                    }}
                    selected={expandedOrder === order.id}
                  >
                    <TableCell component="th" scope="row">
                      {order.order_number}
                    </TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{getOrderTypeLabel(order.order_type)}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>{formatDate(order.required_date)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(order.status)} 
                        color={getStatusColor(order.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edytuj">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          /* Handle edit */
                        }}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Usuń">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          /* Handle delete */
                        }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                  
                  {/* Details Row */}
                  {expandedOrder === order.id && (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 0 }}>
                        <Box sx={{ margin: 1 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">
                                Numer referencyjny klienta:
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                {order.customer_reference || 'N/D'}
                              </Typography>
                              
                              <Typography variant="subtitle2">
                                Uwagi:
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                {order.notes || 'Brak'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">
                                Szacowana data ukończenia:
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                {formatDate(order.estimated_completion_date)}
                              </Typography>
                              
                              <Typography variant="subtitle2">
                                Faktyczna data ukończenia:
                              </Typography>
                              <Typography variant="body2" gutterBottom>
                                {formatDate(order.actual_completion_date)}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                                Pozycje zamówienia:
                              </Typography>
                              <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>Kod</TableCell>
                                      <TableCell>Nazwa produktu</TableCell>
                                      <TableCell align="right">Ilość</TableCell>
                                      <TableCell align="right">Cena jedn.</TableCell>
                                      <TableCell align="right">Wartość</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {order.items.map((item) => (
                                      <TableRow key={item.id}>
                                        <TableCell>{item.product.code}</TableCell>
                                        <TableCell>{item.product.name}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="right">{item.unit_price.toLocaleString()} PLN</TableCell>
                                        <TableCell align="right">{(item.quantity * item.unit_price).toLocaleString()} PLN</TableCell>
                                      </TableRow>
                                    ))}
                                    <TableRow>
                                      <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                                        Suma:
                                      </TableCell>
                                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        {calculateTotalValue(order.items).toLocaleString()} PLN
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </Grid>
                          </Grid>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Wierszy na stronę:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} z ${count}`}
        />
      </Paper>
    </Container>
  );
}
