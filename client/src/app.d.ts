// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

  interface Meal {
    name: string;
    tagline: string;
    ingredients: string;
    instructions: string;
    simplicity: string,
    time: string,
    imageUrl: string | undefined,
  }

  interface MealDetails {
    ingredients: string[];
    instructions: string[];
    summary: string;
  }
}

export {};
