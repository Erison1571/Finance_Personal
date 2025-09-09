-- Script para verificar valores atuais no Supabase
-- Execute este script no SQL Editor do Supabase

-- Verificar valores das despesas
SELECT 
    'Despesas' as tabela,
    COUNT(*) as total_registros,
    MIN(value) as menor_valor,
    MAX(value) as maior_valor,
    AVG(value) as media_valor,
    SUM(value) as total_valor
FROM expenses

UNION ALL

-- Verificar valores das receitas
SELECT 
    'Receitas' as tabela,
    COUNT(*) as total_registros,
    MIN(value) as menor_valor,
    MAX(value) as maior_valor,
    AVG(value) as media_valor,
    SUM(value) as total_valor
FROM incomes;

-- Verificar alguns exemplos específicos
SELECT 
    'Exemplos de Despesas' as info,
    id,
    value,
    value/100 as valor_em_reais,
    obs
FROM expenses 
ORDER BY value DESC 
LIMIT 5;
