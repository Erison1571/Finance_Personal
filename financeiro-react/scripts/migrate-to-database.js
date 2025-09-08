import { DatabaseInit } from '../dist/database/init.js';

async function migrate() {
  console.log('🔄 Iniciando migração para banco de dados...');
  
  try {
    const success = await DatabaseInit.initialize();
    
    if (success) {
      console.log('✅ Migração concluída com sucesso!');
      console.log('📁 Banco de dados criado em: database/financeiro.db');
      console.log('💾 Seus dados foram transferidos do localStorage para o SQLite');
    } else {
      console.log('❌ Falha na migração');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

migrate();
