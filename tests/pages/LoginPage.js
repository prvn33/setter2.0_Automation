export class LoginPage {
    constructor(page) {
        this.page = page;
        this.email = page.getByPlaceholder('Email');
        this.password = page.getByPlaceholder('Password');
        this.loginBtn = page.getByRole('button', { name: "Sign In" });
    }

    async goto() {
        // navigates to exact login page you shared
        await this.page.goto('https://stage.setter.layline.live/login');
    }

    async login(email, pass) {
        await this.email.fill(email);
        await this.password.fill(pass);
        await this.loginBtn.click();
    }
}