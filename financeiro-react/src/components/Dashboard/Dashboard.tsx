import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Alert,
  IconButton
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { Expense, Income } from '../../types';
import { SupabaseCategoriesService as CategoriesService } from '../../services/supabase/categoriesService';
import { SupabaseTypesService as TypesService } from '../../services/supabase/typesService';
import { SupabaseExpensesService as ExpensesService } from '../../services/supabase/expensesService';
import { SupabaseIncomesService as IncomesService } from '../../services/supabase/incomesService';
import { formatBRL } from '../../utils/currency.util';
import { formatMonthYear, formatDateBR } from '../../utils/date.util';
import { EffectiveDialog } from '../Common/EffectiveDialog';

interface DashboardItem {
  id: string;
  type: 'expense' | 'income';
  description: string;
  amount: number;
  categoryName: string;
  typeName: string;
  dateExpected: string;
  dateEffective?: string;
  isOverdue: boolean;
  isPending: boolean;
  isEffective: boolean;
  item: Expense | Income;
}

interface DashboardData {
  receitasPrevistas: number;
  receitasExecutadas: number;
  diferencaReceitas: number;
  despesasPrevistas: number;
  despesasExecutadas: number;
  diferencaDespesas: number;
  saldoPrevisto: number;
  saldoEfetivo: number;
  diferencaSaldo: number;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    receitasPrevistas: 0,
    receitasExecutadas: 0,
    diferencaReceitas: 0,
    despesasPrevistas: 0,
    despesasExecutadas: 0,
    diferencaDespesas: 0,
    saldoPrevisto: 0,
    saldoEfetivo: 0,
    diferencaSaldo: 0
  });
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [openItems, setOpenItems] = useState<DashboardItem[]>([]);
  const [expenseCategoriesData, setExpenseCategoriesData] = useState<ChartData[]>([]);
  const [effectiveDialogOpen, setEffectiveDialogOpen] = useState(false);
  const [approvingItem, setApprovingItem] = useState<{ item: DashboardItem; type: 'expense' | 'income' } | null>(null);

  const COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#f57c00', '#9c27b0'];

  useEffect(() => {
    const loadAllData = async () => {
      await loadDashboardData();
      await loadAvailableMonths();
      await loadOpenItems();
      await loadExpenseCategoriesData();
    };
    loadAllData();
  }, [selectedMonth]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await loadDashboardData();
      await loadOpenItems();
      await loadExpenseCategoriesData();
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedMonth]);

    
  const loadDashboardData = async () => {
    try {
      const expenses = await ExpensesService.getAll();
      const incomes = await IncomesService.getAll();
      
      const [year, month] = selectedMonth.split('-').map(Number);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.datePrevista);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
      });
      
      const monthIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.datePrevista);
        return incomeDate.getFullYear() === year && incomeDate.getMonth() + 1 === month;
      });

      const receitasPrevistas = monthIncomes.reduce((sum, income) => sum + income.value, 0);
      const receitasExecutadas = monthIncomes
        .filter(income => income.dateEfetiva)
        .reduce((sum, income) => sum + income.value, 0);
      
      const despesasPrevistas = monthExpenses.reduce((sum, expense) => sum + expense.value, 0);
      const despesasExecutadas = monthExpenses
        .filter(expense => expense.dateEfetiva)
        .reduce((sum, expense) => sum + expense.value, 0);

      const diferencaReceitas = receitasPrevistas - receitasExecutadas;
    const diferencaDespesas = despesasPrevistas - despesasExecutadas;
    const saldoPrevisto = receitasPrevistas - despesasPrevistas;
    const saldoEfetivo = receitasExecutadas - despesasExecutadas;
    const diferencaSaldo = diferencaReceitas - diferencaDespesas;
    
    setDashboardData({
      receitasPrevistas,
      receitasExecutadas,
      diferencaReceitas,
      despesasPrevistas,
      despesasExecutadas,
      diferencaDespesas,
      saldoPrevisto,
      saldoEfetivo,
      diferencaSaldo
    });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const loadAvailableMonths = async () => {
    try {
      const expenses = await ExpensesService.getAll();
      const incomes = await IncomesService.getAll();
      const allItems = [...expenses, ...incomes];
    
      const months = new Set<string>();
      allItems.forEach(item => {
        const date = new Date(item.datePrevista);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthKey);
      });
      
      setAvailableMonths(Array.from(months).sort().reverse());
    } catch (error) {
      console.error('Erro ao carregar meses disponíveis:', error);
    }
  };

  const loadOpenItems = async () => {
    try {
      const expenses = await ExpensesService.getAll();
      const incomes = await IncomesService.getAll();
      const categories = await CategoriesService.getAll();
      const types = await TypesService.getAll();
    
      const [year, month] = selectedMonth.split('-').map(Number);
      const currentDate = new Date();
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.datePrevista);
        return expenseDate.getFullYear() === year && expenseDate.getMonth() + 1 === month;
      });
      
      const monthIncomes = incomes.filter(income => {
        const incomeDate = new Date(income.datePrevista);
        return incomeDate.getFullYear() === year && incomeDate.getMonth() + 1 === month;
      });

      const allExpenses: DashboardItem[] = monthExpenses.map(expense => {
        const category = categories.find(c => c.id === expense.categoryId);
        const type = types.find(t => t.id === expense.typeId);
        const expectedDate = new Date(expense.datePrevista);
        const isOverdue = !expense.dateEfetiva && expectedDate < currentDate;
        const isPending = !expense.dateEfetiva;
        const isEffective = !!expense.dateEfetiva && expense.dateEfetiva !== '';

        return {
        id: expense.id,
        type: 'expense',
        description: expense.obs || `${category?.name || 'Categoria'} - ${type?.name || 'Tipo'}`,
        amount: expense.value,
        categoryName: category?.name || 'N/A',
        typeName: type?.name || 'N/A',
        dateExpected: expense.datePrevista,
        dateEffective: expense.dateEfetiva,
        isOverdue,
        isPending,
        isEffective,
        item: expense
      };
    });

    const allIncomes: DashboardItem[] = monthIncomes.map(income => {
      const category = categories.find(c => c.id === income.categoryId);
      const type = types.find(t => t.id === income.typeId);
      const expectedDate = new Date(income.datePrevista);
      const isOverdue = !income.dateEfetiva && expectedDate < currentDate;
      const isPending = !income.dateEfetiva;
      const isEffective = !!income.dateEfetiva && income.dateEfetiva !== '';

      return {
        id: income.id,
        type: 'income',
        description: income.obs || `${category?.name || 'Categoria'} - ${type?.name || 'Tipo'}`,
        amount: income.value,
        categoryName: category?.name || 'N/A',
        typeName: type?.name || 'N/A',
        dateExpected: income.datePrevista,
        dateEffective: income.dateEfetiva,
        isOverdue,
        isPending,
        isEffective,
        item: income
      };
    });

      setOpenItems([...allExpenses, ...allIncomes].sort((a, b) => 
        new Date(a.dateExpected).getTime() - new Date(b.dateExpected).getTime()
      ));
    } catch (error) {
      console.error('Erro ao carregar itens em aberto:', error);
    }
  };

  const loadExpenseCategoriesData = async () => {
    try {
      const expenses = await ExpensesService.getAll();
      const categories = await CategoriesService.getAll();
    
      const [year, month] = selectedMonth.split('-').map(Number);
      
      const monthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.datePrevista);
        return expenseDate.getFullYear() === year && 
               expenseDate.getMonth() + 1 === month && 
               expense.dateEfetiva;
      });

      // Dados por categoria
      const categoryMap = new Map<string, number>();
      monthExpenses.forEach(expense => {
        const category = categories.find(c => c.id === expense.categoryId);
        if (category) {
          const existing = categoryMap.get(category.name) || 0;
          categoryMap.set(category.name, existing + expense.value);
      }
    });

      const categoriesData: ChartData[] = Array.from(categoryMap.entries())
        .map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length]
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      setExpenseCategoriesData(categoriesData);
    } catch (error) {
      console.error('Erro ao carregar dados de categorias:', error);
    }
  };

  const handleMonthChange = (event: any) => {
    setSelectedMonth(event.target.value);
  };


  const handleRefresh = async () => {
    await loadDashboardData();
    await loadOpenItems();
    await loadExpenseCategoriesData();
  };

  const handleApproveClick = (item: DashboardItem) => {
    setApprovingItem({ item, type: item.type });
    setEffectiveDialogOpen(true);
  };

  const handleApproveClose = () => {
    setEffectiveDialogOpen(false);
    setApprovingItem(null);
  };

  const handleApproveSave = async (data: { valueEffective: number; dateEffective: string; obs?: string }) => {
    if (approvingItem) {
      if (approvingItem.type === 'expense') {
        await ExpensesService.update(approvingItem.item.id, {
          ...approvingItem.item.item as Expense,
          dateEfetiva: data.dateEffective,
          obs: data.obs || approvingItem.item.item.obs
        });
      } else {
        await IncomesService.update(approvingItem.item.id, {
          ...approvingItem.item.item as Income,
          dateEfetiva: data.dateEffective,
          obs: data.obs || approvingItem.item.item.obs
        });
      }
      
      await loadDashboardData();
      await loadOpenItems();
      await loadExpenseCategoriesData();
    }
    handleApproveClose();
  };

  const handleEditClick = (item: DashboardItem) => {
    // Implementar edição
    console.log('Edit item:', item);
  };

  const handleDeleteClick = async (item: DashboardItem) => {
    if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
      try {
        if (item.type === 'expense') {
          await ExpensesService.delete(item.id);
        } else {
          await IncomesService.delete(item.id);
        }
        
        await loadDashboardData();
        await loadOpenItems();
        await loadExpenseCategoriesData();
      } catch (error) {
        console.error('Erro ao excluir lançamento:', error);
      }
    }
  };


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">
            Dashboard
          </Typography>

      {/* Filtro de Mês */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Selecionar Mês</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            label="Selecionar Mês"
          >
            {availableMonths.map(month => (
              <MenuItem key={month} value={month}>
                {formatMonthYear(month)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Receitas e Despesas lado a lado */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
        {/* Card 1: Receitas */}
        <Paper sx={{ flex: '1 1 500px', minWidth: '500px', p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
            📈 RECEITAS
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <TrendingUpIcon color="primary" sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="body2">Previstas</Typography>
                  </Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {formatBRL(dashboardData.receitasPrevistas)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <TrendingUpIcon color="success" sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="body2">Efetivadas</Typography>
                  </Box>
                  <Typography variant="h6" color="success.main" gutterBottom>
                    {formatBRL(dashboardData.receitasExecutadas)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <AccountBalanceIcon sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="body2">Diferença</Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    color={dashboardData.diferencaReceitas >= 0 ? 'warning.main' : 'error.main'}
                    gutterBottom
                  >
                    {formatBRL(dashboardData.diferencaReceitas)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>

        {/* Card 2: Despesas */}
        <Paper sx={{ flex: '1 1 500px', minWidth: '500px', p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'error.main' }}>
            📉 DESPESAS
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <TrendingDownIcon color="error" sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="body2">Previstas</Typography>
                  </Box>
                  <Typography variant="h6" color="error" gutterBottom>
                    {formatBRL(dashboardData.despesasPrevistas)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <TrendingDownIcon color="warning" sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="body2">Efetivadas</Typography>
                  </Box>
                  <Typography variant="h6" color="warning.main" gutterBottom>
                    {formatBRL(dashboardData.despesasExecutadas)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <AccountBalanceIcon sx={{ fontSize: 24, mr: 1 }} />
                    <Typography variant="body2">Diferença</Typography>
                  </Box>
                  <Typography 
                    variant="h6" 
                    color={dashboardData.diferencaDespesas >= 0 ? 'warning.main' : 'error.main'}
                    gutterBottom
                  >
                    {formatBRL(dashboardData.diferencaDespesas)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Card 3: Saldos */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 3, color: 'info.main' }}>
          💰 SALDOS
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <AccountBalanceIcon color="info" sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Saldo Previsto</Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  color={dashboardData.saldoPrevisto >= 0 ? 'success.main' : 'error.main'}
                  gutterBottom
                >
                  {formatBRL(dashboardData.saldoPrevisto)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receita Prevista - Despesa Prevista
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <AccountBalanceIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Saldo Efetivo</Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  color={dashboardData.saldoEfetivo >= 0 ? 'success.main' : 'error.main'}
                  gutterBottom
                >
                  {formatBRL(dashboardData.saldoEfetivo)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Receita Efetiva - Despesa Efetiva
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <AccountBalanceIcon sx={{ fontSize: 32, mr: 1 }} />
                  <Typography variant="h6">Diferença</Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  color={dashboardData.diferencaSaldo >= 0 ? 'success.main' : 'error.main'}
                  gutterBottom
                >
                  {formatBRL(dashboardData.diferencaSaldo)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Diferença Receita - Diferença Despesa
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Paper>

      {/* Gráfico das 5 Maiores Categorias de Despesas */}
      {expenseCategoriesData.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2, color: 'primary.main' }}>
            📊 TOP 5 CATEGORIAS DE DESPESAS
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                <Typography variant="h6" gutterBottom>
                  Gráfico de Barras
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseCategoriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatBRL(value)} />
                    <Bar dataKey="value" fill="#1976d2" />
                  </BarChart>
                </ResponsiveContainer>
            </Box>

              <Box sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                <Typography variant="h6" gutterBottom>
                  Gráfico de Pizza
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatBRL(value)} />
                  </PieChart>
                </ResponsiveContainer>
            </Box>
          </Box>
          </Paper>
        </Box>
      )}

      {/* Lançamentos Pendentes - Receitas e Despesas lado a lado */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap' }}>
        {/* Coluna 1: Receitas Pendentes */}
        <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" color="primary.main">
                  📈 RECEITAS PENDENTES
          </Typography>
                <Typography variant="body2" color="text.secondary">
                  {openItems.filter(item => item.type === 'income' && !item.isEffective).length} lançamentos pendentes
                </Typography>
            </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                size="small"
              >
                Atualizar
              </Button>
            </Box>

            {openItems.filter(item => item.type === 'income' && !item.isEffective).length === 0 ? (
              <Alert severity="info">
                Nenhuma receita pendente para o mês selecionado.
              </Alert>
            ) : (
            <TableContainer>
              <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoria</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data Prevista</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {openItems
                      .filter(item => item.type === 'income' && !item.isEffective)
                      .sort((a, b) => {
                        // Ordenar por Categoria (crescente), depois Tipo (crescente), depois Valor (crescente)
                        if (a.categoryName !== b.categoryName) {
                          return a.categoryName.localeCompare(b.categoryName);
                        }
                        if (a.typeName !== b.typeName) {
                          return a.typeName.localeCompare(b.typeName);
                        }
                        return a.amount - b.amount;
                      })
                      .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>{item.typeName}</TableCell>
                        <TableCell>{formatBRL(item.amount)}</TableCell>
                        <TableCell>{formatDateBR(item.dateExpected)}</TableCell>
                        <TableCell>
                          {item.isOverdue && (
                            <Chip label="ATRASADO" color="error" size="small" sx={{ mr: 1 }} />
                          )}
                          {item.isPending && !item.isOverdue && (
                            <Chip label="PENDENTE" color="warning" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(item)}
                            size="small"
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => handleApproveClick(item)}
                            size="small"
                            title="Aprovar"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(item)}
                            size="small"
                            title="Excluir"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </Paper>
        </Box>

        {/* Coluna 2: Despesas Pendentes */}
        <Box sx={{ flex: '1 1 500px', minWidth: '500px' }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h6" color="error.main">
                  📉 DESPESAS PENDENTES
            </Typography>
                <Typography variant="body2" color="text.secondary">
                  {openItems.filter(item => item.type === 'expense' && !item.isEffective).length} lançamentos pendentes
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                size="small"
              >
                Atualizar
              </Button>
            </Box>

            {openItems.filter(item => item.type === 'expense' && !item.isEffective).length === 0 ? (
              <Alert severity="info">
                Nenhuma despesa pendente para o mês selecionado.
              </Alert>
            ) : (
            <TableContainer>
              <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Categoria</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Data Prevista</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {openItems
                      .filter(item => item.type === 'expense' && !item.isEffective)
                      .sort((a, b) => {
                        // Ordenar por Categoria (crescente), depois Tipo (crescente), depois Valor (crescente)
                        if (a.categoryName !== b.categoryName) {
                          return a.categoryName.localeCompare(b.categoryName);
                        }
                        if (a.typeName !== b.typeName) {
                          return a.typeName.localeCompare(b.typeName);
                        }
                        return a.amount - b.amount;
                      })
                      .map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell>{item.typeName}</TableCell>
                        <TableCell>{formatBRL(item.amount)}</TableCell>
                        <TableCell>{formatDateBR(item.dateExpected)}</TableCell>
                        <TableCell>
                          {item.isOverdue && (
                            <Chip label="ATRASADO" color="error" size="small" sx={{ mr: 1 }} />
                          )}
                          {item.isPending && !item.isOverdue && (
                            <Chip label="PENDENTE" color="warning" size="small" />
                          )}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(item)}
                            size="small"
                            title="Editar"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="success"
                            onClick={() => handleApproveClick(item)}
                            size="small"
                            title="Aprovar"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(item)}
                            size="small"
                            title="Excluir"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>

      {/* Diálogo de Aprovação */}
      <EffectiveDialog
        open={effectiveDialogOpen}
        onClose={handleApproveClose}
        onSave={handleApproveSave}
        title={approvingItem ? `Aprovar ${approvingItem.type === 'expense' ? 'Despesa' : 'Receita'}` : 'Aprovar Lançamento'}
        amount={approvingItem?.item.amount || 0}
        description={approvingItem?.item.description || ''}
      />
    </Box>
  );
};