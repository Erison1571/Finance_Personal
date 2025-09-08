/**
 * Adiciona n meses a uma data, preservando o dia
 * Se o dia não existir no mês alvo, usa o último dia do mês
 */
export function addMeses(dateStr: string, n: number): string {
  const date = new Date(dateStr);
  
  // Adiciona n meses
  date.setMonth(date.getMonth() + n);
  
  // Preserva o dia original
  const originalDay = new Date(dateStr).getDate();
  const maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  
  // Se o dia original não existir no mês alvo, usa o último dia
  const finalDay = Math.min(originalDay, maxDay);
  date.setDate(finalDay);
  
  // Formata para YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Formata uma data YYYY-MM-DD para DD/MM/YYYY
 */
export function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Formata uma data YYYY-MM-DD para Mês/Ano (MM/YYYY)
 */
export function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const monthNames = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];
  return `${monthNames[parseInt(month) - 1]}/${year}`;
}

/**
 * Obtém o primeiro dia do mês para uma data YYYY-MM-DD
 */
export function getFirstDayOfMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  return `${year}-${month}-01`;
}

/**
 * Obtém o último dia do mês para uma data YYYY-MM-DD
 */
export function getLastDayOfMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const date = new Date(parseInt(year), parseInt(month), 0);
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Valida se uma string é uma data válida no formato YYYY-MM-DD
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime()) && !!dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
}
