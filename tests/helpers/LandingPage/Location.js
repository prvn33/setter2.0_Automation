// import { expect } from '@playwright/test';
// export async function selectLocation(page, locationName) {
//     const locationInput = page.getByPlaceholder('Location');

//     await expect(locationInput).toHaveValue(
//         /SINY Dermatology Upper East Side/
//     );

//     const responsePromise = page.waitForResponse(resp =>
//         resp.url().includes('getLocation') && resp.status() === 200
//     );

//     const response = await responsePromise;

//     const body = response.json()
//     console.log('Locations',body);

//     const locations = body.result;

//     const location = locations.find(loc => loc.name === locationName);

// }



import { expect } from '@playwright/test';

export async function verifyLocationFromAPI(page) {

    const response = await page.waitForResponse(resp =>
        resp.url().includes('getLocation') && resp.status() === 200
    );

    const body = await response.json();

    const locations = body.result;
    console.log('First location object:', locations[0]);

    // get all location names from API
    const apiLocationNames = locations.map(loc => loc.LocationName);
    console.log('Location for a API', apiLocationNames);



    const locationInput = page.getByPlaceholder('Location');

    // get value shown in UI
    const uiLocation = await locationInput.inputValue();
    console.log('UI Location:', uiLocation);

    // verify UI value exists in API response
    expect(apiLocationNames).toContain(uiLocation);
}