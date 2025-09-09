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
  IconButton,
  Switch,
  FormControlLabel,
  Typography,
  Alert
} from '@mui/material';
import { Close as CloseIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import type { Expense, ExpenseFormData, Category, Type } from '../../types';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';
import { SupabaseTypesService as TypesService } from '../../services/supabase/typesService';
import { formatBRL } from '../../utils/currency.util';

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseFormData) => void;
  expense?: Expense;
  isEdit: boolean;
}

export const ExpenseDialog: React.FC<ExpenseDialogProps> = ({
  open,
  onClose,
  onSave,
  expense,
  isEdit
}) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    categoryId: '',
    typeId: '',
    value: 0,
    datePrevista: new Date().toISOString().split('T')[0],
    dateEfetiva: '',
    obs: '',
    isMensal: false,
    quantidadeMeses: 1
  });
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [valueInput, setValueInput] = useState('');

  useEffect(() => {
    if (expense && isEdit) {
      setFormData({
        categoryId: expense.categoryId,
        typeId: expense.typeId,
        value: expense.value,
        datePrevista: expense.datePrevista,
        dateEfetiva: expense.dateEfetiva || '',
        obs: expense.obs || '',
        isMensal: false,
        quantidadeMeses: 1
      });
      setValueInput(formatBRL(expense.value));
    } else {
      setFormData({
        categoryId: '',
        typeId: '',
        value: 0,
        datePrevista: new Date().toISOString().split('T')[0],
        dateEfetiva: '',
        obs: '',
        isMensal: false,
        quantidadeMeses: 1
      });
      setValueInput('');
    }
    setErrors({});
  }, [expense, isEdit, open]);

  useEffect(() => {
    const loadData = async () => {
      await loadCategories();
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadTypesData = async () => {
      if (formData.categoryId) {
        await loadTypes();
      } else {
        setTypes([]);
        setFormData(prev => ({ ...prev, typeId: '' }));
      }
    };
    loadTypesData();
  }, [formData.categoryId]);

  const loadCategories = async () => {
    try {
      const allCategories = await CategoriesService.getAll();
      const expenseCategories = allCategories.filter(cat => cat.kind === 'Despesa');
      setCategories(expenseCategories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const loadTypes = async () => {
    try {
      const allTypes = await TypesService.getAll();
      const expenseTypes = allTypes.filter(type => 
        type.kind === 'Despesa' && type.categoryId === formData.categoryId
      );
      setTypes(expenseTypes);
    } catch (error) {
      console.error('Erro ao carregar tipos:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.categoryId) {
      newErrors.categoryId = 'Categoria é obrigatória';
    }

    if (!formData.typeId) {
      newErrors.typeId = 'Tipo é obrigatório';
    }

    if (formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }

    if (!formData.datePrevista) {
      newErrors.datePrevista = 'Data prevista é obrigatória';
    }

    if (formData.isMensal && (!formData.quantidadeMeses || formData.quantidadeMeses < 1 || formData.quantidadeMeses > 120)) {
      newErrors.quantidadeMeses = 'Quantidade de meses deve ser entre 1 e 120';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Valor já está em reais (não precisa converter para centavos)
      const valueInReais = parseFloat(valueInput.replace(/[^\d,]/g, '').replace(',', '.'));
      
      onSave({
        ...formData,
        value: valueInReais
      });
    }
  };

  const handleValueChange = (value: string) => {
    setValueInput(value);
    
    // Valor já está em reais (não precisa converter para centavos)
    const numericValue = parseFloat(value.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!isNaN(numericValue) && numericValue > 0) {
      setFormData(prev => ({ ...prev, value: numericValue }));
    }
  };

  const handleChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSwitchChange = (field: keyof ExpenseFormData, checked: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: checked,
      ...(field === 'isMensal' && !checked && { quantidadeMeses: 1 })
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {isEdit ? <EditIcon color="primary" /> : <AddIcon color="primary" />}
            {isEdit ? 'Editar' : 'Nova'} Despesa
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <Box display="flex" gap={2}>
            <FormControl fullWidth error={!!errors.categoryId}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={formData.categoryId}
                label="Categoria"
                onChange={(e) => handleChange('categoryId', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && (
                <Typography color="error" variant="caption">
                  {errors.categoryId}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth error={!!errors.typeId}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formData.typeId}
                label="Tipo"
                onChange={(e) => handleChange('typeId', e.target.value)}
                disabled={!formData.categoryId || types.length === 0}
              >
                {types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.typeId && (
                <Typography color="error" variant="caption">
                  {errors.typeId}
                </Typography>
              )}
              {formData.categoryId && types.length === 0 && (
                <Typography color="text.secondary" variant="caption">
                  Nenhum tipo disponível para esta categoria
                </Typography>
              )}
            </FormControl>
          </Box>

          <TextField
            fullWidth
            label="Valor (R$)"
            placeholder="0,00"
            value={valueInput}
            onChange={(e) => handleValueChange(e.target.value)}
            error={!!errors.value}
            helperText={errors.value || 'Digite o valor em reais'}
            inputProps={{
              inputMode: 'decimal',
              pattern: '[0-9]*[.,]?[0-9]*'
            }}
          />

          <Box display="flex" gap={2}>
            <TextField
              fullWidth
              label="Data Prevista"
              type="date"
              value={formData.datePrevista}
              onChange={(e) => handleChange('datePrevista', e.target.value)}
              error={!!errors.datePrevista}
              helperText={errors.datePrevista}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Data Efetiva (opcional)"
              type="date"
              value={formData.dateEfetiva}
              onChange={(e) => handleChange('dateEfetiva', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Box>

          <TextField
            fullWidth
            label="Observação (opcional)"
            placeholder="Descrição adicional da despesa"
            value={formData.obs}
            onChange={(e) => handleChange('obs', e.target.value)}
            multiline
            rows={3}
          />

          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isMensal}
                  onChange={(e) => handleSwitchChange('isMensal', e.target.checked)}
                />
              }
              label="É mensal?"
            />
            
            {formData.isMensal && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="Quantidade de meses"
                  type="number"
                  value={formData.quantidadeMeses}
                  onChange={(e) => handleChange('quantidadeMeses', parseInt(e.target.value))}
                  error={!!errors.quantidadeMeses}
                  helperText={errors.quantidadeMeses || 'Entre 1 e 120 meses'}
                  inputProps={{
                    min: 1,
                    max: 120
                  }}
                />
                <Alert severity="info" sx={{ mt: 1 }}>
                  Serão criadas {formData.quantidadeMeses} despesas mensais, uma para cada mês.
                </Alert>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={isEdit ? <EditIcon /> : <AddIcon />}
          disabled={!formData.categoryId || !formData.typeId || formData.value <= 0}
        >
          {isEdit ? 'Salvar' : 'Criar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
