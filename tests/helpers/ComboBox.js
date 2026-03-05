import { expect } from "@playwright/test";

export async function selectComboBoxOption(page, comboBoxLabel, optionName) {
    const comboBox = page.getByRole('combobox', { name: comboBoxLabel });
    await comboBox.waitFor({ state: 'visible', timeout: 10000 });
    await expect(comboBox).toBeVisible();

    await comboBox.fill('');

    await comboBox.click();
    await comboBox.fill(optionName);

    const option = page.getByRole('option', { name: optionName });
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();

    await expect(comboBox).toHaveValue(optionName);

    console.log(`"${comboBoxLabel}" option selected:`, optionName);
}