import { test } from '@playwright/test';
import userLoggedIn from '../user-logged-in';

test('login', async ({ page }) => userLoggedIn({ page }));
