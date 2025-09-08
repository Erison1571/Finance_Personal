import { format, isAfter, isEqual, isBefore, startOfDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export class DateUtil {
  
  /**
   * Verifica se uma data é hoje ou no futuro
   */
  static isTodayOrFuture(dateStr: string): boolean {
    const date = parseISO(dateStr);
    const today = startOfDay(new Date());
    return isAfter(date, today) || isEqual(date, today);
  }

  /**
   * Verifica se uma data é no passado
   */
  static isPast(dateStr: string): boolean {
    const date = parseISO(dateStr);
    const today = startOfDay(new Date());
    return isBefore(date, today);
  }

  /**
   * Verifica se uma data é hoje
   */
  static isToday(dateStr: string): boolean {
    const date = parseISO(dateStr);
    const today = startOfDay(new Date());
    return isEqual(date, today);
  }

  /**
   * Formata uma data para exibição em português
   */
  static formatDate(dateStr: string): string {
    const date = parseISO(dateStr);
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  }

  /**
   * Formata uma data para o formato YYYY-MM-DD
   */
  static formatDateISO(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  /**
   * Obtém a data de hoje no formato YYYY-MM-DD
   */
  static getTodayISO(): string {
    return this.formatDateISO(new Date());
  }

  /**
   * Obtém o primeiro dia do mês no formato YYYY-MM-DD
   */
  static getFirstDayOfMonth(year: number, month: number): string {
    const date = new Date(year, month - 1, 1);
    return this.formatDateISO(date);
  }

  /**
   * Obtém o último dia do mês no formato YYYY-MM-DD
   */
  static getLastDayOfMonth(year: number, month: number): string {
    const date = new Date(year, month, 0);
    return this.formatDateISO(date);
  }

  /**
   * Verifica se uma data está dentro de um mês específico
   */
  static isInMonth(dateStr: string, year: number, month: number): boolean {
    const date = parseISO(dateStr);
    return date.getFullYear() === year && date.getMonth() === month - 1;
  }
}
