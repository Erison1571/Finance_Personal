const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

console.log('🔄 Criando banco de dados SQLite...');

// Criar pasta database se não existir
const dbDir = path.join(process.cwd(), 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('✅ Pasta database criada');
}

// Criar banco de dados
const dbPath = path.join(dbDir, 'financeiro.db');
const db = new sqlite3.Database(dbPath);

console.log('📁 Banco criado em:', dbPath);

// Criar tabelas
db.serialize(() => {
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
  `);

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
  `);

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
  `);

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
  `);

  console.log('✅ Tabelas criadas com sucesso!');
});

db.close((err) => {
  if (err) {
    console.error('❌ Erro ao fechar banco:', err);
  } else {
    console.log('🎉 Banco de dados SQLite criado com sucesso!');
    console.log('📁 Localização:', dbPath);
  }
});
