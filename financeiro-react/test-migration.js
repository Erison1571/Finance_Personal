import { DatabaseInit } from './dist/database/init.js';

console.log('🔄 Testando migração...');

try {
  const success = await DatabaseInit.initialize();
  console.log('Resultado:', success);
} catch (error) {
  console.error('Erro:', error);
}
