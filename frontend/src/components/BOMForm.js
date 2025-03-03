import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Schemat walidacji dla całego BOM
const validationSchema = Yup.object({
  name: Yup.string()
    .required('Nazwa listy materiałowej jest wymagana')
    .max(100, 'Nazwa nie może być dłuższa niż 100 znaków'),
  description: Yup.string()
    .max(500, 'Opis nie może być dłuższy niż 500 znaków'),
  product_id: Yup.number()
    .required('Produkt jest wymagany'),
  version: Yup.string()
    .required('Wersja jest wymagana')
    .max(20, 'Wersja nie może być dłuższa niż 20 znaków'),
  is_active: Yup.boolean().default(true)
});

// Schemat walidacji dla pojedynczego elementu BOM
const bomItemValidationSchema = Yup.object({
  component_id: Yup.number()
    .required('Komponent jest wymagany'),
  quantity: Yup.number()
    .required('Ilość jest wymagana')
    .positive('Ilość musi być większa od zera')
});

export default function BOMForm({ open, onClose, onSubmit, initialValues = null, products = [], components = [] }) {
  const isNewBOM = !initialValues?.id;
  
  // State do zarządzania elementami BOM
  const [bomItems, setBomItems] = useState([]);
  const [bomItemValidationErrors, setBomItemValidationErrors] = useState({});
  
  // Formik do zarządzania głównym formularzem
  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      description: '',
      product_id: '',
      version: '1.0',
      is_active: true
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Walidacja elementów BOM
      if (bomItems.length === 0) {
        // Ustawienie błędu, że lista materiałowa musi zawierać przynajmniej jeden element
        formik.setErrors({ bomItems: 'Lista materiałowa musi zawierać przynajmniej jeden element' });
        return;
      }
      
      // Sprawdzenie walidacji wszystkich elementów
      const itemsValid = validateAllBomItems();
      if (!itemsValid) {
        return;
      }
      
      // Złożenie kompletnego obiektu do wysłania
      const completeData = {
        ...values,
        items: bomItems
      };
      
      await onSubmit(completeData);
      onClose();
      formik.resetForm();
      setBomItems([]);
    },
  });

  // Ustawienie początkowych wartości dla elementów BOM, jeśli edytujemy istniejący BOM
  useEffect(() => {
    if (initialValues?.items) {
      setBomItems(initialValues.items.map(item => ({
        id: item.id,
        component_id: item.component.id,
        quantity: item.quantity,
        unit: item.unit
      })));
    } else {
      setBomItems([]);
    }
  }, [initialValues]);

  // Znajdź produkt po ID
  const findProduct = (productId) => {
    return products.find(p => p.id === productId);
  };

  // Znajdź komponent po ID
  const findComponent = (componentId) => {
    return components.find(c => c.id === componentId);
  };

  // Dodawanie nowego elementu do BOM
  const handleAddBomItem = () => {
    setBomItems([...bomItems, {
      component_id: '',
      quantity: 1,
      unit: ''
    }]);
  };

  // Usuwanie elementu z BOM
  const handleRemoveBomItem = (index) => {
    const updatedItems = [...bomItems];
    updatedItems.splice(index, 1);
    setBomItems(updatedItems);
    
    // Usunięcie błędów walidacji dla usuniętego elementu
    const updatedErrors = { ...bomItemValidationErrors };
    delete updatedErrors[index];
    setBomItemValidationErrors(updatedErrors);
  };

  // Aktualizacja wartości elementu BOM
  const handleBomItemChange = (index, field, value) => {
    const updatedItems = [...bomItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    
    // Jeśli zmieniamy komponent, ustawmy też jednostkę
    if (field === 'component_id') {
      const component = findComponent(value);
      if (component) {
        updatedItems[index].unit = component.unit;
      }
    }
    
    setBomItems(updatedItems);
    
    // Sprawdzenie walidacji po zmianie
    validateBomItem(index, updatedItems[index]);
  };

  // Walidacja pojedynczego elementu BOM
  const validateBomItem = (index, item) => {
    try {
      bomItemValidationSchema.validateSync(item, { abortEarly: false });
      // Jeśli walidacja powiodła się, usuwamy błędy dla tego elementu
      const updatedErrors = { ...bomItemValidationErrors };
      delete updatedErrors[index];
      setBomItemValidationErrors(updatedErrors);
      return true;
    } catch (error) {
      // Jeśli walidacja nie powiodła się, zapisujemy błędy
      const errors = {};
      error.inner.forEach(err => {
        errors[err.path] = err.message;
      });
      
      const updatedErrors = { ...bomItemValidationErrors };
      updatedErrors[index] = errors;
      setBomItemValidationErrors(updatedErrors);
      return false;
    }
  };

  // Walidacja wszystkich elementów BOM
  const validateAllBomItems = () => {
    let isValid = true;
    bomItems.forEach((item, index) => {
      const itemValid = validateBomItem(index, item);
      if (!itemValid) {
        isValid = false;
      }
    });
    return isValid;
  };

  // Zamknięcie formularza
  const handleCancel = () => {
    formik.resetForm();
    setBomItems([]);
    setBomItemValidationErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="lg"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>
          {isNewBOM ? 'Nowa lista materiałowa (BOM)' : 'Edycja listy materiałowej'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Nazwa BOM */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nazwa listy materiałowej"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
                required
              />
            </Grid>
            
            {/* Wersja */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="version"
                name="version"
                label="Wersja"
                value={formik.values.version}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.version && Boolean(formik.errors.version)}
                helperText={formik.touched.version && formik.errors.version}
                margin="normal"
                required
              />
            </Grid>
            
            {/* Status aktywności */}
            <Grid item xs={12} md={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.is_active}
                    onChange={formik.handleChange}
                    name="is_active"
                    color="primary"
                  />
                }
                label="Lista aktywna"
                sx={{ mt: 2 }}
              />
            </Grid>

            {/* Produkt */}
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.product_id && Boolean(formik.errors.product_id)}
                required
              >
                <InputLabel>Produkt końcowy</InputLabel>
                <Select
                  id="product_id"
                  name="product_id"
                  value={formik.values.product_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Produkt końcowy"
                >
                  {products
                    .filter(product => product.product_type === 'FINAL')
                    .map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span><strong>{product.code}</strong> - {product.name}</span>
                        </div>
                      </MenuItem>
                    ))}
                </Select>
                {formik.touched.product_id && formik.errors.product_id && (
                  <FormHelperText>{formik.errors.product_id}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Opis */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Opis"
                multiline
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
              />
            </Grid>

            {/* Tabela elementów BOM */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddBomItem}
                    >
                      Dodaj komponent
                    </Button>
                  </Grid>
                  {formik.errors.bomItems && (
                    <Grid item xs>
                      <FormHelperText error>{formik.errors.bomItems}</FormHelperText>
                    </Grid>
                  )}
                </Grid>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Komponent</TableCell>
                        <TableCell align="right" width="150px">Ilość</TableCell>
                        <TableCell width="80px">Jednostka</TableCell>
                        <TableCell width="60px">Akcje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bomItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            Brak komponentów. Dodaj komponenty do listy materiałowej.
                          </TableCell>
                        </TableRow>
                      ) : (
                        bomItems.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <FormControl 
                                fullWidth
                                error={Boolean(bomItemValidationErrors[index]?.component_id)}
                                size="small"
                              >
                                <Select
                                  value={item.component_id}
                                  onChange={(e) => handleBomItemChange(index, 'component_id', e.target.value)}
                                  displayEmpty
                                >
                                  <MenuItem value="" disabled>
                                    Wybierz komponent
                                  </MenuItem>
                                  {components
                                    .filter(comp => comp.id !== formik.values.product_id)
                                    .map((component) => (
                                      <MenuItem key={component.id} value={component.id}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                          <span><strong>{component.code}</strong> - {component.name}</span>
                                        </div>
                                      </MenuItem>
                                    ))}
                                </Select>
                                {bomItemValidationErrors[index]?.component_id && (
                                  <FormHelperText>{bomItemValidationErrors[index].component_id}</FormHelperText>
                                )}
                              </FormControl>
                            </TableCell>
                            <TableCell align="right">
                              <FormControl 
                                fullWidth
                                error={Boolean(bomItemValidationErrors[index]?.quantity)}
                                size="small"
                              >
                                <TextField
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleBomItemChange(index, 'quantity', parseFloat(e.target.value) || '')}
                                  inputProps={{ min: 0, step: "0.01" }}
                                  size="small"
                                  error={Boolean(bomItemValidationErrors[index]?.quantity)}
                                  helperText={bomItemValidationErrors[index]?.quantity}
                                />
                              </FormControl>
                            </TableCell>
                            <TableCell>
                              {item.unit || (item.component_id && findComponent(item.component_id)?.unit) || ''}
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleRemoveBomItem(index)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Anuluj
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formik.isValid}
          >
            {isNewBOM ? 'Dodaj listę materiałową' : 'Zapisz zmiany'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
