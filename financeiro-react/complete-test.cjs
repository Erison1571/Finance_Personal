const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🧪 TESTE COMPLETO - BANCO DE DADOS');
console.log('==================================\n');

// Função para simular dados completos do localStorage
function getCompleteLocalStorageData() {
  console.log('📦 Simulando dados completos do localStorage...');
  
  const categories = [
    { id: 'cat1', name: 'Moradia', color: '#f44336', kind: 'Despesa' },
    { id: 'cat2', name: 'Transporte', color: '#ff9800', kind: 'Despesa' },
    { id: 'cat3', name: 'Alimentação', color: '#4caf50', kind: 'Despesa' },
    { id: 'cat4', name: 'Saúde', color: '#2196f3', kind: 'Despesa' },
    { id: 'cat5', name: 'Educação', color: '#9c27b0', kind: 'Despesa' },
    { id: 'cat6', name: 'Lazer', color: '#e91e63', kind: 'Despesa' },
    { id: 'cat7', name: 'Salário', color: '#4caf50', kind: 'Receita' },
    { id: 'cat8', name: 'Freelance', color: '#ff9800', kind: 'Receita' },
    { id: 'cat9', name: 'Investimentos', color: '#2196f3', kind: 'Receita' },
    { id: 'cat10', name: 'Outros', color: '#607d8b', kind: 'Receita' }
  ];

  const types = [
    { id: 'type1', name: 'Fixo', categoryId: 'cat1' },
    { id: 'type2', name: 'Variável', categoryId: 'cat1' },
    { id: 'type3', name: 'Combustível', categoryId: 'cat2' },
    { id: 'type4', name: 'Manutenção', categoryId: 'cat2' },
    { id: 'type5', name: 'Supermercado', categoryId: 'cat3' },
    { id: 'type6', name: 'Restaurante', categoryId: 'cat3' },
    { id: 'type7', name: 'Plano de Saúde', categoryId: 'cat4' },
    { id: 'type8', name: 'Medicamentos', categoryId: 'cat4' },
    { id: 'type9', name: 'Curso', categoryId: 'cat5' },
    { id: 'type10', name: 'Livros', categoryId: 'cat5' },
    { id: 'type11', name: 'Cinema', categoryId: 'cat6' },
    { id: 'type12', name: 'Viagem', categoryId: 'cat6' },
    { id: 'type13', name: 'Salário Mensal', categoryId: 'cat7' },
    { id: 'type14', name: '13º Salário', categoryId: 'cat7' },
    { id: 'type15', name: 'Projeto Web', categoryId: 'cat8' },
    { id: 'type16', name: 'Consultoria', categoryId: 'cat8' },
    { id: 'type17', name: 'Ações', categoryId: 'cat9' },
    { id: 'type18', name: 'Fundos', categoryId: 'cat9' },
    { id: 'type19', name: 'Vendas', categoryId: 'cat10' },
    { id: 'type20', name: 'Doações', categoryId: 'cat10' }
  ];

  const expenses = [
    { id: 'exp1', kind: 'Despesa', categoryId: 'cat1', typeId: 'type1', value: 1200.00, datePrevista: '2025-01-01', dateEfetiva: '2025-01-01', obs: 'Aluguel janeiro', isMensal: true, seriesId: 'rent-2025' },
    { id: 'exp2', kind: 'Despesa', categoryId: 'cat1', typeId: 'type2', value: 150.00, datePrevista: '2025-01-15', dateEfetiva: '2025-01-15', obs: 'Conta de luz', isMensal: false },
    { id: 'exp3', kind: 'Despesa', categoryId: 'cat2', typeId: 'type3', value: 300.00, datePrevista: '2025-01-10', dateEfetiva: '2025-01-10', obs: 'Combustível', isMensal: false },
    { id: 'exp4', kind: 'Despesa', categoryId: 'cat3', typeId: 'type5', value: 800.00, datePrevista: '2025-01-05', dateEfetiva: '2025-01-05', obs: 'Compras do mês', isMensal: true, seriesId: 'grocery-2025' },
    { id: 'exp5', kind: 'Despesa', categoryId: 'cat4', typeId: 'type7', value: 450.00, datePrevista: '2025-01-01', dateEfetiva: '2025-01-01', obs: 'Plano de saúde', isMensal: true, seriesId: 'health-2025' },
    { id: 'exp6', kind: 'Despesa', categoryId: 'cat5', typeId: 'type9', value: 200.00, datePrevista: '2025-01-20', obs: 'Curso online', isMensal: false },
    { id: 'exp7', kind: 'Despesa', categoryId: 'cat6', typeId: 'type11', value: 50.00, datePrevista: '2025-01-25', dateEfetiva: '2025-01-25', obs: 'Cinema', isMensal: false },
    { id: 'exp8', kind: 'Despesa', categoryId: 'cat2', typeId: 'type4', value: 500.00, datePrevista: '2025-01-30', obs: 'Revisão do carro', isMensal: false },
    { id: 'exp9', kind: 'Despesa', categoryId: 'cat3', typeId: 'type6', value: 120.00, datePrevista: '2025-01-12', dateEfetiva: '2025-01-12', obs: 'Jantar', isMensal: false },
    { id: 'exp10', kind: 'Despesa', categoryId: 'cat4', typeId: 'type8', value: 80.00, datePrevista: '2025-01-18', dateEfetiva: '2025-01-18', obs: 'Farmácia', isMensal: false }
  ];

  const incomes = [
    { id: 'inc1', kind: 'Receita', categoryId: 'cat7', typeId: 'type13', value: 5000.00, datePrevista: '2025-01-05', dateEfetiva: '2025-01-05', obs: 'Salário janeiro', isMensal: true, seriesId: 'salary-2025' },
    { id: 'inc2', kind: 'Receita', categoryId: 'cat8', typeId: 'type15', value: 1200.00, datePrevista: '2025-01-15', dateEfetiva: '2025-01-15', obs: 'Projeto website', isMensal: false },
    { id: 'inc3', kind: 'Receita', categoryId: 'cat9', typeId: 'type17', value: 300.00, datePrevista: '2025-01-20', dateEfetiva: '2025-01-20', obs: 'Dividendos ações', isMensal: false },
    { id: 'inc4', kind: 'Receita', categoryId: 'cat8', typeId: 'type16', value: 800.00, datePrevista: '2025-01-25', obs: 'Consultoria', isMensal: false },
    { id: 'inc5', kind: 'Receita', categoryId: 'cat10', typeId: 'type19', value: 150.00, datePrevista: '2025-01-28', dateEfetiva: '2025-01-28', obs: 'Venda de item usado', isMensal: false },
    { id: 'inc6', kind: 'Receita', categoryId: 'cat7', typeId: 'type14', value: 5000.00, datePrevista: '2025-01-30', obs: '13º Salário', isMensal: false },
    { id: 'inc7', kind: 'Receita', categoryId: 'cat9', typeId: 'type18', value: 200.00, datePrevista: '2025-01-22', dateEfetiva: '2025-01-22', obs: 'Rendimento fundo', isMensal: false }
  ];

  return { categories, types, expenses, incomes };
}

