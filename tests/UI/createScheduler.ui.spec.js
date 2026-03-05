import { request } from '@playwright/test';
import { selectLocation } from '../helpers/LocationDropdown';
import { selectComboBoxOption } from '../helpers/ComboBox';
const { test, expect } = require('@playwright/test');


test.skip('Create a new scheduler (stable)', async ({ page }) => {

    await page.goto('https://stage.setter.layline.live/admin/clarusdermatology/1/patients');

    const schedulersLink = page.getByRole('link', { name: 'Schedulers' });
    await schedulersLink.click();

    await expect(
        page.getByRole('button', { name: 'Create New Scheduler' })
    ).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Create New Scheduler' }).click();

    const popup = page.getByRole('heading', { name: 'Create New Scheduler' });
    await expect(popup).toBeVisible();

    const schedulerName = `Auto-${Date.now()}`;
    await page.locator('input[name="schedulerName"]').fill(schedulerName);

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(
        page.getByRole('heading', { name: 'Data Uploaded Sucessfully' })
    ).toBeVisible({ timeout: 15000 });

    const dialog = page.getByRole('dialog');

    await dialog.getByRole('button', { name: /close/i }).click();

    const seeAllSchedulersBtn = page.getByRole('button', { name: /see all schedulers/i });

    await expect(seeAllSchedulersBtn).toBeVisible();
    await seeAllSchedulersBtn.click();

    await page.waitForLoadState('networkidle');

    await page.getByRole('combobox', { name: 'Rows per page' }).click();
    await page.getByRole('option', { name: '100' }).click();

    await page.waitForLoadState('networkidle');

    const cell = page.getByText(schedulerName, { exact: true });
    await expect(cell).toBeVisible({ timeout: 10000 });


});

test.skip("Choose a client in a topbar dropdown and verify the URL changes accordingly", async ({ page }) => {
    await page.goto('https://stage.setter.layline.live/admin/clarusdermatology/1/patients');

    const clientDropdown = page.getByRole('combobox', { name: 'Select Client' });
    await clientDropdown.click();

    await clientDropdown.fill('Siny');

    await page.getByRole('option', { name: 'SINY Dermatology' }).click();

    await expect(page).toHaveURL('https://stage.setter.layline.live/admin/sinydermatology/1/patients');
});

test.skip('Validation for creating scheduler', async ({ page }) => {

    await page.goto('https://stage.setter.layline.live/admin/clarusdermatology/1/patients');

    const schedulersLink = page.getByRole('link', { name: 'Schedulers' });
    await schedulersLink.click();

    await expect(
        page.getByRole('button', { name: 'Create New Scheduler' })
    ).toBeVisible({ timeout: 15000 });
    await page.getByRole('button', { name: 'Create New Scheduler' }).click();

    const popup = page.getByRole('heading', { name: 'Create New Scheduler' });
    await expect(popup).toBeVisible();

    await page.getByRole('button', { name: 'Create' }).click();

    await expect(
        page.getByText('Scheduler name cannot be empty*', { exact: true })
    ).toBeVisible({ timeout: 15000 });

});


test.skip('Verify that location dropdown is visible, correct, and selectable', async ({ page }) => {
    await page.goto(
        'https://stage.setter.layline.live/admin/sinydermatology/1/managescheduler'
    );

    const locationResponse = await page.waitForResponse(
        resp => resp.url().includes('getLocation') && resp.status() === 200
    );

    const apiBody = await locationResponse.json();
    console.log('Location names:', apiBody.result.map(loc => loc.LocationName));

    const apiLocationNames = apiBody.result
        .filter(loc => loc.status === 1 && loc.locationOnline === 1)
        .map(loc => loc.LocationName.trim());

    console.log('Filtered API location names:', apiLocationNames);

    const locationInput = page.locator('input[placeholder="Location"]');
    await locationInput.click();

    const dropdownOptions = page.getByRole('option');
    const uiLocationNames = (await dropdownOptions.allTextContents()).map(text =>
        text.trim()
    );

    expect(uiLocationNames.length).toBe(apiLocationNames.length);
    expect(uiLocationNames.sort()).toEqual(apiLocationNames.sort());

    const locationToSelect = apiLocationNames[1];
    console.log('Selected location :', locationToSelect);

    // choose specific location and verify it's selected

    // const locationToSelect = apiLocationNames.find(name =>
    //     name.includes('Park Avenue')
    // );

    await page.getByRole('option', { name: locationToSelect }).click();

    await expect(locationInput).toHaveValue(locationToSelect);

    const landingLink = page.locator('a[href*="/landing"]');
    await expect(landingLink).toBeVisible();

    const href = await landingLink.getAttribute('href');
    console.log('Generated landing URL:', href);

    const expectedSlug = locationToSelect
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

    expect(href?.toLowerCase()).toContain(expectedSlug);
    expect(href).toContain('/landing');
});

