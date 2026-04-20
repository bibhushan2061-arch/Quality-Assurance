const { expect } = require("@playwright/test");

exports.ContactPage = class ContactPage {
  constructor(page) {
    this.page = page;

    // Buttons
    this.addContactBtn = '#add-contact';
    this.save = '#submit';
    this.editContact = '#edit-contact';
    this.deleteContact = '#delete';

    // Form input selectors
    this.firstName = '#firstName';
    this.lastName = '#lastName';
    this.dob = '#birthdate';
    this.email = '#email';
    this.phone = '#phone';
    this.address = '#street1';
    this.city = '#city';
    this.state = '#stateProvince';
    this.postal = '#postalCode';
    this.country = '#country';

    // Detail view selectors
    this.savedFirstName = '#firstName';
    this.savedLastName = '#lastName';
    this.savedDOB = '#birthdate';
    this.savedEmail = '#email';
    this.savedPhone = '#phone';
    this.savedAddress = '#street1';
    this.savedCity = '#city';
    this.savedState = '#stateProvince';
    this.savedPostal = '#postalCode';
    this.savedCountry = '#country';

    // Table row selector
    this.contactTableRows = '.contactTableBodyRow';
  }

  async contactAdd(firstName, lastName, dateOfBirth, email, phone, address, city, state, postal, country) {
    await this.page.locator(this.addContactBtn).click();

    await this.page.locator(this.firstName).fill(firstName);
    await this.page.locator(this.lastName).fill(lastName);
    await this.page.locator(this.dob).fill(dateOfBirth);
    await this.page.locator(this.email).fill(email);
    await this.page.locator(this.phone).fill(phone);
    await this.page.locator(this.address).fill(address);
    await this.page.locator(this.city).fill(city);
    await this.page.locator(this.state).fill(state);
    await this.page.locator(this.postal).fill(postal);
    await this.page.locator(this.country).fill(country);

    await this.page.locator(this.save).click();
    await this.page.waitForLoadState('networkidle');
  }

  async validateContactCreated(fName, lName, dob, email, phone, address, city, state, postal, country) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector(this.savedFirstName, { state: 'visible' });

    await expect(this.page.locator(this.savedFirstName)).toHaveText(fName);
    await expect(this.page.locator(this.savedLastName)).toHaveText(lName);
    await expect(this.page.locator(this.savedDOB)).toHaveText(dob);
    await expect(this.page.locator(this.savedEmail)).toHaveText(email);
    await expect(this.page.locator(this.savedPhone)).toHaveText(phone);
    await expect(this.page.locator(this.savedAddress)).toHaveText(address);
    await expect(this.page.locator(this.savedCity)).toHaveText(city);
    await expect(this.page.locator(this.savedState)).toHaveText(state);
    await expect(this.page.locator(this.savedPostal)).toHaveText(postal);
    await expect(this.page.locator(this.savedCountry)).toHaveText(country);
  }

  async viewContact(firstName, lastName) {
    if (firstName && lastName) {
      const fullName = `${firstName} ${lastName}`;
      await this.page.locator(`tr.contactTableBodyRow td`, { hasText: fullName }).first().click();
    } else {
      await this.page.locator('tr.contactTableBodyRow').first().click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async contactEdit(firstName, lastName, dateOfBirth, email, phone, address, city, state, postal, country) {
    await this.page.locator(this.editContact).click();
    await this.page.waitForLoadState('networkidle');

    await this.page.locator(this.firstName).fill(firstName);
    await this.page.locator(this.lastName).fill(lastName);
    await this.page.locator(this.dob).fill(dateOfBirth);
    await this.page.locator(this.email).fill(email);
    await this.page.locator(this.phone).fill(phone);
    await this.page.locator(this.address).fill(address);
    await this.page.locator(this.city).fill(city);
    await this.page.locator(this.state).fill(state);
    await this.page.locator(this.postal).fill(postal);
    await this.page.locator(this.country).fill(country);

    await this.page.locator(this.save).click();
    await this.page.waitForLoadState('networkidle');
  }

  async contactDelete() {
    this.page.once('dialog', async dialog => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });
    await this.page.locator(this.deleteContact).click();
  }

  async validateContactDeleted(firstName, lastName) {
    await this.page.waitForLoadState('networkidle');

    // Verify we're back on the contact list page
    await expect(this.page).toHaveURL(/contact-list/);

    // Verify the deleted contact no longer appears in the list
    const contactRow = this.page.locator('tr.contactTableBodyRow', {
      hasText: `${firstName} ${lastName}`
    });
    await expect(contactRow).not.toBeVisible();
  }

};