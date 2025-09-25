const { LoginPage } = require('../pages/loginPage');

class LoginHelper {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
  }

  async performLogin(data) {
    await this.loginPage.goto();
    await this.loginPage.login(data.username, data.password);
    await this.verifyLogin();
  }

  async performLogout() {
    await this.loginPage.logout();
  }

  async verifyLogin() {
    await this.loginPage.assertInventorySidebarVisible();
  }

  async tearDown() {
    await this.page.close();
  }
}

module.exports = LoginHelper;