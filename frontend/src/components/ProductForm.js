import React from 'react';
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
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const productTypes = [
  { value: 'FINAL', label: 'Produkt końcowy' },
  { value: 'COMPONENT', label: 'Komponent' },
  { value: 'MATERIAL', label: 'Materiał' },
  { value: 'SERVICE', label: 'Usługa' }
];

const validationSchema = Yup.object({
  code: Yup.string()
    .required('Kod produktu jest wymagany')
    .max(20, 'Kod produktu nie może być dłuższy niż 20 znaków'),
  name: Yup.string()
    .required('Nazwa produktu jest wymagana')
    .max(100, 'Nazwa produktu nie może być dłuższa niż 100 znaków'),
  description: Yup.string()
    .max(500, 'Opis nie może być dłuższy niż 500 znaków'),
  product_type: Yup.string()
    .required('Typ produktu jest wymagany'),
  unit: Yup.string()
    .required('Jednostka miary jest wymagana')
    .max(10, 'Jednostka miary nie może być dłuższa niż 10 znaków'),
  price: Yup.number()
    .min(0, 'Cena nie może być ujemna')
    .nullable(),
  quantity_in_stock: Yup.number()
    .min(0, 'Stan magazynowy nie może być ujemny')
    .default(0),
  minimum_stock: Yup.number()
    .min(0, 'Minimalny stan magazynowy nie może być ujemny')
    .default(0),
  lead_time_days: Yup.number()
    .integer('Czas dostawy musi być liczbą całkowitą')
    .min(0, 'Czas dostawy nie może być ujemny')
    .default(0),
  active: Yup.boolean().default(true)
});

export default function ProductForm({ open, onClose, onSubmit, initialValues = null, title = 'Nowy produkt' }) {
  const isNewProduct = !initialValues?.id;
  
  const formik = useFormik({
    initialValues: initialValues || {
      code: '',
      name: '',
      description: '',
      product_type: 'COMPONENT',
      unit: 'szt',
      price: '',
      quantity_in_stock: 0,
      minimum_stock: 0,
      lead_time_days: 0,
      active: true
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values);
      onClose();
      formik.resetForm();
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Kod produktu */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="code"
                name="code"
                label="Kod produktu"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                disabled={!isNewProduct} // Kod nie powinien być edytowalny dla istniejących produktów
                margin="normal"
                required
              />
            </Grid>
            
            {/* Nazwa produktu */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Nazwa produktu"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin="normal"
                required
              />
            </Grid>

            {/* Typ produktu */}
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                margin="normal"
                error={formik.touched.product_type && Boolean(formik.errors.product_type)}
                required
              >
                <InputLabel>Typ produktu</InputLabel>
                <Select
                  id="product_type"
                  name="product_type"
                  value={formik.values.product_type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  label="Typ produktu"
                >
                  {productTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.product_type && formik.errors.product_type && (
                  <FormHelperText>{formik.errors.product_type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Jednostka miary */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="unit"
                name="unit"
                label="Jednostka miary"
                value={formik.values.unit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.unit && Boolean(formik.errors.unit)}
                helperText={formik.touched.unit && formik.errors.unit}
                margin="normal"
                required
              />
            </Grid>

            {/* Cena */}
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="price"
                name="price"
                label="Cena"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">PLN</InputAdornment>,
                }}
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                margin="normal"
              />
            </Grid>

            {/* Opis */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Opis"
                multiline
                rows={3}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                margin="normal"
              />
            </Grid>

            {/* Stan magazynowy */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="quantity_in_stock"
                name="quantity_in_stock"
                label="Stan magazynowy"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formik.values.unit}</InputAdornment>,
                }}
                value={formik.values.quantity_in_stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity_in_stock && Boolean(formik.errors.quantity_in_stock)}
                helperText={formik.touched.quantity_in_stock && formik.errors.quantity_in_stock}
                margin="normal"
              />
            </Grid>

            {/* Minimalny stan magazynowy */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="minimum_stock"
                name="minimum_stock"
                label="Minimalny stan magazynowy"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formik.values.unit}</InputAdornment>,
                }}
                value={formik.values.minimum_stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.minimum_stock && Boolean(formik.errors.minimum_stock)}
                helperText={formik.touched.minimum_stock && formik.errors.minimum_stock}
                margin="normal"
              />
            </Grid>

            {/* Czas dostawy w dniach */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="lead_time_days"
                name="lead_time_days"
                label="Czas dostawy"
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">dni</InputAdornment>,
                }}
                value={formik.values.lead_time_days}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lead_time_days && Boolean(formik.errors.lead_time_days)}
                helperText={formik.touched.lead_time_days && formik.errors.lead_time_days}
                margin="normal"
              />
            </Grid>

            {/* Status aktywności */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.active}
                    onChange={formik.handleChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Produkt aktywny"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="inherit">
            Anuluj
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {isNewProduct ? 'Dodaj produkt' : 'Zapisz zmiany'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