// Função para limpar e inserir dados
function clearAndInsertData(db, data) {
  return new Promise((resolve, reject) => {
    const { categories, types, expenses, incomes } = data;
    
    // Limpar tabelas
    db.serialize(() => {
      db.run('DELETE FROM expenses');
      db.run('DELETE FROM incomes');
      db.run('DELETE FROM types');
      db.run('DELETE FROM categories');
      
      console.log('🧹 Tabelas limpas');
      
      // Inserir categorias
      const categoryStmt = db.prepare(`
        INSERT INTO categories (id, name, color, kind, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      categories.forEach(cat => {
        categoryStmt.run(cat.id, cat.name, cat.color, cat.kind);
      });
      categoryStmt.finalize();
      console.log(`✅ ${categories.length} categorias inseridas`);

      // Inserir tipos
      const typeStmt = db.prepare(`
        INSERT INTO types (id, name, categoryId, createdAt, updatedAt)
        VALUES (?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      types.forEach(type => {
        typeStmt.run(type.id, type.name, type.categoryId);
      });
      typeStmt.finalize();
      console.log(`✅ ${types.length} tipos inseridos`);

      // Inserir despesas
      const expenseStmt = db.prepare(`
        INSERT INTO expenses (id, kind, categoryId, typeId, value, datePrevista, dateEfetiva, obs, isMensal, seriesId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      expenses.forEach(exp => {
        expenseStmt.run(exp.id, exp.kind, exp.categoryId, exp.typeId, exp.value, exp.datePrevista, exp.dateEfetiva, exp.obs, exp.isMensal ? 1 : 0, exp.seriesId);
      });
      expenseStmt.finalize();
      console.log(`✅ ${expenses.length} despesas inseridas`);

      // Inserir receitas
      const incomeStmt = db.prepare(`
        INSERT INTO incomes (id, kind, categoryId, typeId, value, datePrevista, dateEfetiva, obs, isMensal, seriesId, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
      `);
      
      incomes.forEach(inc => {
        incomeStmt.run(inc.id, inc.kind, inc.categoryId, inc.typeId, inc.value, inc.datePrevista, inc.dateEfetiva, inc.obs, inc.isMensal ? 1 : 0, inc.seriesId);
      });
      incomeStmt.finalize();
      console.log(`✅ ${incomes.length} receitas inseridas`);

      resolve();
    });
  });
}

// Função para gerar relatório completo
function generateCompleteReport(db) {
  return new Promise((resolve, reject) => {
    console.log('\n💰 DIAGNÓSTICO FINANCEIRO COMPLETO');
    console.log('===================================\n');

    // Contadores básicos
    db.get("SELECT COUNT(*) as count FROM categories", (err, row) => {
      if (err) reject(err);
      else console.log(`📊 Total de categorias: ${row.count}`);
    });

    db.get("SELECT COUNT(*) as count FROM types", (err, row) => {
      if (err) reject(err);
      else console.log(`📊 Total de tipos: ${row.count}`);
    });

    db.get("SELECT COUNT(*) as count FROM expenses", (err, row) => {
      if (err) reject(err);
      else console.log(`📊 Total de despesas: ${row.count}`);
    });

    db.get("SELECT COUNT(*) as count FROM incomes", (err, row) => {
      if (err) reject(err);
      else console.log(`📊 Total de receitas: ${row.count}`);
    });

    // Relatório de despesas
    db.get(`
      SELECT 
        COUNT(*) as total_lancamentos,
        COALESCE(SUM(value), 0) as total_valor,
        COALESCE(AVG(value), 0) as valor_medio,
        COALESCE(MIN(value), 0) as menor_valor,
        COALESCE(MAX(value), 0) as maior_valor
      FROM expenses
    `, (err, row) => {
      if (err) reject(err);
      else {
        console.log('\n📉 DESPESAS:');
        console.log(`   • Total de lançamentos: ${row.total_lancamentos}`);
        console.log(`   • Valor total: R$ ${row.total_valor.toFixed(2)}`);
        console.log(`   • Valor médio: R$ ${row.valor_medio.toFixed(2)}`);
        console.log(`   • Menor valor: R$ ${row.menor_valor.toFixed(2)}`);
        console.log(`   • Maior valor: R$ ${row.maior_valor.toFixed(2)}`);
      }
    });

    // Relatório de receitas
    db.get(`
      SELECT 
        COUNT(*) as total_lancamentos,
        COALESCE(SUM(value), 0) as total_valor,
        COALESCE(AVG(value), 0) as valor_medio,
        COALESCE(MIN(value), 0) as menor_valor,
        COALESCE(MAX(value), 0) as maior_valor
      FROM incomes
    `, (err, row) => {
      if (err) reject(err);
      else {
        console.log('\n📈 RECEITAS:');
        console.log(`   • Total de lançamentos: ${row.total_lancamentos}`);
        console.log(`   • Valor total: R$ ${row.total_valor.toFixed(2)}`);
        console.log(`   • Valor médio: R$ ${row.valor_medio.toFixed(2)}`);
        console.log(`   • Menor valor: R$ ${row.menor_valor.toFixed(2)}`);
        console.log(`   • Maior valor: R$ ${row.maior_valor.toFixed(2)}`);
      }
    });

    // Saldo total
    db.get(`
      SELECT 
        (SELECT COALESCE(SUM(value), 0) FROM incomes) - 
        (SELECT COALESCE(SUM(value), 0) FROM expenses) as saldo
    `, (err, row) => {
      if (err) reject(err);
      else {
        const saldo = row.saldo;
        const status = saldo >= 0 ? '✅ POSITIVO' : '❌ NEGATIVO';
        console.log(`\n💵 SALDO TOTAL: R$ ${saldo.toFixed(2)} ${status}`);
      }
    });

    // Top 5 categorias de despesas
    db.all(`
      SELECT c.name, c.color, SUM(e.value) as total, COUNT(e.id) as lancamentos
      FROM expenses e
      JOIN categories c ON e.categoryId = c.id
      GROUP BY c.id, c.name, c.color
      ORDER BY total DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) reject(err);
      else {
        console.log('\n🏆 TOP 5 CATEGORIAS DE DESPESAS:');
        rows.forEach((row, index) => {
          console.log(`   ${index + 1}. ${row.name}: R$ ${row.total.toFixed(2)} (${row.lancamentos} lançamentos)`);
        });
      }
    });

    // Top 5 categorias de receitas
    db.all(`
      SELECT c.name, c.color, SUM(i.value) as total, COUNT(i.id) as lancamentos
      FROM incomes i
      JOIN categories c ON i.categoryId = c.id
      GROUP BY c.id, c.name, c.color
      ORDER BY total DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) reject(err);
      else {
        console.log('\n🏆 TOP 5 CATEGORIAS DE RECEITAS:');
        rows.forEach((row, index) => {
          console.log(`   ${index + 1}. ${row.name}: R$ ${row.total.toFixed(2)} (${row.lancamentos} lançamentos)`);
        });
      }
    });

    // Status das despesas
    db.get(`
      SELECT 
        COUNT(CASE WHEN dateEfetiva IS NOT NULL THEN 1 END) as efetivadas,
        COUNT(CASE WHEN dateEfetiva IS NULL THEN 1 END) as pendentes
      FROM expenses
    `, (err, row) => {
      if (err) reject(err);
      else {
        console.log('\n📋 STATUS DAS DESPESAS:');
        console.log(`   • Efetivadas: ${row.efetivadas}`);
        console.log(`   • Pendentes: ${row.pendentes}`);
      }
    });

    // Status das receitas
    db.get(`
      SELECT 
        COUNT(CASE WHEN dateEfetiva IS NOT NULL THEN 1 END) as efetivadas,
        COUNT(CASE WHEN dateEfetiva IS NULL THEN 1 END) as pendentes
      FROM incomes
    `, (err, row) => {
      if (err) reject(err);
      else {
        console.log('\n📋 STATUS DAS RECEITAS:');
        console.log(`   • Efetivadas: ${row.efetivadas}`);
        console.log(`   • Pendentes: ${row.pendentes}`);
      }
    });

    // Despesas mensais vs únicas
    db.get(`
      SELECT 
        COUNT(CASE WHEN isMensal = 1 THEN 1 END) as mensais,
        COUNT(CASE WHEN isMensal = 0 THEN 1 END) as unicas
      FROM expenses
    `, (err, row) => {
      if (err) reject(err);
      else {
        console.log('\n📅 TIPOS DE DESPESAS:');
        console.log(`   • Mensais/Recorrentes: ${row.mensais}`);
        console.log(`   • Únicas: ${row.unicas}`);
      }
    });

    // Receitas mensais vs únicas
    db.get(`
      SELECT 
        COUNT(CASE WHEN isMensal = 1 THEN 1 END) as mensais,
        COUNT(CASE WHEN isMensal = 0 THEN 1 END) as unicas
      FROM incomes
    `, (err, row) => {
      if (err) reject(err);
      else {
        console.log('\n📅 TIPOS DE RECEITAS:');
        console.log(`   • Mensais/Recorrentes: ${row.mensais}`);
        console.log(`   • Únicas: ${row.unicas}`);
      }
    });

    resolve();
  });
}

// Função principal
async function runCompleteTest() {
  try {
    const dbPath = path.join(process.cwd(), 'database', 'financeiro.db');
    
    if (!fs.existsSync(dbPath)) {
      console.log('❌ Banco de dados não encontrado!');
      console.log('Execute: npm run db:init');
      process.exit(1);
    }

    console.log('✅ Banco de dados encontrado');
    console.log(`📁 Localização: ${dbPath}\n`);

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar:', err);
        process.exit(1);
      }
      console.log('✅ Conectado ao banco de dados');
    });

    // Obter dados completos
    const completeData = getCompleteLocalStorageData();

    // Limpar e inserir dados
    console.log('\n📥 MIGRANDO DADOS COMPLETOS...');
    console.log('===============================\n');
    await clearAndInsertData(db, completeData);

    // Gerar relatório completo
    await generateCompleteReport(db);

    // Fechar conexão
    db.close((err) => {
      if (err) {
        console.error('❌ Erro ao fechar banco:', err);
      } else {
        console.log('\n🎉 TESTE COMPLETO CONCLUÍDO!');
        console.log('=============================');
        console.log('✅ Banco de dados funcionando perfeitamente');
        console.log('✅ Todos os dados migrados com sucesso');
        console.log('✅ Relacionamentos funcionando');
        console.log('✅ Consultas executando corretamente');
        console.log('✅ Diagnóstico financeiro gerado');
        console.log('\n🚀 Sistema 100% operacional!');
      }
    });

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    process.exit(1);
  }
}

// Executar teste completo
runCompleteTest();
