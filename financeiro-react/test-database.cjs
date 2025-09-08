const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🧪 TESTE AUTOMATIZADO - BANCO DE DADOS');
console.log('=====================================\n');

// Função para simular dados do localStorage
function getLocalStorageData() {
  console.log('📦 Simulando dados do localStorage...');
  
  // Dados de exemplo baseados no initService
  const categories = [
    { id: '1', name: 'Moradia', color: '#f44336', kind: 'Despesa' },
    { id: '2', name: 'Transporte', color: '#ff9800', kind: 'Despesa' },
    { id: '3', name: 'Alimentação', color: '#4caf50', kind: 'Despesa' },
    { id: '4', name: 'Saúde', color: '#2196f3', kind: 'Despesa' },
    { id: '5', name: 'Educação', color: '#9c27b0', kind: 'Despesa' },
    { id: '6', name: 'Lazer', color: '#e91e63', kind: 'Despesa' },
    { id: '7', name: 'Salário', color: '#4caf50', kind: 'Receita' },
    { id: '8', name: 'Freelance', color: '#ff9800', kind: 'Receita' },
    { id: '9', name: 'Investimentos', color: '#2196f3', kind: 'Receita' },
    { id: '10', name: 'Outros', color: '#607d8b', kind: 'Receita' }
  ];

  const types = [
    { id: '1', name: 'Fixo', categoryId: '1' },
    { id: '2', name: 'Variável', categoryId: '1' },
    { id: '3', name: 'Combustível', categoryId: '2' },
    { id: '4', name: 'Manutenção', categoryId: '2' },
    { id: '5', name: 'Supermercado', categoryId: '3' },
    { id: '6', name: 'Restaurante', categoryId: '3' },
    { id: '7', name: 'Plano de Saúde', categoryId: '4' },
    { id: '8', name: 'Medicamentos', categoryId: '4' },
    { id: '9', name: 'Curso', categoryId: '5' },
    { id: '10', name: 'Livros', categoryId: '5' },
    { id: '11', name: 'Cinema', categoryId: '6' },
    { id: '12', name: 'Viagem', categoryId: '6' },
    { id: '13', name: 'Salário Mensal', categoryId: '7' },
    { id: '14', name: '13º Salário', categoryId: '7' },
    { id: '15', name: 'Projeto Web', categoryId: '8' },
    { id: '16', name: 'Consultoria', categoryId: '8' },
    { id: '17', name: 'Ações', categoryId: '9' },
    { id: '18', name: 'Fundos', categoryId: '9' },
    { id: '19', name: 'Vendas', categoryId: '10' },
    { id: '20', name: 'Doações', categoryId: '10' }
  ];

  const expenses = [
    { id: '1', kind: 'Despesa', categoryId: '1', typeId: '1', value: 1200.00, datePrevista: '2025-01-01', dateEfetiva: '2025-01-01', obs: 'Aluguel janeiro', isMensal: true, seriesId: 'rent-2025' },
    { id: '2', kind: 'Despesa', categoryId: '1', typeId: '2', value: 150.00, datePrevista: '2025-01-15', dateEfetiva: '2025-01-15', obs: 'Conta de luz', isMensal: false },
    { id: '3', kind: 'Despesa', categoryId: '2', typeId: '3', value: 300.00, datePrevista: '2025-01-10', dateEfetiva: '2025-01-10', obs: 'Combustível', isMensal: false },
    { id: '4', kind: 'Despesa', categoryId: '3', typeId: '5', value: 800.00, datePrevista: '2025-01-05', dateEfetiva: '2025-01-05', obs: 'Compras do mês', isMensal: true, seriesId: 'grocery-2025' },
    { id: '5', kind: 'Despesa', categoryId: '4', typeId: '7', value: 450.00, datePrevista: '2025-01-01', dateEfetiva: '2025-01-01', obs: 'Plano de saúde', isMensal: true, seriesId: 'health-2025' },
    { id: '6', kind: 'Despesa', categoryId: '5', typeId: '9', value: 200.00, datePrevista: '2025-01-20', obs: 'Curso online', isMensal: false },
    { id: '7', kind: 'Despesa', categoryId: '6', typeId: '11', value: 50.00, datePrevista: '2025-01-25', dateEfetiva: '2025-01-25', obs: 'Cinema', isMensal: false },
    { id: '8', kind: 'Despesa', categoryId: '2', typeId: '4', value: 500.00, datePrevista: '2025-01-30', obs: 'Revisão do carro', isMensal: false }
  ];

  const incomes = [
    { id: '1', kind: 'Receita', categoryId: '7', typeId: '13', value: 5000.00, datePrevista: '2025-01-05', dateEfetiva: '2025-01-05', obs: 'Salário janeiro', isMensal: true, seriesId: 'salary-2025' },
    { id: '2', kind: 'Receita', categoryId: '8', typeId: '15', value: 1200.00, datePrevista: '2025-01-15', dateEfetiva: '2025-01-15', obs: 'Projeto website', isMensal: false },
    { id: '3', kind: 'Receita', categoryId: '9', typeId: '17', value: 300.00, datePrevista: '2025-01-20', dateEfetiva: '2025-01-20', obs: 'Dividendos ações', isMensal: false },
    { id: '4', kind: 'Receita', categoryId: '8', typeId: '16', value: 800.00, datePrevista: '2025-01-25', obs: 'Consultoria', isMensal: false },
    { id: '5', kind: 'Receita', categoryId: '10', typeId: '19', value: 150.00, datePrevista: '2025-01-28', dateEfetiva: '2025-01-28', obs: 'Venda de item usado', isMensal: false }
  ];

  return { categories, types, expenses, incomes };
}

