const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🚀 Inicializando banco de dados SQLite...');

// Criar pasta database se não existir
const dbDir = path.join(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Pasta database criada');
}

// Caminho do banco
const dbPath = path.join(dbDir, 'financeiro.db');

// Criar banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao criar banco:', err);
    process.exit(1);
  }
  console.log('✅ Banco de dados conectado');
});

// Criar tabelas
db.serialize(() => {
  console.log('📋 Criando tabelas...');

  // Tabela categories
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      kind TEXT NOT NULL CHECK (kind IN ('Despesa', 'Receita')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela categories:', err);
    else console.log('✅ Tabela categories criada');
  });

  // Tabela types
  db.run(`
    CREATE TABLE IF NOT EXISTS types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      categoryId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories (id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela types:', err);
    else console.log('✅ Tabela types criada');
  });

  // Tabela expenses
  db.run(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL DEFAULT 'Despesa',
      categoryId TEXT NOT NULL,
      typeId TEXT NOT NULL,
      value DECIMAL(10,2) NOT NULL,
      datePrevista TEXT NOT NULL,
      dateEfetiva TEXT,
      obs TEXT,
      isMensal BOOLEAN DEFAULT 0,
      seriesId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories (id),
      FOREIGN KEY (typeId) REFERENCES types (id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela expenses:', err);
    else console.log('✅ Tabela expenses criada');
  });

  // Tabela incomes
  db.run(`
    CREATE TABLE IF NOT EXISTS incomes (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL DEFAULT 'Receita',
      categoryId TEXT NOT NULL,
      typeId TEXT NOT NULL,
      value DECIMAL(10,2) NOT NULL,
      datePrevista TEXT NOT NULL,
      dateEfetiva TEXT,
      obs TEXT,
      isMensal BOOLEAN DEFAULT 0,
      seriesId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoryId) REFERENCES categories (id),
      FOREIGN KEY (typeId) REFERENCES types (id)
    )
  `, (err) => {
    if (err) console.error('Erro ao criar tabela incomes:', err);
    else console.log('✅ Tabela incomes criada');
  });

  console.log('🎉 Banco de dados inicializado com sucesso!');
  console.log('📁 Localização:', dbPath);
});

// Fechar conexão
db.close((err) => {
  if (err) {
    console.error('❌ Erro ao fechar banco:', err);
  } else {
    console.log('✅ Conexão fechada');
    console.log('🚀 Sistema pronto para uso!');
  }
});
