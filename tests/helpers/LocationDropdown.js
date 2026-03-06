// import { expect } from '@playwright/test';

// export async function selectLocation(page, locationName) {
//     const locationInput = page.locator('input[placeholder="Location"]');
//     await locationInput.waitFor({ state: 'visible', timeout: 30000 });
//     await expect(locationInput).toBeVisible();
//     await locationInput.click();

//     const option = page.getByRole('option', { name: locationName });
//     await option.waitFor({ state: 'visible', timeout: 10000 });
//     await expect(option).toBeVisible();
//     await option.click();

//     await expect(locationInput).toHaveValue(locationName);
//     console.log('Location selected', locationName);
// }