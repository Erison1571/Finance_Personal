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
import type { Category, CategoryFormData, Kind } from '../../types';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';
import { CategoryDialog } from './CategoryDialog';
import { ConfirmDialog } from '../Common/ConfirmDialog';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedKind, setSelectedKind] = useState<'all' | Kind>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deletingCategory, setDeletingCategory] = useState<Category | undefined>();
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
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedKind !== 'all') {
      setSelectedCategory('all');
    }
  }, [selectedKind]);

  const loadCategories = async () => {
    try {
      const allCategories = await CategoriesService.getAll();
      setCategories(allCategories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar categorias',
        severity: 'error'
      });
    }
  };

  const getFilteredCategories = (kind: Kind) => {
    let filtered = categories.filter(cat => cat.kind === kind);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cat => cat.id === selectedCategory);
    }
    
    return filtered;
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

  const handleOpenDialog = (category?: Category, edit = false) => {
    setEditingCategory(category);
    setIsEdit(edit);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(undefined);
    setIsEdit(false);
  };

  const handleSaveCategory = async (categoryData: CategoryFormData) => {
    try {
      let success = false;
      
      if (isEdit && editingCategory) {
        const updated = await CategoriesService.update(editingCategory.id, categoryData);
        success = updated !== null;
        if (success) {
          showSnackbar('Categoria atualizada com sucesso!', 'success');
        }
      } else {
        const created = await CategoriesService.create(categoryData);
        success = created !== null;
        if (success) {
          showSnackbar('Categoria criada com sucesso!', 'success');
        }
      }

      if (success) {
        await loadCategories();
        handleCloseDialog();
      } else {
        showSnackbar('Erro ao salvar categoria!', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      showSnackbar('Erro ao salvar categoria!', 'error');
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingCategory) {
      try {
        const success = await CategoriesService.delete(deletingCategory.id);
        if (success) {
          showSnackbar('Categoria excluída com sucesso!', 'success');
          await loadCategories();
        } else {
          showSnackbar('Erro ao excluir categoria!', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir categoria:', error);
        showSnackbar('Erro ao excluir categoria!', 'error');
      }
    }
    setConfirmDialogOpen(false);
    setDeletingCategory(undefined);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };



  const renderCategoriesTable = (kind: Kind, title: string) => {
    const filteredCategories = getFilteredCategories(kind);
    
    return (
      <Paper sx={{ p: 2, height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom color={kind === 'Receita' ? 'success.main' : 'error.main'}>
          {title} ({filteredCategories.length})
        </Typography>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome da Categoria</TableCell>
                <TableCell align="center" width={100}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 2 }}>
                    <Typography color="text.secondary" variant="body2">
                      Nenhuma categoria encontrada.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(category, true)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(category)}
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
          Categorias
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Categoria
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
                {categories.filter(cat => selectedKind === 'all' || cat.kind === selectedKind).map((category) => (
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
          {renderCategoriesTable('Despesa', 'Despesas')}
        </Box>
        <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
          {renderCategoriesTable('Receita', 'Receitas')}
        </Box>
      </Box>

      <CategoryDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveCategory}
        category={editingCategory}
        isEdit={isEdit}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a categoria "${deletingCategory?.name}"?`}
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
