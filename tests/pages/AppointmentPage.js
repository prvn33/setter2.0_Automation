export class AppointmentPage {
  constructor(page) {
    this.page = page;

    this.newBtn = page.getByRole('button', { name: 'New Appointment' });
    this.patient = page.locator('#patient');
    this.provider = page.locator('#provider');
    this.date = page.locator('#date');
    this.time = page.locator('#time');
    this.saveBtn = page.getByRole('button', { name: 'Save' });
  }

  async open() {
    await this.page.goto('/appointments');
  }

  async bookAppointment(patient, provider, date, time) {
    await this.newBtn.click();
    await this.patient.fill(patient);
    await this.provider.selectOption(provider);
    await this.date.fill(date);
    await this.time.fill(time);
    await this.saveBtn.click();
  }
}