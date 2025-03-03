import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = 'Potwierdź akcję',
  content = 'Czy na pewno chcesz wykonać tę akcję?',
  confirmLabel = 'Potwierdź',
  cancelLabel = 'Anuluj',
  severity = 'warning'
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelLabel}
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={getSeverityColor()} 
          autoFocus
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
