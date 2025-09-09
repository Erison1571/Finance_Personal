-- Script ULTRA SEGURO para corrigir valores no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. PRIMEIRO: Verificar valores atuais
SELECT 'ANTES - Despesas' as status, 
       COUNT(*) as total, 
       MIN(value) as min_valor, 
       MAX(value) as max_valor, 
       AVG(value) as media_valor 
FROM expenses
UNION ALL
SELECT 'ANTES - Receitas' as status, 
       COUNT(*) as total, 
       MIN(value) as min_valor, 
       MAX(value) as max_valor, 
       AVG(value) as media_valor 
FROM incomes;

-- 2. SEGUNDO: Alterar a precisão da coluna 'value' para suportar centavos
ALTER TABLE expenses ALTER COLUMN value TYPE NUMERIC(12,2);
ALTER TABLE incomes ALTER COLUMN value TYPE NUMERIC(12,2);

-- 3. TERCEIRO: Converter apenas valores que estão em reais (menores que 1000)
-- (Valores já em centavos serão maiores que 1000)
UPDATE expenses 
SET value = value * 100 
WHERE value < 1000 AND value > 0;

UPDATE incomes 
SET value = value * 100 
WHERE value < 1000 AND value > 0;

-- 4. QUARTO: Verificar valores após conversão
SELECT 'DEPOIS - Despesas' as status, 
       COUNT(*) as total, 
       MIN(value) as min_valor, 
       MAX(value) as max_valor, 
       AVG(value) as media_valor 
FROM expenses
UNION ALL
SELECT 'DEPOIS - Receitas' as status, 
       COUNT(*) as total, 
       MIN(value) as min_valor, 
       MAX(value) as max_valor, 
       AVG(value) as media_valor 
FROM incomes;

-- 5. QUINTO: Verificar totais em reais
SELECT 'TOTAIS FINAIS' as info,
       'Despesas' as tipo,
       COUNT(*) as quantidade,
       SUM(value)/100 as total_reais
FROM expenses
UNION ALL
SELECT 'TOTAIS FINAIS' as info,
       'Receitas' as tipo,
       COUNT(*) as quantidade,
       SUM(value)/100 as total_reais
FROM incomes;
