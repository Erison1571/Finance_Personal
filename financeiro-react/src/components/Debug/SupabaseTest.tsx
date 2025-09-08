import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { supabase } from '../../lib/supabase';

export const SupabaseTest: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      // Testar conexão com categorias
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      // Testar conexão com despesas
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .limit(5);

      // Testar conexão com receitas
      const { data: incomes, error: incomesError } = await supabase
        .from('incomes')
        .select('*')
        .limit(5);

      setTestResult({
        categories: {
          data: categories,
          error: categoriesError,
          count: categories?.length || 0
        },
        expenses: {
          data: expenses,
          error: expensesError,
          count: expenses?.length || 0
        },
        incomes: {
          data: incomes,
          error: incomesError,
          count: incomes?.length || 0
        }
      });
    } catch (error) {
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Supabase Connection Test
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testSupabaseConnection}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>

      {testResult && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Test Results:
          </Typography>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </Paper>
      )}

      {testResult?.error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Connection Error: {testResult.error}
        </Alert>
      )}

      {testResult && !testResult.error && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Connection successful! Found {testResult.categories?.count || 0} categories, {testResult.expenses?.count || 0} expenses, {testResult.incomes?.count || 0} incomes.
        </Alert>
      )}
    </Box>
  );
};
