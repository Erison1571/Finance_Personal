/**
 * Formata um valor em reais para Real brasileiro
 */
export function formatBRL(value: number): string {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00';
  }
  
  // Valores já estão em reais no Supabase (não precisa dividir por 100)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Converte um valor em reais para centavos
 */
export function reaisToCentavos(reais: number): number {
  return Math.round(reais * 100);
}

/**
 * Converte centavos para reais
 */
export function centavosToReais(centavos: number): number {
  return centavos / 100;
}

/**
 * Valida se um valor é um número válido para moeda
 */
export function isValidCurrency(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && isFinite(value) && value >= 0;
}
