const fs = require('fs');
const path = require('path');

class DataHelper {
  /**
   * Load JSON data from file
   * @param {string} fileName - Name of the JSON file (without extension)
   * @returns {Object} Parsed JSON data
   */
  static loadJsonData(fileName) {
    const filePath = path.join(__dirname, '..', 'data', `${fileName}.json`);
    try {
      const rawData = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(rawData);
    } catch (error) {
      throw new Error(`Failed to load data from ${fileName}.json: ${error.message}`);
    }
  }

  /**
   * Get valid users data
   * @returns {Array} Array of valid user objects
   */
  static getValidUsers() {
    const usersData = this.loadJsonData('users');
    return usersData.validUsers;
  }

  /**
   * Get invalid users data
   * @returns {Array} Array of invalid user objects
   */
  static getInvalidUsers() {
    const usersData = this.loadJsonData('users');
    return usersData.invalidUsers;
  }

  /**
   * Get standard user credentials
   * @returns {Object} Standard user object
   */
  static getStandardUser() {
    const validUsers = this.getValidUsers();
    return validUsers.find(user => user.username === 'standard_user');
  }

  /**
   * Get products data
   * @returns {Array} Array of product objects
   */
  static getProducts() {
    const productsData = this.loadJsonData('products');
    return productsData.products;
  }

  /**
   * Get sort options
   * @returns {Array} Array of sort option objects
   */
  static getSortOptions() {
    const productsData = this.loadJsonData('products');
    return productsData.sortOptions;
  }

  /**
   * Get checkout data
   * @returns {Object} Checkout data object
   */
  static getCheckoutData() {
    return this.loadJsonData('checkout');
  }

  /**
   * Get valid checkout information
   * @returns {Object} Valid checkout info
   */
  static getValidCheckoutInfo() {
    const checkoutData = this.getCheckoutData();
    return checkoutData.checkoutInfo.valid;
  }

  /**
   * Get invalid checkout information
   * @returns {Array} Array of invalid checkout info objects
   */
  static getInvalidCheckoutInfo() {
    const checkoutData = this.getCheckoutData();
    return checkoutData.checkoutInfo.invalid;
  }

  /**
   * Get random product
   * @returns {Object} Random product object
   */
  static getRandomProduct() {
    const products = this.getProducts();
    const randomIndex = Math.floor(Math.random() * products.length);
    return products[randomIndex];
  }

  /**
   * Get multiple random products
   * @param {number} count - Number of products to return
   * @returns {Array} Array of random product objects
   */
  static getRandomProducts(count = 2) {
    const products = this.getProducts();
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Generate random string
   * @param {number} length - Length of the string
   * @returns {string} Random string
   */
  static generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random email
   * @returns {string} Random email address
   */
  static generateRandomEmail() {
    const username = this.generateRandomString(8);
    const domain = this.generateRandomString(5);
    return `${username}@${domain}.com`;
  }

  /**
   * Calculate expected total price
   * @param {Array} items - Array of items with price property
   * @param {number} taxRate - Tax rate (default from checkout data)
   * @returns {Object} Object with subtotal, tax, and total
   */
  static calculateTotalPrice(items, taxRate = null) {
    if (!taxRate) {
      const checkoutData = this.getCheckoutData();
      taxRate = checkoutData.paymentInfo.tax;
    }

    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return sum + price;
    }, 0);

    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };
  }
}

module.exports = DataHelper;