-- Script de limpeza e inserção completa para Supabase
-- Execute este script no SQL Editor do Supabase

-- Limpar todas as tabelas (na ordem correta devido às foreign keys)
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM types;
DELETE FROM categories;

-- Inserir categorias
INSERT INTO categories (id, name, color, kind, created_at, updated_at) VALUES 
('cat1', 'Moradia', '#f44336', 'Despesa', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat2', 'Alimentação', '#ff9800', 'Despesa', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat3', 'Transporte', '#2196f3', 'Despesa', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat4', 'Saúde', '#4caf50', 'Despesa', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat5', 'Lazer', '#9c27b0', 'Despesa', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat6', 'Salário', '#4caf50', 'Receita', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat7', 'Freelance', '#ff9800', 'Receita', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat8', 'Investimentos', '#2196f3', 'Receita', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat9', 'Vendas', '#9c27b0', 'Receita', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('cat10', 'Outros', '#607d8b', 'Receita', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z');

-- Inserir tipos
INSERT INTO types (id, name, category_id, created_at, updated_at) VALUES 
('type1', 'Aluguel', 'cat1', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type2', 'Condomínio', 'cat1', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type3', 'Supermercado', 'cat2', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type4', 'Restaurante', 'cat2', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type5', 'Combustível', 'cat3', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type6', 'Uber/Taxi', 'cat3', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type7', 'Farmácia', 'cat4', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type8', 'Médico', 'cat4', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type9', 'Cinema', 'cat5', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type10', 'Viagem', 'cat5', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type11', 'Salário Fixo', 'cat6', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type12', 'Salário Variável', 'cat6', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type13', 'Projetos', 'cat7', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type14', 'Consultoria', 'cat7', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type15', 'Dividendos', 'cat8', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type16', 'Juros', 'cat8', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type17', 'Venda Online', 'cat9', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type18', 'Venda Física', 'cat9', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type19', 'Bônus', 'cat10', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('type20', 'Reembolso', 'cat10', '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z');

-- Inserir despesas (exemplos dos seus dados)
INSERT INTO expenses (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES 
('exp1', 'Despesa', 'cat1', 'type1', 1200.00, '2025-09-01', '2025-09-01', 'Aluguel setembro', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('exp2', 'Despesa', 'cat1', 'type2', 350.00, '2025-09-01', '2025-09-01', 'Condomínio setembro', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('exp3', 'Despesa', 'cat2', 'type3', 450.00, '2025-09-05', '2025-09-05', 'Compras do mês', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('exp4', 'Despesa', 'cat3', 'type5', 200.00, '2025-09-10', '2025-09-10', 'Combustível', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('exp5', 'Despesa', 'cat4', 'type7', 80.00, '2025-09-15', '2025-09-15', 'Medicamentos', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z');

-- Inserir receitas (exemplos dos seus dados)
INSERT INTO incomes (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES 
('inc1', 'Receita', 'cat6', 'type11', 5000.00, '2025-09-01', '2025-09-01', 'Salário setembro', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('inc2', 'Receita', 'cat7', 'type13', 1500.00, '2025-09-10', '2025-09-10', 'Projeto website', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('inc3', 'Receita', 'cat8', 'type15', 300.00, '2025-09-15', '2025-09-15', 'Dividendos ações', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('inc4', 'Receita', 'cat7', 'type14', 800.00, '2025-09-20', '2025-09-20', 'Consultoria', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z'),
('inc5', 'Receita', 'cat9', 'type17', 200.00, '2025-09-25', '2025-09-25', 'Venda de item usado', false, NULL, '2025-09-08T18:00:00.000Z', '2025-09-08T18:00:00.000Z');

-- Verificar se os dados foram inseridos
SELECT 'Categorias' as tabela, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Tipos' as tabela, COUNT(*) as total FROM types
UNION ALL
SELECT 'Despesas' as tabela, COUNT(*) as total FROM expenses
UNION ALL
SELECT 'Receitas' as tabela, COUNT(*) as total FROM incomes;
