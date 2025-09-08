import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import type { Category, CategoryFormData } from '../../types';

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: CategoryFormData) => void;
  category?: Category;
  isEdit: boolean;
}

export const CategoryDialog: React.FC<CategoryDialogProps> = ({
  open,
  onClose,
  onSave,
  category,
  isEdit
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    kind: 'Despesa'
  });
  const [errors, setErrors] = useState<{ name?: string; kind?: string }>({});

  useEffect(() => {
    if (category && isEdit) {
      setFormData({
        name: category.name,
        kind: category.kind
      });
    } else {
      setFormData({
        name: '',
        kind: 'Despesa'
      });
    }
    setErrors({});
  }, [category, isEdit, open]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; kind?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.kind) {
      newErrors.kind = 'Tipo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        kind: formData.kind
      });
    }
  };

  const handleChange = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {isEdit ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
            {isEdit ? 'Editar' : 'Nova'} Categoria
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <TextField
            fullWidth
            label="Nome da Categoria"
            placeholder="Ex: Alimentação"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />
          
          <FormControl fullWidth error={!!errors.kind}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.kind}
              label="Tipo"
              onChange={(e) => handleChange('kind', e.target.value)}
            >
              <MenuItem value="Despesa">Despesa</MenuItem>
              <MenuItem value="Receita">Receita</MenuItem>
            </Select>
            {errors.kind && (
              <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {errors.kind}
              </Box>
            )}
          </FormControl>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isEdit ? <EditIcon /> : <AddIcon />}
        >
          {isEdit ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
