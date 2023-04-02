import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const suggestResponse = {
  response: {
    meals: [
      {
        name: 'Milk Steak',
        tagline: 'A Philly Classic',
        ingredients: 'Milk, Steak, Ghouls',
        instructions: 'Shear the ghouls, then cook the steak in the milk.',
        imageURL: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
        simplicity: 'Easy',
        time: 30,
      },
      {
        name: 'Uranium Salad',
        tagline: 'Classic Twist On A Household Staple',
        ingredients: 'Lettuce, Uranium',
        instructions: 'Wash and dry the lettuce, then sprinkle with enriched uranium.',
        imageURL: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
        simplicity: 'Medium',
        time: 100,
      },
      {
        name: 'None Pizza With Left Beef',
        tagline: 'Certified Hood Classic',
        ingredients: 'None, Pizza, Left Beef',
        instructions: 'Cook the pizza, then add the beef (left only tho).',
        imageURL: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
        simplicity: 'Easy',
        time: 45,
      }
    ],
  },
};

const imageResponse = {
  response: 'https://www.themealdb.com/images/media/meals/1548772327.jpg',
};

const detailsResponse = {
  response: {
    ingredients: [
      '1 Milk',
      '2 Steak',
      '1.235 Ghouls',
    ],
    instructions: [
      'Shear the ghouls',
      'Cook the steak in the milk',
      'Profit'
    ],
    summary: `Oh, milk steak.

    Hmm?
    Hmm? What?
    
    - Milk steak.
    - I'm not putting milk steak.
    
    Just put steak. Just put regular steak.
    And then- I'm gonna put steak.
    
    Put milk steak.
    She'll know what it is.
    
    She won't know. Nobody knows what that is.
    She'll know what it is.`,
  },
};

test.describe('Home page layout', () => {
  test('page has expected heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'ChefGPT 🧑‍🍳' })).toBeVisible();
  });

  test('page has expected navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ingredients' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Your Recipes' })).toBeVisible();
  });

  test('page has expected login button', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Sign in with Google' })).toBeVisible();
  });
});

test.describe('Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://chef-gpt.herokuapp.com/api/suggest', async route => {
      const json = suggestResponse;
      await route.fulfill({ json });
    });
  
    await page.route('https://chef-gpt.herokuapp.com/api/image?*', async route => {
      const json = imageResponse;
      await route.fulfill({ json });
    });

    await page.route('https://chef-gpt.herokuapp.com/api/details', async route => {
      const json = detailsResponse;
      await route.fulfill({ json });
    });

    // Authenticate
    await page.goto('/signin');
    await page.getByLabel('Email').fill('tester@melen.com');
    await page.getByLabel('Password').fill(process.env['PASSWORD'] ?? 'RandomPassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/');
    await expect(page.getByRole('button', { name: 'Generate Recipes' })).toBeVisible();
  });

  test('page generates meals and can render more details', async ({ page }) => {
    // Add ingredients
    await page.getByRole('link', { name: 'Ingredients' }).click();
    await page.waitForURL('/ingredients');
    await page.getByText('AVOCADO').click();
    await page.getByText('CHICKEN').click();
    await page.getByText('BEEF').click();
    expect(await page.getByText('3 ingredients selected')).toBeVisible();

    // Trigger meal generation
    await page.getByRole('link', { name: 'Home' }).click();
    await page.waitForURL('/');
    await page.getByRole('button', { name: 'Generate Recipes' }).click();

    await expect(page.getByRole('heading', { name: 'Milk Steak' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Uranium Salad' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'None Pizza With Left Beef' })).toBeVisible();

    // View details
    await page.getByRole('button', { name: 'View More Details' }).first().click();

    await expect(page.getByRole('heading', { name: 'Milk Steak' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'A Philly Classic' })).toBeVisible();
    await expect(page.getByText("She won't know. Nobody knows what that is.")).toBeVisible();
  });
});