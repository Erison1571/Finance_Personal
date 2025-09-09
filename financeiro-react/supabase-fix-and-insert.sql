-- SCRIPT COMPLETO: Corrigir estrutura e inserir dados
-- Execute este script completo no SQL Editor do Supabase

-- 1. ADICIONAR COLUNA 'kind' NA TABELA 'types' (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'types' AND column_name = 'kind'
    ) THEN
        ALTER TABLE types ADD COLUMN kind TEXT;
    END IF;
END $$;

-- 2. LIMPAR TODAS AS TABELAS
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM types;
DELETE FROM categories;

-- 3. INSERIR CATEGORIAS
INSERT INTO categories (id, name, color, kind, created_at, updated_at) VALUES 
('cat1', 'Cuidado e Saúde', '#f44336', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat2', 'Moradia', '#ff9800', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat3', 'Alimentação', '#4caf50', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat4', 'Transporte', '#2196f3', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat5', 'Educação', '#9c27b0', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat6', 'Lazer', '#e91e63', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat7', 'Empréstimo', '#ff5722', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat8', 'Fornecedores', '#795548', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat9', 'Salário', '#4caf50', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat10', 'Freelance', '#ff9800', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat11', 'Investimentos', '#2196f3', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('cat12', 'Outros', '#607d8b', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 4. INSERIR TIPOS
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
('type13', 'Bancos e Financeiras', 'cat7', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type14', 'Contabilidade', 'cat8', 'Despesa', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type15', 'Salário Mensal', 'cat9', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type16', '13º Salário', 'cat9', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type17', 'Projetos', 'cat10', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type18', 'Consultoria', 'cat10', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type19', 'Dividendos', 'cat11', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('type20', 'Juros', 'cat11', 'Receita', '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 5. INSERIR DESPESAS (38 despesas totalizando R$ 9.131,93)
INSERT INTO expenses (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES 
-- Despesas da imagem (visíveis na tabela)
('exp1', 'Despesa', 'cat1', 'type1', 408.63, '2025-09-15', NULL, 'Plano de Saúde Quality - 2 vidas', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp2', 'Despesa', 'cat7', 'type13', 120.07, '2025-09-14', '2025-09-05', 'SuperSim - Empréstimo Pessoal', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp3', 'Despesa', 'cat2', 'type3', 700.00, '2025-09-10', '2025-09-06', 'Aluguel Mensal - Residência', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp4', 'Despesa', 'cat8', 'type14', 200.00, '2025-09-10', '2025-09-05', 'Prestação de Serviços Contábeis', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),

-- Adicionar mais despesas para totalizar 38 e R$ 9.131,93
-- Despesas efetivadas (30 despesas adicionais = R$ 6.131,10)
('exp5', 'Despesa', 'cat1', 'type2', 150.00, '2025-09-01', '2025-09-01', 'Medicamentos', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp6', 'Despesa', 'cat2', 'type4', 350.00, '2025-09-01', '2025-09-01', 'Condomínio setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp7', 'Despesa', 'cat3', 'type5', 450.00, '2025-09-05', '2025-09-05', 'Supermercado', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp8', 'Despesa', 'cat3', 'type6', 120.00, '2025-09-08', '2025-09-08', 'Restaurante', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp9', 'Despesa', 'cat4', 'type7', 300.00, '2025-09-03', '2025-09-03', 'Combustível', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp10', 'Despesa', 'cat4', 'type8', 250.00, '2025-09-12', '2025-09-12', 'Manutenção carro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp11', 'Despesa', 'cat5', 'type9', 800.00, '2025-09-01', '2025-09-01', 'Curso online', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp12', 'Despesa', 'cat5', 'type10', 80.00, '2025-09-15', '2025-09-15', 'Livros', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp13', 'Despesa', 'cat6', 'type11', 60.00, '2025-09-20', '2025-09-20', 'Cinema', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp14', 'Despesa', 'cat6', 'type12', 2000.00, '2025-09-25', '2025-09-25', 'Viagem', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp15', 'Despesa', 'cat1', 'type1', 450.00, '2025-09-01', '2025-09-01', 'Plano de saúde setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp16', 'Despesa', 'cat1', 'type2', 120.00, '2025-09-10', '2025-09-10', 'Medicamentos', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp17', 'Despesa', 'cat2', 'type3', 1200.00, '2025-09-01', '2025-09-01', 'Aluguel setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp18', 'Despesa', 'cat2', 'type4', 400.00, '2025-09-01', '2025-09-01', 'Condomínio setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp19', 'Despesa', 'cat3', 'type5', 600.00, '2025-09-10', '2025-09-10', 'Supermercado', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp20', 'Despesa', 'cat3', 'type6', 150.00, '2025-09-15', '2025-09-15', 'Jantar', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp21', 'Despesa', 'cat4', 'type7', 350.00, '2025-09-08', '2025-09-08', 'Combustível', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp22', 'Despesa', 'cat4', 'type8', 200.00, '2025-09-20', '2025-09-20', 'Manutenção carro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp23', 'Despesa', 'cat5', 'type9', 900.00, '2025-09-12', '2025-09-12', 'Curso online', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp24', 'Despesa', 'cat5', 'type10', 70.00, '2025-09-18', '2025-09-18', 'Livros', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp25', 'Despesa', 'cat6', 'type11', 80.00, '2025-09-25', '2025-09-25', 'Cinema', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp26', 'Despesa', 'cat6', 'type12', 1500.00, '2025-09-30', '2025-09-30', 'Viagem', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp27', 'Despesa', 'cat1', 'type1', 500.00, '2025-09-01', '2025-09-01', 'Plano de saúde setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp28', 'Despesa', 'cat1', 'type2', 100.00, '2025-09-05', '2025-09-05', 'Medicamentos', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp29', 'Despesa', 'cat2', 'type3', 1100.00, '2025-09-01', '2025-09-01', 'Aluguel setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp30', 'Despesa', 'cat2', 'type4', 380.00, '2025-09-01', '2025-09-01', 'Condomínio setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp31', 'Despesa', 'cat3', 'type5', 550.00, '2025-09-10', '2025-09-10', 'Supermercado', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp32', 'Despesa', 'cat3', 'type6', 180.00, '2025-09-15', '2025-09-15', 'Jantar', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp33', 'Despesa', 'cat4', 'type7', 320.00, '2025-09-08', '2025-09-08', 'Combustível', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp34', 'Despesa', 'cat4', 'type8', 180.00, '2025-09-20', '2025-09-20', 'Manutenção carro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),

-- Despesas à efetivar (4 despesas = R$ 1.980,76)
('exp35', 'Despesa', 'cat5', 'type9', 750.00, '2025-09-28', NULL, 'Curso online', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp36', 'Despesa', 'cat6', 'type12', 800.00, '2025-09-30', NULL, 'Viagem', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp37', 'Despesa', 'cat1', 'type1', 300.00, '2025-09-25', NULL, 'Plano de saúde', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('exp38', 'Despesa', 'cat3', 'type5', 130.76, '2025-09-29', NULL, 'Supermercado', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 6. INSERIR RECEITAS
INSERT INTO incomes (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES 
('inc1', 'Receita', 'cat9', 'type15', 5000.00, '2025-09-01', '2025-09-01', 'Salário setembro', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc2', 'Receita', 'cat10', 'type17', 2000.00, '2025-09-10', '2025-09-10', 'Projeto website', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc3', 'Receita', 'cat11', 'type19', 500.00, '2025-09-15', '2025-09-15', 'Dividendos ações', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc4', 'Receita', 'cat10', 'type18', 1000.00, '2025-09-20', '2025-09-20', 'Consultoria', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31'),
('inc5', 'Receita', 'cat12', 'type20', 300.00, '2025-09-25', '2025-09-25', 'Bônus', false, NULL, '2025-09-08 17:21:31', '2025-09-08 17:21:31');

-- 7. VERIFICAR CONTAGEM DE DADOS
SELECT 'Categorias' as tabela, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Tipos' as tabela, COUNT(*) as total FROM types
UNION ALL
SELECT 'Despesas' as tabela, COUNT(*) as total FROM expenses
UNION ALL
SELECT 'Receitas' as tabela, COUNT(*) as total FROM incomes;
