const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🔄 MIGRAÇÃO SQLITE → SUPABASE DIRETA');
console.log('=====================================\n');

// Função para ler dados do SQLite
function readSQLiteData() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(process.cwd(), 'database', 'financeiro.db');
    
    if (!fs.existsSync(dbPath)) {
      reject(new Error('Banco SQLite não encontrado!'));
      return;
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('✅ Conectado ao SQLite');
    });

    const data = {};

    // Ler categorias
    db.all('SELECT * FROM categories', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      data.categories = rows;
      console.log(`📦 ${rows.length} categorias lidas do SQLite`);
    });

    // Ler tipos
    db.all('SELECT * FROM types', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      data.types = rows;
      console.log(`📦 ${rows.length} tipos lidos do SQLite`);
    });

    // Ler despesas
    db.all('SELECT * FROM expenses', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      data.expenses = rows;
      console.log(`📦 ${rows.length} despesas lidas do SQLite`);
    });

    // Ler receitas
    db.all('SELECT * FROM incomes', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      data.incomes = rows;
      console.log(`📦 ${rows.length} receitas lidas do SQLite`);
    });

    // Fechar conexão após um tempo
    setTimeout(() => {
      db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    }, 1000);
  });
}

// Função para gerar comandos SQL de inserção
function generateInsertSQL(data) {
  console.log('\n📝 GERANDO COMANDOS SQL DE INSERÇÃO...');
  console.log('=====================================\n');

  let sql = `-- Comandos de inserção para Supabase
-- Execute estes comandos no SQL Editor do Supabase

-- Inserir categorias
`;

  // Inserir categorias
  data.categories.forEach(cat => {
    sql += `INSERT INTO categories (id, name, color, kind, created_at, updated_at) VALUES ('${cat.id}', '${cat.name}', '${cat.color}', '${cat.kind}', '${cat.createdAt}', '${cat.updatedAt}') ON CONFLICT (id) DO NOTHING;\n`;
  });

  sql += '\n-- Inserir tipos\n';

  // Inserir tipos
  data.types.forEach(type => {
    sql += `INSERT INTO types (id, name, category_id, created_at, updated_at) VALUES ('${type.id}', '${type.name}', '${type.categoryId}', '${type.createdAt}', '${type.updatedAt}') ON CONFLICT (id) DO NOTHING;\n`;
  });

  sql += '\n-- Inserir despesas\n';

  // Inserir despesas
  data.expenses.forEach(exp => {
    const dateEfetiva = exp.dateEfetiva ? `'${exp.dateEfetiva}'` : 'NULL';
    const obs = exp.obs ? `'${exp.obs.replace(/'/g, "''")}'` : 'NULL';
    const seriesId = exp.seriesId ? `'${exp.seriesId}'` : 'NULL';
    const isMensal = exp.isMensal ? 'TRUE' : 'FALSE';
    
    sql += `INSERT INTO expenses (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES ('${exp.id}', '${exp.kind}', '${exp.categoryId}', '${exp.typeId}', ${exp.value}, '${exp.datePrevista}', ${dateEfetiva}, ${obs}, ${isMensal}, ${seriesId}, '${exp.createdAt}', '${exp.updatedAt}') ON CONFLICT (id) DO NOTHING;\n`;
  });

  sql += '\n-- Inserir receitas\n';

  // Inserir receitas
  data.incomes.forEach(inc => {
    const dateEfetiva = inc.dateEfetiva ? `'${inc.dateEfetiva}'` : 'NULL';
    const obs = inc.obs ? `'${inc.obs.replace(/'/g, "''")}'` : 'NULL';
    const seriesId = inc.seriesId ? `'${inc.seriesId}'` : 'NULL';
    const isMensal = inc.isMensal ? 'TRUE' : 'FALSE';
    
    sql += `INSERT INTO incomes (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES ('${inc.id}', '${inc.kind}', '${inc.categoryId}', '${inc.typeId}', ${inc.value}, '${inc.datePrevista}', ${dateEfetiva}, ${obs}, ${isMensal}, ${seriesId}, '${inc.createdAt}', '${inc.updatedAt}') ON CONFLICT (id) DO NOTHING;\n`;
  });

  return sql;
}

// Função principal
async function migrateToSupabase() {
  try {
    console.log('📊 LENDO DADOS DO SQLITE...');
    console.log('============================\n');
    
    const data = await readSQLiteData();
    
    console.log('\n✅ DADOS LIDOS COM SUCESSO!');
    console.log('============================');
    console.log(`📦 Categorias: ${data.categories.length}`);
    console.log(`📦 Tipos: ${data.types.length}`);
    console.log(`📦 Despesas: ${data.expenses.length}`);
    console.log(`📦 Receitas: ${data.incomes.length}`);
    
    // Gerar comandos SQL
    const insertSQL = generateInsertSQL(data);
    fs.writeFileSync('supabase-insert-data.sql', insertSQL);
    console.log('✅ Comandos SQL salvos: supabase-insert-data.sql');
    
    console.log('\n🎉 MIGRAÇÃO PREPARADA COM SUCESSO!');
    console.log('==================================');
    console.log('📁 Arquivo gerado:');
    console.log('   • supabase-insert-data.sql - Comandos para inserir dados no Supabase');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Acesse o Supabase (https://supabase.com)');
    console.log('2. Vá para o SQL Editor');
    console.log('3. Execute o arquivo supabase-insert-data.sql');
    console.log('4. Teste o sistema online');
    console.log('\n🚀 Dados prontos para migração!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrateToSupabase();
