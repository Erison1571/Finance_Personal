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
  DialogActions
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
import type { Income, Category, Type, IncomeFormData } from '../../types';
import { SupabaseIncomesService as IncomesService } from '../../services/supabase/incomesService';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';
import { SupabaseTypesService as TypesService } from '../../services/supabase/typesService';
import { IncomeDialog } from './IncomeDialog';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { EffectiveDialog } from '../Common/EffectiveDialog';
import { formatBRL } from '../../utils/currency.util';
import { formatDateBR, formatMonthYear } from '../../utils/date.util';
import { PDFExportService } from '../../services';

export const Incomes: React.FC = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [sortField, setSortField] = useState<string>('datePrevista');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deletingIncome, setDeletingIncome] = useState<Income | undefined>();
  const [deleteSeriesDialogOpen, setDeleteSeriesDialogOpen] = useState(false);
  const [deletingSeries, setDeletingSeries] = useState<{ income: Income; series: Income[] } | undefined>();
  
  // Estados para Sprint 6
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | undefined>();
  const [effectiveDialogOpen, setEffectiveDialogOpen] = useState(false);
  const [approvingIncome, setApprovingIncome] = useState<Income | undefined>();
  
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
      const allIncomes = await IncomesService.getAll();
      const allCategories = await CategoriesService.getAll();
      const allTypes = await TypesService.getAll();
      
      setIncomes(allIncomes);
      setCategories(allCategories.filter(cat => cat.kind === 'Receita'));
      setTypes(allTypes.filter(type => type.kind === 'Receita'));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar dados',
        severity: 'error'
      });
    }
  };

  const getFilteredIncomes = () => {
    let filtered = [...incomes];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(income => income.categoryId === selectedCategory);
    }
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(income => income.typeId === selectedType);
    }
    
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(income => income.datePrevista && income.datePrevista.startsWith(selectedMonth));
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
    incomes.forEach(income => {
      if (income.datePrevista) {
        months.add(income.datePrevista.substring(0, 7)); // YYYY-MM
      }
    });
    return Array.from(months).sort().reverse();
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSaveIncome = async (incomeData: any) => {
    try {
      const createdIncomes = await IncomesService.create(incomeData);
      
      if (createdIncomes.length > 0) {
        const message = createdIncomes.length === 1 
          ? 'Receita criada com sucesso!' 
          : `${createdIncomes.length} receitas mensais criadas com sucesso!`;
        
        showSnackbar(message, 'success');
        await loadData();
        handleCloseDialog();
      } else {
        showSnackbar('Erro ao criar receita!', 'error');
      }
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      showSnackbar('Erro ao salvar receita', 'error');
    }
  };

  const handleDeleteClick = async (income: Income) => {
    // Verificar se é uma receita mensal
    if (income.isMensal && income.seriesId) {
      const series = await IncomesService.getBySeries(income.seriesId);
      setDeletingSeries({ income, series });
      setDeleteSeriesDialogOpen(true);
    } else {
      setDeletingIncome(income);
      setConfirmDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingIncome) {
      try {
        const success = await IncomesService.delete(deletingIncome.id);
        if (success) {
          showSnackbar('Receita excluída com sucesso!', 'success');
          await loadData();
        } else {
          showSnackbar('Erro ao excluir receita!', 'error');
        }
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
        showSnackbar('Erro ao excluir receita!', 'error');
      }
    }
    setConfirmDialogOpen(false);
    setDeletingIncome(undefined);
  };

  const handleDeleteSeries = async (deleteAll: boolean) => {
    if (deletingSeries) {
      try {
        let success = false;
        
        if (deleteAll) {
          // Excluir toda a série
          success = await IncomesService.deleteBySeries(deletingSeries.income.seriesId!);
          if (success) {
            showSnackbar(`${deletingSeries.series.length} receitas mensais excluídas com sucesso!`, 'success');
          }
        } else {
          // Excluir apenas a receita selecionada
          success = await IncomesService.delete(deletingSeries.income.id);
          if (success) {
            showSnackbar('Receita excluída com sucesso!', 'success');
          }
        }
        
        if (!success) {
          showSnackbar('Erro ao excluir receita(s)!', 'error');
        }
        
        await loadData();
      } catch (error) {
        console.error('Erro ao excluir série:', error);
        showSnackbar('Erro ao excluir série!', 'error');
      }
    }
    
    setDeleteSeriesDialogOpen(false);
    setDeletingSeries(undefined);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Funções para Sprint 6
  const handleEditClick = (income: Income) => {
    setEditingIncome(income);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditingIncome(undefined);
  };

  const handleEditSave = async (formData: IncomeFormData) => {
    if (!editingIncome) return;
    
    const updatedIncome: Income = {
      ...editingIncome,
      categoryId: formData.categoryId,
      typeId: formData.typeId,
      value: formData.value,
      datePrevista: formData.datePrevista,
      dateEfetiva: formData.dateEfetiva,
      obs: formData.obs
    };
    
    try {
      await IncomesService.update(updatedIncome.id, updatedIncome);
      showSnackbar('Receita editada com sucesso!', 'success');
      handleEditClose();
      await loadData();
    } catch (error) {
      console.error('Erro ao editar receita:', error);
      showSnackbar('Erro ao editar receita!', 'error');
    }
  };

  const handleApproveClick = (income: Income) => {
    setApprovingIncome(income);
    setEffectiveDialogOpen(true);
  };

  const handleApproveClose = () => {
    setEffectiveDialogOpen(false);
    setApprovingIncome(undefined);
  };

  const handleApproveSave = async (effectiveData: { valueEffective: number; dateEffective: string; obs?: string }) => {
    if (!approvingIncome) return;
    
    try {
      // Atualizar apenas a data efetiva e observação (não o valor)
      await IncomesService.update(approvingIncome.id, {
        date_efetiva: effectiveData.dateEffective,
        obs: effectiveData.obs || approvingIncome.obs
      });
      
      showSnackbar('Receita aprovada com sucesso!', 'success');
      handleApproveClose();
      await loadData();
    } catch (error) {
      console.error('Erro ao aprovar receita:', error);
      showSnackbar('Erro ao aprovar receita!', 'error');
    }
  };

  const handleExportPDF = () => {
    try {
      const filteredIncomes = getFilteredIncomes();
      PDFExportService.exportIncomes(
        filteredIncomes,
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

  const isItemOpen = (income: Income): boolean => {
    return !income.dateEfetiva || income.dateEfetiva === '' || income.dateEfetiva === '-';
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const getTotalValue = () => {
    return getFilteredIncomes().reduce((total, income) => total + income.value, 0);
  };

  const filteredIncomes = getFilteredIncomes();
  const totalValue = getTotalValue();
  const availableMonths = getAvailableMonths();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Receitas
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            onClick={handleExportPDF}
            color="success"
          >
            Exportar PDF
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            color="success"
          >
            Adicionar Receita
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
        </Box>

        <Box mt={2}>
          <Typography variant="h6" color="success.main">
            Total: {formatBRL(totalValue)} ({filteredIncomes.length} receita{filteredIncomes.length !== 1 ? 's' : ''})
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
              <Typography variant="h6" color="success.main">
                {formatBRL(totalValue)}
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main">
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
                {filteredIncomes.length}
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
                {filteredIncomes.length > 0 ? formatBRL(totalValue / filteredIncomes.length) : formatBRL(0)}
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
              <Typography variant="h6" color="success.main">
                {filteredIncomes.length > 0 ? formatBRL(Math.max(...filteredIncomes.map(i => i.value))) : formatBRL(0)}
              </Typography>
            </Box>
            <Typography variant="h4" color="success.main">
              🔺
            </Typography>
          </Box>
        </Paper>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
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
            {filteredIncomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Nenhuma receita encontrada.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredIncomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell>
                    <Chip
                      label={getCategoryName(income.categoryId)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getTypeName(income.typeId)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} color="success.main">
                      {formatBRL(income.value)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDateBR(income.datePrevista)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {income.dateEfetiva ? (
                      <Typography variant="body2" color="success.main">
                        {formatDateBR(income.dateEfetiva)}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        -
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {income.obs || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      {isItemOpen(income) && (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(income)}
                            size="small"
                            aria-label="Editar receita"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => handleApproveClick(income)}
                            size="small"
                            aria-label="Aprovar receita"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </>
                      )}
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(income)}
                        size="small"
                        aria-label="Excluir receita"
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

      <IncomeDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveIncome}
        isEdit={false}
      />

      {/* Diálogo de Edição */}
      <IncomeDialog
        open={editDialogOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
        isEdit={true}
        income={editingIncome}
      />

      {/* Diálogo de Aprovação */}
      <EffectiveDialog
        open={effectiveDialogOpen}
        onClose={handleApproveClose}
        onSave={handleApproveSave}
        title="Aprovar Receita"
        amount={approvingIncome?.value || 0}
        description={approvingIncome?.obs || ''}
      />

      <ConfirmDialog
        open={confirmDialogOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir esta receita de ${formatBRL(deletingIncome?.value || 0)}?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialogOpen(false)}
      />

      {/* Diálogo para receitas mensais */}
      <Dialog open={deleteSeriesDialogOpen} onClose={() => setDeleteSeriesDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h6" color="error">
            Receita Mensal Detectada
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Esta receita faz parte de uma série mensal com {deletingSeries?.series.length} lançamentos.
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Valor:</strong> {formatBRL(deletingSeries?.income.value || 0)}
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
