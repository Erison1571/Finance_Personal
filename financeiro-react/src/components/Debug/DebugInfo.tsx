import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

export const DebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      nodeEnv: import.meta.env.MODE,
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      allEnvVars: import.meta.env,
    };
    
    setDebugInfo(info);
  }, []);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>
        Debug Information
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Environment Variables:
        </Typography>
        <pre style={{ fontSize: '12px', overflow: 'auto' }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </Paper>

      {!debugInfo.hasSupabaseUrl && (
        <Alert severity="error">
          VITE_SUPABASE_URL is missing!
        </Alert>
      )}

      {!debugInfo.hasSupabaseAnonKey && (
        <Alert severity="error">
          VITE_SUPABASE_ANON_KEY is missing!
        </Alert>
      )}

      {debugInfo.hasSupabaseUrl && debugInfo.hasSupabaseAnonKey && (
        <Alert severity="success">
          Supabase environment variables are configured!
        </Alert>
      )}
    </Box>
  );
};
