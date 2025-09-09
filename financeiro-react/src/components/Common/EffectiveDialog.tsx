import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography
} from '@mui/material';
import { formatBRL } from '../../utils/currency.util';

interface EffectiveDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { valueEffective: number; dateEffective: string; obs?: string }) => void;
  title: string;
  amount: number;
  description?: string;
}

export const EffectiveDialog: React.FC<EffectiveDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  amount,
  description
}) => {
  const [valueEffective, setValueEffective] = useState<number>(amount); // Valores já estão em reais
  const [dateEffective, setDateEffective] = useState<string>('');
  const [obs, setObs] = useState<string>('');

  React.useEffect(() => {
    if (open) {
      setValueEffective(amount); // Valores já estão em reais
      setDateEffective(new Date().toISOString().split('T')[0]);
      setObs(description || '');
    }
  }, [open, amount, description]);

  const handleSave = () => {
    if (valueEffective <= 0 || !dateEffective) return;
    
    onSave({
      valueEffective,
      dateEffective,
      obs: obs.trim() || undefined
    });
  };

  const isValid = valueEffective > 0 && dateEffective;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Valor Previsto:</strong> {formatBRL(amount)}
          </Typography>
          
          <TextField
            fullWidth
            label="Valor Efetivado"
            type="number"
            value={valueEffective}
            onChange={(e) => setValueEffective(Number(e.target.value))}
            inputProps={{ min: 0.01, step: 0.01 }}
            sx={{ mt: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Data de Efetivação"
            type="date"
            value={dateEffective}
            onChange={(e) => setDateEffective(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
            required
          />
          
          <TextField
            fullWidth
            label="Observação (opcional)"
            multiline
            rows={3}
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!isValid}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
