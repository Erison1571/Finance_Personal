// Usar serviços do Supabase para produção
export * from './supabase/categoriesService';
export * from './supabase/expensesService';
export * from './supabase/incomesService';
export * from './supabase/typesService';

// Manter serviços antigos como fallback
export * from './categoriesService';
export * from './expensesService';
export * from './incomesService';
export * from './initService';
export * from './storageService';
export * from './typesService';
export * from './pdfExportService';
