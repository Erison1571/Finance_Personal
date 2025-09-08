const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🔄 MIGRAÇÃO SQLITE → SUPABASE');
console.log('==============================\n');

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

// Função para gerar script SQL do Supabase
function generateSupabaseSQL(data) {
  console.log('\n📝 GERANDO SCRIPT SQL PARA SUPABASE...');
  console.log('=====================================\n');

  let sql = `-- Script de migração para Supabase
-- Gerado automaticamente em ${new Date().toISOString()}

-- Criar tabelas
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('Despesa', 'Receita')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'Despesa',
  category_id TEXT NOT NULL REFERENCES categories(id),
  type_id TEXT NOT NULL REFERENCES types(id),
  value DECIMAL(10,2) NOT NULL,
  date_prevista TEXT NOT NULL,
  date_efetiva TEXT,
  obs TEXT,
  is_mensal BOOLEAN DEFAULT FALSE,
  series_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incomes (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL DEFAULT 'Receita',
  category_id TEXT NOT NULL REFERENCES categories(id),
  type_id TEXT NOT NULL REFERENCES types(id),
  value DECIMAL(10,2) NOT NULL,
  date_prevista TEXT NOT NULL,
  date_efetiva TEXT,
  obs TEXT,
  is_mensal BOOLEAN DEFAULT FALSE,
  series_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias
`;

  // Inserir categorias
  data.categories.forEach(cat => {
    sql += `INSERT INTO categories (id, name, color, kind, created_at, updated_at) VALUES ('${cat.id}', '${cat.name}', '${cat.color}', '${cat.kind}', '${cat.createdAt}', '${cat.updatedAt}');\n`;
  });

  sql += '\n-- Inserir tipos\n';

  // Inserir tipos
  data.types.forEach(type => {
    sql += `INSERT INTO types (id, name, category_id, created_at, updated_at) VALUES ('${type.id}', '${type.name}', '${type.categoryId}', '${type.createdAt}', '${type.updatedAt}');\n`;
  });

  sql += '\n-- Inserir despesas\n';

  // Inserir despesas
  data.expenses.forEach(exp => {
    const dateEfetiva = exp.dateEfetiva ? `'${exp.dateEfetiva}'` : 'NULL';
    const obs = exp.obs ? `'${exp.obs.replace(/'/g, "''")}'` : 'NULL';
    const seriesId = exp.seriesId ? `'${exp.seriesId}'` : 'NULL';
    const isMensal = exp.isMensal ? 'TRUE' : 'FALSE';
    
    sql += `INSERT INTO expenses (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES ('${exp.id}', '${exp.kind}', '${exp.categoryId}', '${exp.typeId}', ${exp.value}, '${exp.datePrevista}', ${dateEfetiva}, ${obs}, ${isMensal}, ${seriesId}, '${exp.createdAt}', '${exp.updatedAt}');\n`;
  });

  sql += '\n-- Inserir receitas\n';

  // Inserir receitas
  data.incomes.forEach(inc => {
    const dateEfetiva = inc.dateEfetiva ? `'${inc.dateEfetiva}'` : 'NULL';
    const obs = inc.obs ? `'${inc.obs.replace(/'/g, "''")}'` : 'NULL';
    const seriesId = inc.seriesId ? `'${inc.seriesId}'` : 'NULL';
    const isMensal = inc.isMensal ? 'TRUE' : 'FALSE';
    
    sql += `INSERT INTO incomes (id, kind, category_id, type_id, value, date_prevista, date_efetiva, obs, is_mensal, series_id, created_at, updated_at) VALUES ('${inc.id}', '${inc.kind}', '${inc.categoryId}', '${inc.typeId}', ${inc.value}, '${inc.datePrevista}', ${dateEfetiva}, ${obs}, ${isMensal}, ${seriesId}, '${inc.createdAt}', '${inc.updatedAt}');\n`;
  });

  return sql;
}

// Função para gerar arquivo de configuração do Supabase
function generateSupabaseConfig(data) {
  console.log('\n⚙️ GERANDO CONFIGURAÇÃO DO SUPABASE...');
  console.log('=====================================\n');

  const config = {
    project: {
      name: 'Moura_Solutions',
      description: 'Sistema de Controle Financeiro Pessoal',
      version: '2.0.0'
    },
    database: {
      tables: {
        categories: {
          count: data.categories.length,
          sample: data.categories[0]
        },
        types: {
          count: data.types.length,
          sample: data.types[0]
        },
        expenses: {
          count: data.expenses.length,
          sample: data.expenses[0]
        },
        incomes: {
          count: data.incomes.length,
          sample: data.incomes[0]
        }
      }
    },
    migration: {
      totalRecords: data.categories.length + data.types.length + data.expenses.length + data.incomes.length,
      generatedAt: new Date().toISOString()
    }
  };

  return config;
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
    
    // Gerar script SQL
    const sqlScript = generateSupabaseSQL(data);
    fs.writeFileSync('supabase-migration.sql', sqlScript);
    console.log('✅ Script SQL salvo: supabase-migration.sql');
    
    // Gerar configuração
    const config = generateSupabaseConfig(data);
    fs.writeFileSync('supabase-config.json', JSON.stringify(config, null, 2));
    console.log('✅ Configuração salva: supabase-config.json');
    
    // Gerar arquivo .env de exemplo
    const envExample = `# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
`;
    fs.writeFileSync('.env.example', envExample);
    console.log('✅ Arquivo .env.example criado');
    
    console.log('\n🎉 MIGRAÇÃO PREPARADA COM SUCESSO!');
    console.log('==================================');
    console.log('📁 Arquivos gerados:');
    console.log('   • supabase-migration.sql - Script para executar no Supabase');
    console.log('   • supabase-config.json - Configuração do projeto');
    console.log('   • .env.example - Variáveis de ambiente');
    console.log('\n📋 PRÓXIMOS PASSOS:');
    console.log('1. Criar projeto no Supabase (https://supabase.com)');
    console.log('2. Executar o script supabase-migration.sql no SQL Editor');
    console.log('3. Copiar URL e chave do projeto');
    console.log('4. Criar arquivo .env com as credenciais');
    console.log('5. Testar a conexão');
    console.log('\n🚀 Sistema pronto para deploy!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

// Executar migração
migrateToSupabase();
