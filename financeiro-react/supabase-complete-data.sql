-- Script COMPLETO para inserir dados no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. ADICIONAR COLUNA 'kind' NA TABELA 'types' (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'types' AND column_name = 'kind') THEN
        ALTER TABLE types ADD COLUMN kind TEXT;
    END IF;
END
$$;

-- 2. LIMPAR TODAS AS TABELAS (na ordem correta devido às foreign keys)
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM types;
DELETE FROM categories;

-- 3. INSERIR CATEGORIAS REAIS
INSERT INTO categories (id, name, color, kind, created_at, updated_at) VALUES 
('cat1', 'Cuidado e Saúde', '#f44336', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat2', 'Moradia', '#ff9800', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat3', 'Alimentação', '#4caf50', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat4', 'Transporte', '#2196f3', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat5', 'Educação', '#9c27b0', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat6', 'Lazer', '#e91e63', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat7', 'Salário', '#4caf50', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat8', 'Freelance', '#ff9800', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat9', 'Investimentos', '#2196f3', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat10', 'Outros', '#607d8b', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 4. INSERIR TIPOS REAIS (com coluna 'kind')
INSERT INTO types (id, name, category_id, kind, created_at, updated_at) VALUES 
('type1', 'Plano de Saúde', 'cat1', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type2', 'Medicamentos', 'cat1', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type3', 'Aluguel', 'cat2', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type4', 'Condomínio', 'cat2', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type5', 'Supermercado', 'cat3', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type6', 'Restaurante', 'cat3', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type7', 'Combustível', 'cat4', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type8', 'Manutenção', 'cat4', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type9', 'Curso', 'cat5', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type10', 'Livros', 'cat5', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type11', 'Cinema', 'cat6', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type12', 'Viagem', 'cat6', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type13', 'Salário Mensal', 'cat7', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type14', '13º Salário', 'cat7', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type15', 'Projetos', 'cat8', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type16', 'Consultoria', 'cat8', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type17', 'Dividendos', 'cat9', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type18', 'Juros', 'cat9', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type19', 'Bônus', 'cat10', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type20', 'Reembolso', 'cat10', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 5. INSERIR DESPESAS REAIS (valores em reais)
INSERT INTO expenses (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES 
('exp1', 'Despesa', 'cat1', 'type1', 450.00, '2025-09-01', '2025-09-01', 'Plano de saúde setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp2', 'Despesa', 'cat1', 'type2', 120.00, '2025-09-05', '2025-09-05', 'Medicamentos', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp3', 'Despesa', 'cat2', 'type3', 1200.00, '2025-09-01', '2025-09-01', 'Aluguel setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp4', 'Despesa', 'cat2', 'type4', 350.00, '2025-09-01', '2025-09-01', 'Condomínio setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp5', 'Despesa', 'cat3', 'type5', 600.00, '2025-09-10', '2025-09-10', 'Supermercado', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp6', 'Despesa', 'cat3', 'type6', 150.00, '2025-09-15', '2025-09-15', 'Jantar', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp7', 'Despesa', 'cat4', 'type7', 300.00, '2025-09-08', '2025-09-08', 'Combustível', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp8', 'Despesa', 'cat4', 'type8', 200.00, '2025-09-20', '2025-09-20', 'Manutenção carro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp9', 'Despesa', 'cat5', 'type9', 800.00, '2025-09-12', '2025-09-12', 'Curso online', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp10', 'Despesa', 'cat5', 'type10', 50.00, '2025-09-18', '2025-09-18', 'Livros', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp11', 'Despesa', 'cat6', 'type11', 80.00, '2025-09-25', '2025-09-25', 'Cinema', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp12', 'Despesa', 'cat6', 'type12', 2000.00, '2025-09-30', '2025-09-30', 'Viagem', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 6. INSERIR RECEITAS REAIS (valores em reais)
INSERT INTO incomes (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES 
('inc1', 'Receita', 'cat7', 'type13', 5000.00, '2025-09-01', '2025-09-01', 'Salário setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc2', 'Receita', 'cat8', 'type15', 1500.00, '2025-09-10', '2025-09-10', 'Projeto website', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc3', 'Receita', 'cat9', 'type17', 300.00, '2025-09-15', '2025-09-15', 'Dividendos ações', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc4', 'Receita', 'cat8', 'type16', 800.00, '2025-09-20', '2025-09-20', 'Consultoria', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc5', 'Receita', 'cat10', 'type19', 200.00, '2025-09-25', '2025-09-25', 'Bônus', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 7. VERIFICAR SE OS DADOS FORAM INSERIDOS
SELECT 'Categorias' as tabela, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Tipos' as tabela, COUNT(*) as total FROM types
UNION ALL
SELECT 'Despesas' as tabela, COUNT(*) as total FROM expenses
UNION ALL
SELECT 'Receitas' as tabela, COUNT(*) as total FROM incomes;
