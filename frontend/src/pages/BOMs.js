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
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { bomsApi, productsApi } from '../services/api';
import BOMForm from '../components/BOMForm';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function BOMs() {
  const [boms, setBOMs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dane do formularza
  const [products, setProducts] = useState([]);
  const [components, setComponents] = useState([]);
  const [bomFormOpen, setBomFormOpen] = useState(false);
  const [currentBom, setCurrentBom] = useState(null);
  
  // Dialog potwierdzenia usunięcia
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [bomToDelete, setBomToDelete] = useState(null);

  // Pobieranie list materiałowych
  const fetchBOMs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        name: searchTerm || undefined
      };
      
      // Użyj API do pobrania danych
      const data = await bomsApi.getAll(params);
      
      // Jeśli API zwraca paginację jako { items, total }, użyj jej
      if (data && Array.isArray(data)) {
        setBOMs(data);
        setTotalCount(data.length); // Tymczasowo, do czasu gdy API będzie zwracać łączną liczbę
      } else if (data && data.items) {
        setBOMs(data.items);
        setTotalCount(data.total);
      } else {
        // Fallback do przykładowych danych podczas rozwoju
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
        console.warn('Używanie przykładowych danych, API nie zwróciło oczekiwanego formatu.');
      }
    } catch (err) {
      console.error('Error fetching BOMs:', err);
      setError('Nie udało się załadować list materiałowych.');
      
      // Fallback do przykładowych danych podczas rozwoju
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
          ]
        }
      ];
      
      setBOMs(mockBOMs);
      setTotalCount(mockBOMs.length);
    } finally {
      setLoading(false);
    }
  };

  // Pobieranie produktów dla formularza
  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll({ limit: 100 });
      if (Array.isArray(data)) {
        setProducts(data);
        
        // Ustaw również komponenty (wszystkie produkty, które nie są końcowe)
        setComponents(data.filter(p => p.product_type !== 'FINAL'));
      } else if (data && data.items) {
        setProducts(data.items);
        setComponents(data.items.filter(p => p.product_type !== 'FINAL'));
      } else {
        // Fallback do przykładowych danych
        const mockProducts = [
          { id: 1, code: 'HUL-001', name: 'Kadłub 5m', product_type: 'COMPONENT', unit: 'szt' },
          { id: 2, code: 'ENG-001', name: 'Silnik 100KM', product_type: 'COMPONENT', unit: 'szt' },
          { id: 3, code: 'BOAT-001', name: 'Łódź Sport 5m', product_type: 'FINAL', unit: 'szt' },
          { id: 4, code: 'WOOD-001', name: 'Drewno tekowe', product_type: 'MATERIAL', unit: 'm²' },
          { id: 5, code: 'PAINT-001', name: 'Farba podkładowa', product_type: 'MATERIAL', unit: 'l' },
          { id: 6, code: 'GLASS-001', name: 'Szyba przednia', product_type: 'COMPONENT', unit: 'szt' },
          { id: 7, code: 'SEAT-001', name: 'Fotel kapitański', product_type: 'COMPONENT', unit: 'szt' },
          { id: 8, code: 'STEER-001', name: 'Koło sterowe', product_type: 'COMPONENT', unit: 'szt' },
          { id: 9, code: 'BOAT-002', name: 'Łódź Wędkarska 4m', product_type: 'FINAL', unit: 'szt' },
          { id: 10, code: 'ENG-002', name: 'Silnik 50KM', product_type: 'COMPONENT', unit: 'szt' },
          { id: 12, code: 'BOAT-003', name: 'Łódź Kabinowa 7m', product_type: 'FINAL', unit: 'szt' },
        ];
        
        setProducts(mockProducts);
        setComponents(mockProducts.filter(p => p.product_type !== 'FINAL'));
        console.warn('Używanie przykładowych danych produktów');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      // Fallback do przykładowych danych w przypadku błędu
      const mockProducts = [
        { id: 1, code: 'HUL-001', name: 'Kadłub 5m', product_type: 'COMPONENT', unit: 'szt' },
        { id: 2, code: 'ENG-001', name: 'Silnik 100KM', product_type: 'COMPONENT', unit: 'szt' },
        { id: 3, code: 'BOAT-001', name: 'Łódź Sport 5m', product_type: 'FINAL', unit: 'szt' },
      ];
      
      setProducts(mockProducts);
      setComponents(mockProducts.filter(p => p.product_type !== 'FINAL'));
    }
  };
  
  // Pobierz dane przy pierwszym renderowaniu i przy zmianie filtrów
  useEffect(() => {
    fetchBOMs();
  }, [page, rowsPerPage, searchTerm]);
  
  // Pobierz produkty dla formularza
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Obsługa zmiany strony
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Obsługa zmiany liczby wierszy na stronę
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Obsługa zmiany wyszukiwanego tekstu
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };
  
  // Dodawanie nowej listy materiałowej
  const handleAddBOM = () => {
    setCurrentBom(null);
    setBomFormOpen(true);
  };
  
  // Edycja istniejącej listy materiałowej
  const handleEditBOM = (bom) => {
    setCurrentBom(bom);
    setBomFormOpen(true);
  };
  
  // Zamknięcie formularza listy materiałowej
  const handleCloseBOMForm = () => {
    setBomFormOpen(false);
    setCurrentBom(null);
  };
  
  // Zapisanie listy materiałowej (dodanie/aktualizacja)
  const handleSubmitBOM = async (bomData) => {
    try {
      if (bomData.id) {
        // Aktualizacja istniejącej listy materiałowej
        await bomsApi.update(bomData.id, bomData);
        toast.success(`Lista materiałowa ${bomData.name} została zaktualizowana`);
      } else {
        // Tworzenie nowej listy materiałowej
        await bomsApi.create(bomData);
        toast.success(`Lista materiałowa ${bomData.name} została dodana`);
      }
      
      // Odśwież listę BOM
      fetchBOMs();
    } catch (err) {
      console.error('Error saving BOM:', err);
      toast.error(err.response?.data?.detail || 'Wystąpił błąd podczas zapisywania listy materiałowej');
    }
  };
  
  // Potwierdzenie usunięcia listy materiałowej
  const handleConfirmDelete = (bom) => {
    setBomToDelete(bom);
    setDeleteConfirmOpen(true);
  };
  
  // Zamknięcie dialogu potwierdzenia
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setBomToDelete(null);
  };
  
  // Usunięcie listy materiałowej
  const handleDeleteBOM = async () => {
    if (!bomToDelete) return;
    
    try {
      await bomsApi.delete(bomToDelete.id);
      toast.success(`Lista materiałowa ${bomToDelete.name} została usunięta`);
      
      // Odśwież listę BOM
      fetchBOMs();
    } catch (err) {
      console.error('Error deleting BOM:', err);
      toast.error(err.response?.data?.detail || 'Wystąpił błąd podczas usuwania listy materiałowej');
    }
    
    handleCloseDeleteConfirm();
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
              onClick={handleAddBOM}
            >
              Dodaj listę materiałową
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Filtry */}
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
          <Grid item xs={12} sm={6} md={8} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => fetchBOMs()}
              disabled={loading}
            >
              Odśwież
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Komunikat o błędzie */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Lista BOM */}
      <Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {boms.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Brak list materiałowych spełniających kryteria wyszukiwania.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddBOM}
                  sx={{ mt: 2 }}
                >
                  Dodaj listę materiałową
                </Button>
              </Box>
            ) : (
              boms.map((bom) => (
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
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditBOM(bom);
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Usuń">
                            <IconButton 
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirmDelete(bom);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    {bom.description && (
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {bom.description}
                      </Typography>
                    )}
                    
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
              ))
            )}
            
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
          </>
        )}
      </Paper>
      
      {/* Formularz BOM (dodawanie/edycja) */}
      <BOMForm
        open={bomFormOpen}
        onClose={handleCloseBOMForm}
        onSubmit={handleSubmitBOM}
        initialValues={currentBom}
        products={products}
        components={components}
      />
      
      {/* Dialog potwierdzenia usunięcia */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteBOM}
        title="Usunąć listę materiałową?"
        content={
          bomToDelete
            ? `Czy na pewno chcesz usunąć listę materiałową "${bomToDelete.name}" (wersja ${bomToDelete.version})? Tej operacji nie można cofnąć.`
            : 'Czy na pewno chcesz usunąć wybraną listę materiałową? Tej operacji nie można cofnąć.'
        }
        confirmLabel="Usuń"
        severity="error"
      />
    </Container>
  );
}
