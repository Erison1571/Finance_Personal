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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  PictureAsPdf as PictureAsPdfIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import type { Expense, Category, Type, ExpenseFormData } from '../../types';
import { SupabaseExpensesService as ExpensesService } from '../../services/supabase/expensesService';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';
import { SupabaseTypesService as TypesService } from '../../services/supabase/typesService';
import { ExpenseDialog } from './ExpenseDialog';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { EffectiveDialog } from '../Common/EffectiveDialog';
import { formatBRL } from '../../utils/currency.util';
import { formatDateBR, formatMonthYear } from '../../utils/date.util';
import { PDFExportService } from '../../services';

export const Expenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [showOnlyPending, setShowOnlyPending] = useState<boolean>(false);
  const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<string>('datePrevista');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deletingExpense, setDeletingExpense] = useState<Expense | undefined>();
  const [deleteSeriesDialogOpen, setDeleteSeriesDialogOpen] = useState(false);
  const [deletingSeries, setDeletingSeries] = useState<{ expense: Expense; series: Expense[] } | undefined>();
  
  // Estados para Sprint 6
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [effectiveDialogOpen, setEffectiveDialogOpen] = useState(false);
  const [approvingExpense, setApprovingExpense] = useState<Expense | undefined>();
  
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
    if (selectedCategory !== 'all') {
      setSelectedType('all');
    }
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const allExpenses = await ExpensesService.getAll();
      const allCategories = await CategoriesService.getAll();
      const allTypes = await TypesService.getAll();
      
      setExpenses(allExpenses);
      setCategories(allCategories.filter(cat => cat.kind === 'Despesa'));
      setTypes(allTypes.filter(type => type.kind === 'Despesa'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados',
        severity: 'error'
      });
    }
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(expense => expense.categoryId === selectedCategory);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(expense => expense.typeId === selectedType);
    }
    
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(expense => expense.datePrevista && expense.datePrevista.startsWith(selectedMonth));
    }
    
    if (showOnlyPending) {
      filtered = filtered.filter(expense => 
        !expense.dateEfetiva || expense.dateEfetiva === '' || expense.dateEfetiva === '-'
      );
    }
    
    // Aplicar ordenação
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortField) {
        case 'category':
          aValue = getCategoryName(a.categoryId);
          bValue = getCategoryName(b.categoryId);
          break;
        case 'type':
          aValue = getTypeName(a.typeId);
          bValue = getTypeName(b.typeId);
          break;
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'datePrevista':
          aValue = new Date(a.datePrevista).getTime();
          bValue = new Date(b.datePrevista).getTime();
          break;
        case 'dateEfetiva':
          aValue = a.dateEfetiva ? new Date(a.dateEfetiva).getTime() : 0;
          bValue = b.dateEfetiva ? new Date(b.dateEfetiva).getTime() : 0;
          break;
        case 'obs':
          aValue = a.obs || '';
          bValue = b.obs || '';
          break;
        default:
          aValue = new Date(a.datePrevista).getTime();
          bValue = new Date(b.datePrevista).getTime();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
  };

  const getTypeName = (typeId: string) => {
    const type = types.find(t => t.id === typeId);
    return type ? type.name : 'Tipo não encontrado';
  };

  const getFilteredTypes = () => {
    if (selectedCategory === 'all') {
      return types;
    }
    return types.filter(type => type.categoryId === selectedCategory);
  };

  const getAvailableMonths = () => {
    const months = new Set<string>();
    expenses.forEach(expense => {
      months.add(expense.datePrevista.substring(0, 7)); // YYYY-MM
    });
    return Array.from(months).sort().reverse();
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveExpense = async (expenseData: any) => {
    try {
      const createdExpenses = await ExpensesService.create(expenseData);
      
      if (createdExpenses.length > 0) {
        const message = createdExpenses.length === 1 
          ? 'Despesa criada com sucesso!' 
          : `${createdExpenses.length} despesas mensais criadas com sucesso!`;
        
        showSnackbar(message, 'success');
        await loadData();
        handleCloseDialog();
      } else {
        showSnackbar('Erro ao criar despesa!', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar despesa:', error);
      showSnackbar('Erro ao salvar despesa', 'error');
    }
  };

  const handleDeleteClick = async (expense: Expense) => {
    // Verificar se é uma despesa mensal
    if (expense.isMensal && expense.seriesId) {
      const series = await ExpensesService.getBySeries(expense.seriesId);
      setDeletingSeries({ expense, series });
      setDeleteSeriesDialogOpen(true);
    } else {
      setDeletingExpense(expense);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingExpense) {
      try {
        const success = await ExpensesService.delete(deletingExpense.id);
        if (success) {
          showSnackbar('Despesa excluída com sucesso!', 'success');
          await loadData();
        } else {
          showSnackbar('Erro ao excluir despesa!', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
        showSnackbar('Erro ao excluir despesa!', 'error');
      }
    }
    setConfirmDialogOpen(false);
    setDeletingExpense(undefined);
  };

  const handleDeleteSeries = async (deleteAll: boolean) => {
    if (!deletingSeries) return;
    
    try {
      if (deleteAll) {
        // Excluir toda a série
        for (const expense of deletingSeries.series) {
          await ExpensesService.delete(expense.id);
        }
        showSnackbar('Série de despesas excluída com sucesso!', 'success');
      } else {
        // Excluir apenas a despesa selecionada
        await ExpensesService.delete(deletingSeries.expense.id);
        showSnackbar('Despesa excluída com sucesso!', 'success');
      }
      
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir série:', error);
      showSnackbar('Erro ao excluir série!', 'error');
    }
    
    setDeleteSeriesDialogOpen(false);
    setDeletingSeries(undefined);
  };

  // Funções para Sprint 6
  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingExpense(undefined);
  };

  const handleEditSave = async (formData: ExpenseFormData) => {
    if (!editingExpense) return;
    
    const updatedExpense: Expense = {
      ...editingExpense,
      categoryId: formData.categoryId,
      typeId: formData.typeId,
      value: formData.value,
      datePrevista: formData.datePrevista,
      dateEfetiva: formData.dateEfetiva,
      obs: formData.obs
    };
    
    try {
      await ExpensesService.update(updatedExpense.id, updatedExpense);
      showSnackbar('Despesa editada com sucesso!', 'success');
      handleEditClose();
      await loadData();
    } catch (error) {
      console.error('Erro ao editar despesa:', error);
      showSnackbar('Erro ao editar despesa!', 'error');
    }
  };

  const handleApproveClick = (expense: Expense) => {
    setApprovingExpense(expense);
    setEffectiveDialogOpen(true);
  };

  const handleApproveClose = () => {
    setEffectiveDialogOpen(false);
    setApprovingExpense(undefined);
  };

  const handleApproveSave = async (effectiveData: { valueEffective: number; dateEffective: string; obs?: string }) => {
    if (!approvingExpense) return;
    
    const updatedExpense: Expense = {
      ...approvingExpense,
      value: effectiveData.valueEffective,
      dateEfetiva: effectiveData.dateEffective,
      obs: effectiveData.obs || approvingExpense.obs
    };
    
    try {
      await ExpensesService.update(updatedExpense.id, updatedExpense);
      showSnackbar('Despesa aprovada com sucesso!', 'success');
      handleApproveClose();
      await loadData();
    } catch (error) {
      console.error('Erro ao aprovar despesa:', error);
      showSnackbar('Erro ao aprovar despesa!', 'error');
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedMonth(() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    setShowOnlyPending(false);
    setSelectedExpenses(new Set());
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleSelectExpense = (expenseId: string) => {
    const newSelected = new Set(selectedExpenses);
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId);
    } else {
      newSelected.add(expenseId);
    }
    setSelectedExpenses(newSelected);
  };

  const handleSelectAllPending = () => {
    const pendingExpenses = getPendingExpenses();
    const allPendingIds = new Set(pendingExpenses.map(expense => expense.id));
    
    if (selectedExpenses.size === allPendingIds.size && 
        [...selectedExpenses].every(id => allPendingIds.has(id))) {
      // Se todos estão selecionados, desmarcar todos
      setSelectedExpenses(new Set());
    } else {
      // Selecionar todos os pendentes
      setSelectedExpenses(allPendingIds);
    }
  };

  const getSelectedExpensesData = () => {
    const selectedExpensesList = filteredExpenses.filter(expense => 
      selectedExpenses.has(expense.id) && isItemOpen(expense)
    );
    const totalValue = selectedExpensesList.reduce((total, expense) => total + expense.value, 0);
    return {
      count: selectedExpensesList.length,
      totalValue
    };
  };

  const handleExportPDF = () => {
    try {
      const filteredExpenses = getFilteredExpenses();
      PDFExportService.exportExpenses(
        filteredExpenses,
        categories,
        types,
        {
          selectedCategory,
          selectedType,
          selectedMonth
        }
      );
      showSnackbar('PDF exportado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      showSnackbar('Erro ao exportar PDF!', 'error');
    }
  };

  const isItemOpen = (expense: Expense): boolean => {
    return !expense.dateEfetiva || expense.dateEfetiva === '' || expense.dateEfetiva === '-';
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getTotalValue = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.value, 0);
  };

  const getEffectiveExpenses = () => {
    return getFilteredExpenses().filter(expense => 
      expense.dateEfetiva && expense.dateEfetiva !== '' && expense.dateEfetiva !== '-'
    );
  };

  const getPendingExpenses = () => {
    return getFilteredExpenses().filter(expense => 
      !expense.dateEfetiva || expense.dateEfetiva === '' || expense.dateEfetiva === '-'
    );
  };

  const getEffectiveValue = () => {
    return getEffectiveExpenses().reduce((total, expense) => total + expense.value, 0);
  };

  const getPendingValue = () => {
    return getPendingExpenses().reduce((total, expense) => total + expense.value, 0);
  };

  const filteredExpenses = getFilteredExpenses();
  const totalValue = getTotalValue();
  const availableMonths = getAvailableMonths();
  const effectiveExpenses = getEffectiveExpenses();
  const pendingExpenses = getPendingExpenses();
  const effectiveValue = getEffectiveValue();
  const pendingValue = getPendingValue();
  const selectedData = getSelectedExpensesData();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Despesas
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            color="error"
          >
            Exportar PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Adicionar Despesa
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight={500}>
              Categoria:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Categoria"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight={500}>
              Tipo:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={selectedType}
                label="Tipo"
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={selectedCategory === 'all'}
              >
                <MenuItem value="all">Todos</MenuItem>
                {getFilteredTypes().map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body1" fontWeight={500}>
              Mês:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Mês</InputLabel>
              <Select
                value={selectedMonth}
                label="Mês"
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                {availableMonths.map((month) => (
                  <MenuItem key={month} value={month}>
                    {formatMonthYear(month + '-01')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant={showOnlyPending ? "contained" : "outlined"}
              color={showOnlyPending ? "warning" : "primary"}
              onClick={() => setShowOnlyPending(!showOnlyPending)}
              startIcon={<CheckCircleIcon />}
              sx={{ 
                minWidth: 180,
                fontWeight: showOnlyPending ? 'bold' : 'normal'
              }}
            >
              {showOnlyPending ? 'Mostrando Pendentes' : 'Apenas Pendentes'}
            </Button>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              sx={{ minWidth: 120 }}
            >
              Limpar Filtros
            </Button>
          </Box>
        </Box>

        <Box mt={2}>
          <Typography variant="h6" color="error">
            Total: {formatBRL(totalValue)} ({filteredExpenses.length} despesa{filteredExpenses.length !== 1 ? 's' : ''})
          </Typography>
        </Box>
      </Paper>

      {/* Cards de Resumo */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Total Geral
              </Typography>
              <Typography variant="h6" color="error">
                {formatBRL(totalValue)}
              </Typography>
            </Box>
            <Typography variant="h4" color="error">
              💰
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Quantidade
              </Typography>
              <Typography variant="h6" color="primary">
                {filteredExpenses.length}
              </Typography>
            </Box>
            <Typography variant="h4" color="primary">
              📊
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Média por Item
              </Typography>
              <Typography variant="h6" color="warning.main">
                {filteredExpenses.length > 0 ? formatBRL(totalValue / filteredExpenses.length) : formatBRL(0)}
              </Typography>
            </Box>
            <Typography variant="h4" color="warning.main">
              📈
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Maior Valor
              </Typography>
              <Typography variant="h6" color="error">
                {filteredExpenses.length > 0 ? formatBRL(Math.max(...filteredExpenses.map(e => e.value))) : formatBRL(0)}
              </Typography>
            </Box>
            <Typography variant="h4" color="error">
              🔺
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Cards de Status das Despesas */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px', border: '2px solid', borderColor: 'success.main' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Despesas Efetivadas
              </Typography>
              <Typography variant="h6" color="success.main" fontWeight="bold">
                {formatBRL(effectiveValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {effectiveExpenses.length} despesa{effectiveExpenses.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              ✅
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px', border: '2px solid', borderColor: 'warning.main' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" gutterBottom variant="body2">
                Despesas à Efetivar
              </Typography>
              <Typography variant="h6" color="warning.main" fontWeight="bold">
                {formatBRL(pendingValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {pendingExpenses.length} despesa{pendingExpenses.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Typography variant="h4" color="warning.main">
              ⏳
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Card de Despesas Selecionadas */}
      {selectedData.count > 0 && (
        <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
          <Paper sx={{ p: 2, minWidth: 200, flex: '1 1 200px', border: '2px solid', borderColor: 'info.main', backgroundColor: 'info.light' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="text.secondary" gutterBottom variant="body2">
                  Despesas Selecionadas
                </Typography>
                <Typography variant="h6" color="info.main" fontWeight="bold">
                  {formatBRL(selectedData.totalValue)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedData.count} despesa{selectedData.count !== 1 ? 's' : ''} selecionada{selectedData.count !== 1 ? 's' : ''}
                </Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                📋
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selectedData.count > 0 && selectedData.count < pendingExpenses.length}
                  checked={selectedData.count > 0 && selectedData.count === pendingExpenses.length}
                  onChange={handleSelectAllPending}
                  color="primary"
                />
              </TableCell>
              <TableCell 
                onClick={() => handleSort('category')}
                sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Categoria
                  {sortField === 'category' && (
                    sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('type')}
                sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Tipo
                  {sortField === 'type' && (
                    sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('value')}
                sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Valor
                  {sortField === 'value' && (
                    sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('datePrevista')}
                sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Data Prevista
                  {sortField === 'datePrevista' && (
                    sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('dateEfetiva')}
                sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Data Efetiva
                  {sortField === 'dateEfetiva' && (
                    sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell 
                onClick={() => handleSort('obs')}
                sx={{ cursor: 'pointer', userSelect: 'none', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  Observação
                  {sortField === 'obs' && (
                    sortDirection === 'asc' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />
                  )}
                </Box>
              </TableCell>
              <TableCell align="center" width={80}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhuma despesa encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell padding="checkbox">
                    {isItemOpen(expense) ? (
                      <Checkbox
                        checked={selectedExpenses.has(expense.id)}
                        onChange={() => handleSelectExpense(expense.id)}
                        color="primary"
                      />
                    ) : (
                      <Box sx={{ width: 24, height: 24 }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoryName(expense.categoryId)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeName(expense.typeId)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} color="error">
                      {formatBRL(expense.value)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateBR(expense.datePrevista)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {expense.dateEfetiva ? (
                      <Typography variant="body2" color="success.main">
                        {formatDateBR(expense.dateEfetiva)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {expense.obs || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      {isItemOpen(expense) && (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(expense)}
                            size="small"
                            aria-label="Editar despesa"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => handleApproveClick(expense)}
                            size="small"
                            aria-label="Aprovar despesa"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(expense)}
                        size="small"
                        aria-label="Excluir despesa"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ExpenseDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveExpense}
        isEdit={false}
      />

      {/* Diálogo de Edição */}
      <ExpenseDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
        isEdit={true}
        expense={editingExpense}
      />

      {/* Diálogo de Aprovação */}
      <EffectiveDialog
        open={effectiveDialogOpen}
        onClose={handleApproveClose}
        onSave={handleApproveSave}
        title="Aprovar Despesa"
        amount={approvingExpense?.value || 0}
        description={approvingExpense?.obs || ''}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta despesa de ${formatBRL(deletingExpense?.value || 0)}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {/* Diálogo para despesas mensais */}
      <Dialog open={deleteSeriesDialogOpen} onClose={() => setDeleteSeriesDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h6" color="error">
            Despesa Mensal Detectada
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Esta despesa faz parte de uma série mensal com {deletingSeries?.series.length} lançamentos.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Valor:</strong> {formatBRL(deletingSeries?.expense.value || 0)}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Período:</strong> {deletingSeries?.series.map(e => formatDateBR(e.datePrevista)).join(', ')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              O que você deseja fazer?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSeriesDialogOpen(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={() => handleDeleteSeries(false)} 
            color="warning"
            variant="outlined"
          >
            Excluir Apenas Esta
          </Button>
          <Button 
            onClick={() => handleDeleteSeries(true)} 
            color="error"
            variant="contained"
          >
            Excluir Toda a Série
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
