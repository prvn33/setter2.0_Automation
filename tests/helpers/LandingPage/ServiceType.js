export async function selectServiceType(page, reason) {
    const visitReasonInput = page.getByPlaceholder('Service Type');

    await visitReasonInput.click();

    const options1 = page.getByRole('option');

    const count1 = await options1.count();

    console.log(`Before Total Service Type options: ${count1}`);

    await visitReasonInput.fill(reason, { delay: 1000 });

    const options = page.getByRole('option', { name: reason });
    const isDisabled = await options.getAttribute('aria-disabled');

    console.log('Disabled:', isDisabled);

    await options.click({ force: true });

}

export async function clickGrayService(page) {

    const options = page.getByRole('option');
    const count = await options.count();

    for (let i = 0; i < count; i++) {

        const option = options.nth(i);

        const color = await option.evaluate(el => getComputedStyle(el).color);

        if (color === 'rgb(128, 128, 128)') {
            await option.click();
            return;
        }
    }

    throw new Error('No gray option found');
}