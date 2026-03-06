export async function selectVisitReason(page, reason) {
    const visitReasonInput = page.getByPlaceholder('Visit reason');

    await visitReasonInput.click();
    await visitReasonInput.fill(reason, { delay: 1000 });

    await page.getByRole('option', { name: reason }).click({ force: true });
}