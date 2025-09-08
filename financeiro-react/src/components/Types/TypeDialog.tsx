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
import type { Type, TypeFormData, Category } from '../../types';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';

interface TypeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (type: TypeFormData) => void;
  type?: Type;
  isEdit: boolean;
}

export const TypeDialog: React.FC<TypeDialogProps> = ({
  open,
  onClose,
  onSave,
  type,
  isEdit
}) => {
  const [formData, setFormData] = useState<TypeFormData>({
    name: '',
    kind: 'Despesa',
    categoryId: ''
  });
  const [errors, setErrors] = useState<{ name?: string; kind?: string; categoryId?: string }>({});
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (type && isEdit) {
      setFormData({
        name: type.name,
        kind: type.kind,
        categoryId: type.categoryId
      });
    } else {
      setFormData({
        name: '',
        kind: 'Despesa',
        categoryId: ''
      });
    }
    setErrors({});
  }, [type, isEdit, open]);

  useEffect(() => {
    const loadData = async () => {
      await loadCategories();
    };
    loadData();
  }, [formData.kind]);

  const loadCategories = async () => {
    try {
      const allCategories = await CategoriesService.getAll();
      const filteredCategories = allCategories.filter(cat => cat.kind === formData.kind);
      setCategories(filteredCategories);
      
      // Resetar categoria se não existir mais no novo vínculo
      if (formData.categoryId && !filteredCategories.find(cat => cat.id === formData.categoryId)) {
        setFormData(prev => ({ ...prev, categoryId: '' }));
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; kind?: string; categoryId?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.kind) {
      newErrors.kind = 'Vínculo é obrigatório';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        name: formData.name.trim(),
        kind: formData.kind,
        categoryId: formData.categoryId
      });
    }
  };

  const handleChange = (field: keyof TypeFormData, value: string) => {
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
            {isEdit ? 'Editar' : 'Novo'} Tipo
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <FormControl fullWidth error={!!errors.kind}>
            <InputLabel>Vínculo</InputLabel>
            <Select
              value={formData.kind}
              label="Vínculo"
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

          <FormControl fullWidth error={!!errors.categoryId}>
            <InputLabel>Categoria</InputLabel>
            <Select
              value={formData.categoryId}
              label="Categoria"
              onChange={(e) => handleChange('categoryId', e.target.value)}
              disabled={categories.length === 0}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.categoryId && (
              <Box component="span" sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                {errors.categoryId}
              </Box>
            )}
            {categories.length === 0 && (
              <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 0.5 }}>
                Nenhuma categoria disponível para este vínculo
              </Box>
            )}
          </FormControl>
          
          <TextField
            fullWidth
            label="Nome do Tipo"
            placeholder="Ex: Cartão de Crédito"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            autoFocus
          />
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isEdit ? <EditIcon /> : <AddIcon />}
          disabled={categories.length === 0}
        >
          {isEdit ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
