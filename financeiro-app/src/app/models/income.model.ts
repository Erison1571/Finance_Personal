export interface Income {
  id: string;
  description: string;
  amount: number;
  categoryId: string;
  typeId: string;
  dateExpected: string; // YYYY-MM-DD
  dateEffective?: string; // YYYY-MM-DD - opcional
  observation?: string;
  createdAt: string;
  updatedAt: string;
}