test.skip('Verify a appointment slot section, Allow existing patients to schedule? to check toggle on/off', async ({ page }) => {
    await page.goto(
        'https://stage.setter.layline.live/admin/sinydermatology/1/managescheduler'
    );

    const schedulerDropdown = page.locator('input[role="combobox"][placeholder="Scheduler name"]');
    await schedulerDropdown.click();

    await schedulerDropdown.fill('Scheduler');

    await page.getByRole('option', { name: 'Scheduler 1' }).click();

    const appointmentSlotSection = page.locator('div[role="button"]', { hasText: 'Appointment Slots' });

    const isExpanded = await appointmentSlotSection.getAttribute('aria-expanded');
    console.log('Accordion is', isExpanded === 'false' ? 'Collapsed' : 'Expanded');

    await expect(appointmentSlotSection).toBeVisible();
    await appointmentSlotSection.click();

    const radioGroup = page.locator('fieldset[role="radiogroup"], div[role="radiogroup"][aria-label="bookingAllowedExistingPatient"]');
    await expect(radioGroup).toBeVisible();

    // Locate the individual radios
    const yesOption = radioGroup.locator('input[value="Yes"]');
    const noOption = radioGroup.locator('input[value="No"]');

    // Wait until they are attached
    await yesOption.waitFor({ state: 'attached', timeout: 5000 });
    await noOption.waitFor({ state: 'attached', timeout: 5000 });

    // Check which one is currently selected
    const isYesChecked = await yesOption.isChecked();
    const isNoChecked = await noOption.isChecked();
    console.log(`Yes is ${isYesChecked ? 'checked ✅' : 'unchecked ❌'}`);
    console.log(`No is ${isNoChecked ? 'checked ✅' : 'unchecked ❌'}`);

    // Optional: click Yes if it’s not already selected
    if (!isYesChecked) {
        await yesOption.click();
        await expect(yesOption).toBeChecked();
        await expect(noOption).not.toBeChecked();
        console.log('Switched selection to Yes ✅');
    }

    const saveBtn = page.getByRole('button', { name: 'Save all changes' });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();

    await selectLocation(page, 'SINY Dermatology Bay Ridge');

    const landingLink = page.locator('a[href*="/landing"]');
    await landingLink.click();
    await page.waitForLoadState('networkidle');

    console.log('Navigated to landing page for Test A');

})

test.skip('Verify a existing patient not able to schedule when "Allow existing patients to schedule?" ', async ({ page }) => {
    await page.goto(
        'https://stage.setter.layline.live/admin/sinydermatology/1/managescheduler'
    )

    await selectLocation(page, 'SINY Dermatology Bay Ridge');

    const landingLink = page.locator('a[href*="/landing"]');
    await landingLink.click();

    console.log('Navigated to landing page for SINY');


})

test.skip('Check a error validation for a service type and service dropdown for new patient in SINY', async ({ page }) => {
    await page.goto(
        'https://stage.setter.layline.live/sinydermatology/1/sinydermatologybayridge/landing'
    );

    const existingButton = page.locator('#newPatient-button');
    await expect(existingButton).toBeVisible({ timeout: 20000 });
    await expect(existingButton).toBeEnabled({ timeout: 20000 });
    await existingButton.click();

    const serviceTypeError = page.getByText('*Please Choose a reason for your visit', { exact: true });
    await expect(serviceTypeError).toBeVisible({ timeout: 10000 });

    const serviceError = page.getByText('*Please select a service', { exact: true });
    await expect(serviceError).toBeVisible({ timeout: 10000 });

})

test('Fill service type and service on landing page', async ({ page }) => {
    await page.goto(
        'https://stage.setter.layline.live/sinydermatology/1/sinydermatologybayridge/landing'
    );

    // ---- Visit Reason Autocomplete ----
    const visitReasonInput = page.getByPlaceholder('Visit reason');

    await visitReasonInput.waitFor({ state: 'visible' });
    await visitReasonInput.click();
    await visitReasonInput.fill('Cosmetic Consultation', { delay: 1000 });

    const visitReasonOption = page.getByRole('option', {
        name: 'Cosmetic Consultation',
    });

    await visitReasonOption.waitFor({ state: 'visible' });
    await visitReasonOption.click();

    await expect(visitReasonInput).toHaveValue('Cosmetic Consultation');

    // ---- Service Type (auto-filled) ----
    const serviceTypeInput = page.getByPlaceholder('Service Type');

    await expect(serviceTypeInput).toBeVisible();
    await expect(serviceTypeInput).toHaveValue('Cosmetic Consultation');

    // ---- New Patient Button ----
    const newPatientBtn = page.locator('#newPatient-button');

    await expect(newPatientBtn).toBeEnabled();
    await newPatientBtn.click();
});