import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = 'Funcionalidade em desenvolvimento...' 
}) => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {title}
      </Typography>
      
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <ConstructionIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Esta funcionalidade será implementada em breve.
        </Typography>
      </Paper>
    </Box>
  );
};
