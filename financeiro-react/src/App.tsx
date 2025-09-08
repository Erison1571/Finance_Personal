import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ptBR } from '@mui/material/locale';
import { useEffect } from 'react';

import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Categories } from './components/Categories/Categories';
import { Types } from './components/Types/Types';
import { Expenses } from './components/Expenses/Expenses';
import { Incomes } from './components/Incomes/Incomes';
import { InitService } from './services/initService';
import { ErrorBoundary } from './components/Debug/ErrorBoundary';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  ptBR
);

function App() {
  useEffect(() => {
    // Inicializar dados de exemplo na primeira execução
    // InitService.initializeSampleData(); // Comentado temporariamente
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/categorias" element={<Categories />} />
              <Route path="/tipos" element={<Types />} />
              <Route path="/despesas" element={<Expenses />} />
              <Route path="/receitas" element={<Incomes />} />
            </Routes>
          </Layout>
        </ErrorBoundary>
      </Router>
    </ThemeProvider>
  );
}

export default App;