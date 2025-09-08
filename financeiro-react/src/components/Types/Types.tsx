import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import type { Type, TypeFormData, Kind, Category } from '../../types';
import { SupabaseTypesService as TypesService } from '../../services/supabase/typesService';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';
import { TypeDialog } from './TypeDialog';
import { ConfirmDialog } from '../Common/ConfirmDialog';

export const Types: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedKind, setSelectedKind] = useState<'all' | Kind>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<Type | undefined>();
  const [deletingType, setDeletingType] = useState<Type | undefined>();
  const [isEdit, setIsEdit] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedKind !== 'all') {
      setSelectedCategory('all');
    }
  }, [selectedKind]);

  const loadData = async () => {
    try {
      const allTypes = await TypesService.getAll();
      const allCategories = await CategoriesService.getAll();
      setTypes(allTypes);
      setCategories(allCategories);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados',
        severity: 'error'
      });
    }
  };

  const getFilteredTypes = (kind: Kind) => {
    let filtered = types.filter(type => type.kind === kind);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(type => type.categoryId === selectedCategory);
    }
    
    return filtered;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const getFilteredCategories = () => {
    if (selectedKind === 'all') {
      return categories;
    }
    return categories.filter(cat => cat.kind === selectedKind);
  };

  const handleKindChange = (
    _: React.MouseEvent<HTMLElement>,
    newKind: 'all' | Kind | null
  ) => {
    if (newKind !== null) {
      setSelectedKind(newKind);
    }
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handleOpenDialog = (type?: Type, edit = false) => {
    setEditingType(type);
    setIsEdit(edit);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingType(undefined);
    setIsEdit(false);
  };

  const handleSaveType = async (typeData: TypeFormData) => {
    try {
      let success = false;
      
      if (isEdit && editingType) {
        const updated = await TypesService.update(editingType.id, typeData);
        success = updated !== null;
        if (success) {
          showSnackbar('Tipo atualizado com sucesso!', 'success');
        }
      } else {
        const created = await TypesService.create(typeData);
        success = created !== null;
        if (success) {
          showSnackbar('Tipo criado com sucesso!', 'success');
        }
      }

      if (success) {
        await loadData();
        handleCloseDialog();
      } else {
        showSnackbar('Erro ao salvar tipo!', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar tipo:', error);
      showSnackbar('Erro ao salvar tipo!', 'error');
    }
  };

  const handleDeleteClick = (type: Type) => {
    setDeletingType(type);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingType) {
      try {
        const success = await TypesService.delete(deletingType.id);
        if (success) {
          showSnackbar('Tipo excluído com sucesso!', 'success');
          await loadData();
        } else {
          showSnackbar('Erro ao excluir tipo!', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir tipo:', error);
        showSnackbar('Erro ao excluir tipo!', 'error');
      }
    }
    setConfirmDialogOpen(false);
    setDeletingType(undefined);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const renderTypesTable = (kind: Kind, title: string) => {
    const filteredTypes = getFilteredTypes(kind);
    
    return (
      <Paper sx={{ p: 2, height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom color={kind === 'Receita' ? 'success.main' : 'error.main'}>
          {title} ({filteredTypes.length})
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell align="center" width={100}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 2 }}>
                    <Typography color="text.secondary" variant="body2">
                      Nenhum tipo encontrado.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={getCategoryName(type.categoryId)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(type, true)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(type)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Tipos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Tipo
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight={500}>
              Vínculo:
            </Typography>
            <ToggleButtonGroup
              value={selectedKind}
              exclusive
              onChange={handleKindChange}
              size="small"
            >
              <ToggleButton value="all">Todos</ToggleButton>
              <ToggleButton value="Despesa">Despesa</ToggleButton>
              <ToggleButton value="Receita">Receita</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight={500}>
              Categoria:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoria"
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">Todas</MenuItem>
                {getFilteredCategories().map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          {renderTypesTable('Despesa', 'Despesas')}
        </Box>
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          {renderTypesTable('Receita', 'Receitas')}
        </Box>
      </Box>

      <TypeDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveType}
        type={editingType}
        isEdit={isEdit}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o tipo "${deletingType?.name}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
