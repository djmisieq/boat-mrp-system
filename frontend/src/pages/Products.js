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
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState('');
  
  // Mock data for initial development
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockProducts = [
        { id: 1, code: 'HUL-001', name: 'Kadłub 5m', product_type: 'COMPONENT', unit: 'szt', price: 12000, quantity_in_stock: 5, active: true },
        { id: 2, code: 'ENG-001', name: 'Silnik 100KM', product_type: 'COMPONENT', unit: 'szt', price: 25000, quantity_in_stock: 3, active: true },
        { id: 3, code: 'BOAT-001', name: 'Łódź Sport 5m', product_type: 'FINAL', unit: 'szt', price: 85000, quantity_in_stock: 1, active: true },
        { id: 4, code: 'WOOD-001', name: 'Drewno tekowe', product_type: 'MATERIAL', unit: 'm²', price: 350, quantity_in_stock: 120, active: true },
        { id: 5, code: 'PAINT-001', name: 'Farba podkładowa', product_type: 'MATERIAL', unit: 'l', price: 45, quantity_in_stock: 200, active: true },
        { id: 6, code: 'GLASS-001', name: 'Szyba przednia', product_type: 'COMPONENT', unit: 'szt', price: 1200, quantity_in_stock: 8, active: true },
        { id: 7, code: 'SEAT-001', name: 'Fotel kapitański', product_type: 'COMPONENT', unit: 'szt', price: 850, quantity_in_stock: 12, active: true },
        { id: 8, code: 'STEER-001', name: 'Koło sterowe', product_type: 'COMPONENT', unit: 'szt', price: 450, quantity_in_stock: 15, active: true },
        { id: 9, code: 'BOAT-002', name: 'Łódź Wędkarska 4m', product_type: 'FINAL', unit: 'szt', price: 65000, quantity_in_stock: 2, active: true },
        { id: 10, code: 'ENG-002', name: 'Silnik 50KM', product_type: 'COMPONENT', unit: 'szt', price: 12000, quantity_in_stock: 6, active: true },
        { id: 11, code: 'MAINT-001', name: 'Przegląd techniczny', product_type: 'SERVICE', unit: 'usł', price: 500, quantity_in_stock: 0, active: true },
        { id: 12, code: 'BOAT-003', name: 'Łódź Kabinowa 7m', product_type: 'FINAL', unit: 'szt', price: 120000, quantity_in_stock: 1, active: false },
      ];
      
      setProducts(mockProducts);
      setTotalCount(mockProducts.length);
      setLoading(false);
    }, 1000);
    
    // Actual API call will be implemented here later
    // const fetchProducts = async () => {
    //   try {
    //     const response = await axios.get('/api/v1/products', {
    //       params: {
    //         skip: page * rowsPerPage,
    //         limit: rowsPerPage,
    //         name: searchTerm || undefined,
    //         product_type: productTypeFilter || undefined
    //       }
    //     });
    //     setProducts(response.data.items);
    //     setTotalCount(response.data.total);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching products:', error);
    //     toast.error('Błąd podczas pobierania listy produktów');
    //     setLoading(false);
    //   }
    // };
    
    // fetchProducts();
  }, [page, rowsPerPage, searchTerm, productTypeFilter]);
  
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
  
  const handleProductTypeChange = (event) => {
    setProductTypeFilter(event.target.value);
    setPage(0);
  };
  
  const getProductTypeLabel = (type) => {
    switch (type) {
      case 'FINAL':
        return 'Produkt końcowy';
      case 'COMPONENT':
        return 'Komponent';
      case 'MATERIAL':
        return 'Materiał';
      case 'SERVICE':
        return 'Usługa';
      default:
        return type;
    }
  };
  
  const getProductTypeColor = (type) => {
    switch (type) {
      case 'FINAL':
        return 'primary';
      case 'COMPONENT':
        return 'success';
      case 'MATERIAL':
        return 'info';
      case 'SERVICE':
        return 'warning';
      default:
        return 'default';
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Produkty
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Handle add product */}}
            >
              Dodaj produkt
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
              label="Szukaj produktu"
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
              <InputLabel>Typ produktu</InputLabel>
              <Select
                value={productTypeFilter}
                onChange={handleProductTypeChange}
                label="Typ produktu"
              >
                <MenuItem value="">Wszystkie</MenuItem>
                <MenuItem value="FINAL">Produkty końcowe</MenuItem>
                <MenuItem value="COMPONENT">Komponenty</MenuItem>
                <MenuItem value="MATERIAL">Materiały</MenuItem>
                <MenuItem value="SERVICE">Usługi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Products Table */}
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>Kod</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Typ</TableCell>
                <TableCell align="right">Cena</TableCell>
                <TableCell align="right">Stan magazynowy</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell component="th" scope="row">
                    {product.code}
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getProductTypeLabel(product.product_type)} 
                      color={getProductTypeColor(product.product_type)} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="right">{product.price.toLocaleString()} PLN</TableCell>
                  <TableCell align="right">
                    {product.quantity_in_stock}
                    {' '}
                    {product.unit}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={product.active ? "Aktywny" : "Nieaktywny"} 
                      color={product.active ? "success" : "error"} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => {/* Handle edit */}}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => {/* Handle delete */}}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
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
