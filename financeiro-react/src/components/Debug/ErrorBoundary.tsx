import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Paper, Alert } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box p={2}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6">Erro na aplicação</Typography>
          </Alert>
          
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Erro:
            </Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {this.state.error?.message}
            </pre>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Stack Trace:
            </Typography>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}
