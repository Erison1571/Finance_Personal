import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Expense, Income, Category, Type } from '../types';
import { formatBRL } from '../utils/currency.util';
import { formatDateBR, formatMonthYear } from '../utils/date.util';

export class PDFExportService {
  static exportExpenses(
    expenses: Expense[],
    categories: Category[],
    types: Type[],
    filters: {
      selectedCategory: string;
      selectedType: string;
      selectedMonth: string;
    }
  ) {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Despesas', 105, 20, { align: 'center' });
    
    // Filtros aplicados
    doc.setFontSize(12);
    let yPosition = 35;
    
    if (filters.selectedCategory !== 'all') {
      const category = categories.find(cat => cat.id === filters.selectedCategory);
      doc.text(`Categoria: ${category?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
    }
    
    if (filters.selectedType !== 'all') {
      const type = types.find(t => t.id === filters.selectedType);
      doc.text(`Tipo: ${type?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
    }
    
    if (filters.selectedMonth !== 'all') {
      doc.text(`Mês: ${formatMonthYear(filters.selectedMonth + '-01')}`, 20, yPosition);
      yPosition += 8;
    }
    
    // Resumo
    const totalValue = expenses.reduce((total, expense) => total + expense.value, 0);
    const openExpenses = expenses.filter(expense => !expense.dateEfetiva);
    const closedExpenses = expenses.filter(expense => expense.dateEfetiva);
    
    yPosition += 5;
    doc.setFontSize(14);
    doc.text('Resumo:', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.text(`Total: ${formatBRL(totalValue)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Quantidade: ${expenses.length}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Em aberto: ${openExpenses.length}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fechadas: ${closedExpenses.length}`, 20, yPosition);
    
    // Tabela de despesas
    const tableData = expenses.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      const type = types.find(t => t.id === expense.typeId);
      
      return [
        category?.name || 'N/A',
        type?.name || 'N/A',
        formatBRL(expense.value),
        formatDateBR(expense.datePrevista),
        expense.dateEfetiva ? formatDateBR(expense.dateEfetiva) : '-',
        expense.obs || '-'
      ];
    });
    
    autoTable(doc, {
      head: [['Categoria', 'Tipo', 'Valor', 'Data Prevista', 'Data Efetiva', 'Observação']],
      body: tableData,
      startY: yPosition + 10,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });
    
    // Rodapé
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, finalY + 10);
    
    // Salvar o PDF
    const fileName = `despesas_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
  
  static exportIncomes(
    incomes: Income[],
    categories: Category[],
    types: Type[],
    filters: {
      selectedCategory: string;
      selectedType: string;
      selectedMonth: string;
    }
  ) {
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.text('Relatório de Receitas', 105, 20, { align: 'center' });
    
    // Filtros aplicados
    doc.setFontSize(12);
    let yPosition = 35;
    
    if (filters.selectedCategory !== 'all') {
      const category = categories.find(cat => cat.id === filters.selectedCategory);
      doc.text(`Categoria: ${category?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
    }
    
    if (filters.selectedType !== 'all') {
      const type = types.find(t => t.id === filters.selectedType);
      doc.text(`Tipo: ${type?.name || 'N/A'}`, 20, yPosition);
      yPosition += 8;
    }
    
    if (filters.selectedMonth !== 'all') {
      doc.text(`Mês: ${formatMonthYear(filters.selectedMonth + '-01')}`, 20, yPosition);
      yPosition += 8;
    }
    
    // Resumo
    const totalValue = incomes.reduce((total, income) => total + income.value, 0);
    const openIncomes = incomes.filter(income => !income.dateEfetiva);
    const closedIncomes = incomes.filter(income => income.dateEfetiva);
    
    yPosition += 5;
    doc.setFontSize(14);
    doc.text('Resumo:', 20, yPosition);
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.text(`Total: ${formatBRL(totalValue)}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Quantidade: ${incomes.length}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Em aberto: ${openIncomes.length}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Fechadas: ${closedIncomes.length}`, 20, yPosition);
    
    // Tabela de receitas
    const tableData = incomes.map(income => {
      const category = categories.find(cat => cat.id === income.categoryId);
      const type = types.find(t => t.id === income.typeId);
      
      return [
        category?.name || 'N/A',
        type?.name || 'N/A',
        formatBRL(income.value),
        formatDateBR(income.datePrevista),
        income.dateEfetiva ? formatDateBR(income.dateEfetiva) : '-',
        income.obs || '-'
      ];
    });
    
    autoTable(doc, {
      head: [['Categoria', 'Tipo', 'Valor', 'Data Prevista', 'Data Efetiva', 'Observação']],
      body: tableData,
      startY: yPosition + 10,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [40, 167, 69],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250]
      }
    });
    
    // Rodapé
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 20, finalY + 10);
    
    // Salvar o PDF
    const fileName = `receitas_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }
}
