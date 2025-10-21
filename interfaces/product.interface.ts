export interface Product {
  name: string;
  category: 'Phones' | 'Laptops' | 'Monitors';
  price?: number; // Fetched dynamically during test
}
