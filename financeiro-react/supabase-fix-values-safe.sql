-- Script SEGURO para corrigir valores no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. PRIMEIRO: Alterar a precisão da coluna 'value' para suportar centavos
-- (Permitir até 12 dígitos totais com 2 decimais = até 999.999.999.999,99)
ALTER TABLE expenses ALTER COLUMN value TYPE NUMERIC(12,2);
ALTER TABLE incomes ALTER COLUMN value TYPE NUMERIC(12,2);

-- 2. SEGUNDO: Converter valores existentes de reais para centavos
-- (Multiplicar por 100 apenas se o valor for menor que 1000 para evitar overflow)
UPDATE expenses 
SET value = value * 100 
WHERE value < 1000;

UPDATE incomes 
SET value = value * 100 
WHERE value < 1000;

-- 3. VERIFICAR SE OS VALORES FORAM ATUALIZADOS CORRETAMENTE
SELECT 'Despesas' as tabela, 
       COUNT(*) as total, 
       SUM(value) as total_centavos, 
       SUM(value)/100 as total_reais 
FROM expenses
UNION ALL
SELECT 'Receitas' as tabela, 
       COUNT(*) as total, 
       SUM(value) as total_centavos, 
       SUM(value)/100 as total_reais 
FROM incomes;
