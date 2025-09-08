import { Kind } from './kind.enum';

export interface Category {
  id: string;
  name: string;
  kind: Kind;
  createdAt: string;
  updatedAt: string;
}
