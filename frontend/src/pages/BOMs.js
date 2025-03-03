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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

export default function BOMs() {
  const [boms, setBOMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for initial development
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockBOMs = [
        {
          id: 1,
          name: 'BOM - Łódź Sport 5m',
          description: 'Lista materiałowa dla łodzi sportowej 5m',
          product: { id: 3, name: 'Łódź Sport 5m', code: 'BOAT-001' },
          version: '1.0',
          is_active: true,
          items: [
            { id: 1, component: { id: 1, name: 'Kadłub 5m', code: 'HUL-001' }, quantity: 1, unit: 'szt' },
            { id: 2, component: { id: 2, name: 'Silnik 100KM', code: 'ENG-001' }, quantity: 1, unit: 'szt' },
            { id: 3, component: { id: 6, name: 'Szyba przednia', code: 'GLASS-001' }, quantity: 1, unit: 'szt' },
            { id: 4, component: { id: 7, name: 'Fotel kapitański', code: 'SEAT-001' }, quantity: 2, unit: 'szt' },
            { id: 5, component: { id: 8, name: 'Koło sterowe', code: 'STEER-001' }, quantity: 1, unit: 'szt' },
            { id: 6, component: { id: 4, name: 'Drewno tekowe', code: 'WOOD-001' }, quantity: 3.5, unit: 'm²' },
            { id: 7, component: { id: 5, name: 'Farba podkładowa', code: 'PAINT-001' }, quantity: 12, unit: 'l' },
          ]
        },
        {
          id: 2,
          name: 'BOM - Łódź Wędkarska 4m',
          description: 'Lista materiałowa dla łodzi wędkarskiej 4m',
          product: { id: 9, name: 'Łódź Wędkarska 4m', code: 'BOAT-002' },
          version: '1.0',
          is_active: true,
          items: [
            { id: 8, component: { id: 1, name: 'Kadłub 4m (modyfikacja)', code: 'HUL-001-MOD' }, quantity: 1, unit: 'szt' },
            { id: 9, component: { id: 10, name: 'Silnik 50KM', code: 'ENG-002' }, quantity: 1, unit: 'szt' },
            { id: 10, component: { id: 7, name: 'Fotel kapitański', code: 'SEAT-001' }, quantity: 1, unit: 'szt' },
            { id: 11, component: { id: 8, name: 'Koło sterowe', code: 'STEER-001' }, quantity: 1, unit: 'szt' },
            { id: 12, component: { id: 4, name: 'Drewno tekowe', code: 'WOOD-001' }, quantity: 2, unit: 'm²' },
            { id: 13, component: { id: 5, name: 'Farba podkładowa', code: 'PAINT-001' }, quantity: 8, unit: 'l' },
          ]
        },
        {
          id: 3,
          name: 'BOM - Łódź Kabinowa 7m',
          description: 'Lista materiałowa dla łodzi kabinowej 7m',
          product: { id: 12, name: 'Łódź Kabinowa 7m', code: 'BOAT-003' },
          version: '1.0',
          is_active: false,
          items: [
            { id: 14, component: { id: 1, name: 'Kadłub 7m', code: 'HUL-002' }, quantity: 1, unit: 'szt' },
            { id: 15, component: { id: 2, name: 'Silnik 100KM', code: 'ENG-001' }, quantity: 2, unit: 'szt' },
            { id: 16, component: { id: 6, name: 'Szyba przednia', code: 'GLASS-001' }, quantity: 2, unit: 'szt' },
            { id: 17, component: { id: 7, name: 'Fotel kapitański', code: 'SEAT-001' }, quantity: 2, unit: 'szt' },
            { id: 18, component: { id: 8, name: 'Koło sterowe', code: 'STEER-001' }, quantity: 1, unit: 'szt' },
            { id: 19, component: { id: 4, name: 'Drewno tekowe', code: 'WOOD-001' }, quantity: 5, unit: 'm²' },
            { id: 20, component: { id: 5, name: 'Farba podkładowa', code: 'PAINT-001' }, quantity: 20, unit: 'l' },
          ]
        }
      ];
      
      setBOMs(mockBOMs);
      setTotalCount(mockBOMs.length);
      setLoading(false);
    }, 1000);
    
    // Actual API call will be implemented here later
    // const fetchBOMs = async () => {
    //   try {
    //     const response = await axios.get('/api/v1/boms', {
    //       params: {
    //         skip: page * rowsPerPage,
    //         limit: rowsPerPage,
    //         search: searchTerm || undefined
    //       }
    //     });
    //     setBOMs(response.data.items);
    //     setTotalCount(response.data.total);
    //     setLoading(false);
    //   } catch (error) {
    //     console.error('Error fetching BOMs:', error);
    //     toast.error('Błąd podczas pobierania list materiałowych');
    //     setLoading(false);
    //   }
    // };
    
    // fetchBOMs();
  }, [page, rowsPerPage, searchTerm]);
  
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
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Listy materiałowe (BOM)
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {/* Handle add BOM */}}
            >
              Dodaj listę materiałową
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
              label="Szukaj listy materiałowej"
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
        </Grid>
      </Paper>
      
      {/* BOMs List */}
      <Paper>
        {boms.map((bom) => (
          <Accordion key={bom.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`bom-${bom.id}-content`}
              id={`bom-${bom.id}-header`}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {bom.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Produkt: {bom.product.code} - {bom.product.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2">
                    Wersja: {bom.version}
                  </Typography>
                  <Typography variant="body2">
                    Elementy: {bom.items.length}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Chip 
                      label={bom.is_active ? "Aktywna" : "Nieaktywna"} 
                      color={bom.is_active ? "success" : "error"} 
                      size="small" 
                      sx={{ mr: 1 }}
                    />
                    <Tooltip title="Edytuj">
                      <IconButton size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Usuń">
                      <IconButton size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" paragraph>
                {bom.description}
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Kod</TableCell>
                      <TableCell>Nazwa komponentu</TableCell>
                      <TableCell align="right">Ilość</TableCell>
                      <TableCell>Jednostka</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bom.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.component.code}</TableCell>
                        <TableCell>{item.component.name}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
        
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