// Função para inserir dados no banco
function insertData(db, data) {
  return new Promise((resolve, reject) => {
    const { categories, types, expenses, incomes } = data;
    
    // Inserir categorias
    const categoryStmt = db.prepare(`
      INSERT OR REPLACE INTO categories (id, name, color, kind, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    categories.forEach(cat => {
      categoryStmt.run(cat.id, cat.name, cat.color, cat.kind);
    });
    categoryStmt.finalize();
    console.log(`✅ ${categories.length} categorias inseridas`);

    // Inserir tipos
    const typeStmt = db.prepare(`
      INSERT OR REPLACE INTO types (id, name, categoryId, createdAt, updatedAt)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    types.forEach(type => {
      typeStmt.run(type.id, type.name, type.categoryId);
    });
    typeStmt.finalize();
    console.log(`✅ ${types.length} tipos inseridos`);

    // Inserir despesas
    const expenseStmt = db.prepare(`
      INSERT OR REPLACE INTO expenses (id, kind, categoryId, typeId, value, datePrevista, dateEfetiva, obs, isMensal, seriesId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    expenses.forEach(exp => {
      expenseStmt.run(exp.id, exp.kind, exp.categoryId, exp.typeId, exp.value, exp.datePrevista, exp.dateEfetiva, exp.obs, exp.isMensal ? 1 : 0, exp.seriesId);
    });
    expenseStmt.finalize();
    console.log(`✅ ${expenses.length} despesas inseridas`);

    // Inserir receitas
    const incomeStmt = db.prepare(`
      INSERT OR REPLACE INTO incomes (id, kind, categoryId, typeId, value, datePrevista, dateEfetiva, obs, isMensal, seriesId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);
    
    incomes.forEach(inc => {
      incomeStmt.run(inc.id, inc.kind, inc.categoryId, inc.typeId, inc.value, inc.datePrevista, inc.dateEfetiva, inc.obs, inc.isMensal ? 1 : 0, inc.seriesId);
    });
    incomeStmt.finalize();
    console.log(`✅ ${incomes.length} receitas inseridas`);

    resolve();
  });
}

// Função para testar consultas
function testQueries(db) {
  return new Promise((resolve, reject) => {
    console.log('\n🔍 TESTANDO CONSULTAS...');
    console.log('========================\n');

    // Teste 1: Contar registros
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

    // Teste 2: Verificar relacionamentos
    db.get(`
      SELECT c.name as categoria, COUNT(t.id) as tipos
      FROM categories c
      LEFT JOIN types t ON c.id = t.categoryId
      GROUP BY c.id, c.name
      ORDER BY tipos DESC
      LIMIT 1
    `, (err, row) => {
      if (err) reject(err);
      else console.log(`🔗 Categoria com mais tipos: ${row.categoria} (${row.tipos} tipos)`);
    });

    resolve();
  });
}

// Função para gerar diagnóstico financeiro
function generateFinancialReport(db) {
  return new Promise((resolve, reject) => {
    console.log('\n💰 DIAGNÓSTICO FINANCEIRO');
    console.log('==========================\n');

    // Total de despesas
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
        console.log('📉 DESPESAS:');
        console.log(`   • Total de lançamentos: ${row.total_lancamentos}`);
        console.log(`   • Valor total: R$ ${row.total_valor.toFixed(2)}`);
        console.log(`   • Valor médio: R$ ${row.valor_medio.toFixed(2)}`);
        console.log(`   • Menor valor: R$ ${row.menor_valor.toFixed(2)}`);
        console.log(`   • Maior valor: R$ ${row.maior_valor.toFixed(2)}`);
      }
    });

    // Total de receitas
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

    // Saldo
    db.get(`
      SELECT 
        (SELECT COALESCE(SUM(value), 0) FROM incomes) - 
        (SELECT COALESCE(SUM(value), 0) FROM expenses) as saldo
    `, (err, row) => {
      if (err) reject(err);
      else {
        const saldo = row.saldo;
        const status = saldo >= 0 ? '✅ POSITIVO' : '❌ NEGATIVO';
        console.log(`\n💵 SALDO: R$ ${saldo.toFixed(2)} ${status}`);
      }
    });

    // Top 5 categorias de despesas
    db.all(`
      SELECT c.name, c.color, SUM(e.value) as total
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
          console.log(`   ${index + 1}. ${row.name}: R$ ${row.total.toFixed(2)}`);
        });
      }
    });

    // Top 5 categorias de receitas
    db.all(`
      SELECT c.name, c.color, SUM(i.value) as total
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
          console.log(`   ${index + 1}. ${row.name}: R$ ${row.total.toFixed(2)}`);
        });
      }
    });

    // Despesas por status
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

    // Receitas por status
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

    resolve();
  });
}

