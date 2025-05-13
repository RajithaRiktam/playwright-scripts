import { LoginPage } from '../pages/LoginPage';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export async function login(page) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(process.env.EMAIL, process.env.PASSWORD);
}

export async function logout(page) {
    const loginPage = new LoginPage(page);
    await loginPage.logout();
}
