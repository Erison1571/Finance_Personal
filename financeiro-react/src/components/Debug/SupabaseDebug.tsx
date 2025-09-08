import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Alert } from '@mui/material';
import { supabase } from '../../lib/supabase';

export const SupabaseDebug: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSupabase = async () => {
    setLoading(true);
    try {
      console.log('Testing Supabase connection...');
      
      // Testar categorias
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      console.log('Categories result:', { categories, catError });

      // Testar despesas
      const { data: expenses, error: expError } = await supabase
        .from('expenses')
        .select('*')
        .limit(5);

      console.log('Expenses result:', { expenses, expError });

      // Testar receitas
      const { data: incomes, error: incError } = await supabase
        .from('incomes')
        .select('*')
        .limit(5);

      console.log('Incomes result:', { incomes, incError });

      setTestResult({
        categories: { data: categories, error: catError, count: categories?.length || 0 },
        expenses: { data: expenses, error: expError, count: expenses?.length || 0 },
        incomes: { data: incomes, error: incError, count: incomes?.length || 0 }
      });
    } catch (error) {
      console.error('Supabase test error:', error);
      setTestResult({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testSupabase();
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Supabase Debug
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={testSupabase}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? 'Testing...' : 'Test Supabase'}
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
          Error: {testResult.error}
        </Alert>
      )}

      {testResult && !testResult.error && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Found {testResult.categories?.count || 0} categories, {testResult.expenses?.count || 0} expenses, {testResult.incomes?.count || 0} incomes.
        </Alert>
      )}
    </Box>
  );
};
