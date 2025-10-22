import * as fs from 'fs';
import * as path from 'path';
import { User } from '../interfaces/user.interface';
import { Product } from '../interfaces/product.interface';
import { CheckoutData } from '../interfaces/checkout.interface';

/**
 * Utility class to load test data from JSON files based on environment
 */
export class TestDataLoader {
  private static env = process.env.TEST_ENV || 'stg';
  private static dataPath = path.join(__dirname, '..', 'data', this.env);

  /**
   * Load user credentials from users.json
   * @returns Array of User objects
   */
  static loadUsers(): User[] {
    const filePath = path.join(this.dataPath, 'users.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  /**
   * Load product catalog from products.json
   * @returns Array of Product objects
   */
  static loadProducts(): Product[] {
    const filePath = path.join(this.dataPath, 'products.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  /**
   * Load checkout data from checkout-data.json
   * @returns Array of CheckoutData objects
   */
  static loadCheckoutData(): CheckoutData[] {
    const filePath = path.join(this.dataPath, 'checkout-data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  /**
   * Get specific user by index
   * @param index - Index of user in array (default: 0)
   * @returns User object
   */
  static getUser(index: number = 0): User {
    const users = this.loadUsers();
    if (index >= users.length) {
      throw new Error(`User index ${index} out of bounds. Only ${users.length} users available.`);
    }
    return users[index];
  }

  /**
   * Get specific product by name
   * @param name - Product name to find
   * @returns Product object or undefined if not found
   */
  static getProductByName(name: string): Product | undefined {
    const products = this.loadProducts();
    return products.find(p => p.name === name);
  }

  /**
   * Get products by category
   * @param category - Category to filter by
   * @returns Array of Product objects
   */
  static getProductsByCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Product[] {
    const products = this.loadProducts();
    return products.filter(p => p.category === category);
  }

  /**
   * Get specific checkout data by index
   * @param index - Index of checkout data in array (default: 0)
   * @returns CheckoutData object
   */
  static getCheckoutData(index: number = 0): CheckoutData {
    const checkoutDataList = this.loadCheckoutData();
    if (index >= checkoutDataList.length) {
      throw new Error(`Checkout data index ${index} out of bounds. Only ${checkoutDataList.length} records available.`);
    }
    return checkoutDataList[index];
  }
}
