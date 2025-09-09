-- Script para corrigir valores no Supabase (converter para centavos)
-- Execute este script no SQL Editor do Supabase

-- 1. ATUALIZAR VALORES DAS DESPESAS (multiplicar por 100 para converter reais em centavos)
UPDATE expenses SET value = value * 100;

-- 2. ATUALIZAR VALORES DAS RECEITAS (multiplicar por 100 para converter reais em centavos)
UPDATE incomes SET value = value * 100;

-- 3. VERIFICAR SE OS VALORES FORAM ATUALIZADOS CORRETAMENTE
SELECT 'Despesas' as tabela, COUNT(*) as total, SUM(value) as total_centavos, SUM(value)/100 as total_reais FROM expenses
UNION ALL
SELECT 'Receitas' as tabela, COUNT(*) as total, SUM(value) as total_centavos, SUM(value)/100 as total_reais FROM incomes;
