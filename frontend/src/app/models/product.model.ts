import { Category } from './category.model';
import { Seller } from './seller.model';

export interface Product {
  name: string;
  description: string;
  price: string;
  id: number;
  image: string;
  stock_quantity: number;
  category: Category;
  seller: Seller;
  qtdProduct: number;
}