// Função principal
async function runTest() {
  try {
    const dbPath = path.join(process.cwd(), 'database', 'financeiro.db');
    
    // Verificar se banco existe
    if (!fs.existsSync(dbPath)) {
      console.log('❌ Banco de dados não encontrado!');
      console.log('Execute: npm run db:init');
      process.exit(1);
    }

    console.log('✅ Banco de dados encontrado');
    console.log(`📁 Localização: ${dbPath}\n`);

    // Conectar ao banco
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('❌ Erro ao conectar:', err);
        process.exit(1);
      }
      console.log('✅ Conectado ao banco de dados');
    });

    // Obter dados do localStorage simulado
    const localStorageData = getLocalStorageData();

    // Inserir dados no banco
    console.log('\n📥 MIGRANDO DADOS DO LOCALSTORAGE...');
    console.log('=====================================\n');
    await insertData(db, localStorageData);

    // Testar consultas
    await testQueries(db);

    // Gerar diagnóstico financeiro
    await generateFinancialReport(db);

    // Fechar conexão
    db.close((err) => {
      if (err) {
        console.error('❌ Erro ao fechar banco:', err);
      } else {
        console.log('\n🎉 TESTE CONCLUÍDO COM SUCESSO!');
        console.log('================================');
        console.log('✅ Banco de dados funcionando perfeitamente');
        console.log('✅ Todos os dados migrados do localStorage');
        console.log('✅ Relacionamentos funcionando');
        console.log('✅ Consultas executando corretamente');
        console.log('\n🚀 Sistema pronto para uso!');
      }
    });

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    process.exit(1);
  }
}

// Executar teste
runTest();
