import { test } from '@playwright/test';
import { LoginPage } from '../page/login.po.js';
import { ContactPage } from '../page/contact.po.js';
import { authenticateUser, createEntity } from '../Util/helper.spec.js';
import testData from '../fixtures/loginFixture.json';
import contactTestData from '../fixtures/contactFixture.json';

test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login("sujal123@gmail.com", "sujal123");
    await login.verifyValidLogin();
});

test.describe('Contact testcases', () => {

    test('Contact Add test', async ({ page }) => {
        const contact = new ContactPage(page);

        await contact.contactAdd(
            "Rajesh",
            "hamal",
            "1919-12-12",
            "hamal@gmail.com",
            "980000000",
            "Kathmandu",
            "Bagmati",
            "44600",
            "Nepal"
        );

        await contact.viewContact("Rajesh", "hamal");

        await contact.validateContactCreated(
            "Rajesh",
            "hamal",
            "1919-12-12",
            "hamal@gmail.com",
            "980000000",
            "Thamel",
            "Kathmandu",
            "Bagmati",
            "44600",
            "Nepal"
        );
    });

    test('Contact Edit test', async ({ page, request }) => {
        const Data = {
            "firstName": "Aarya",
            "lastName": "Mdr",
            "birthdate": "1990-06-30",
            "email": "aaaririr@gmail.com",
            "phone": "9898989898",
            "street1": "Add1",
            "city": "City1",
            "stateProvince": "State1",
            "postalCode": "12345",
            "country": "Nepal"
        };

        const contact = new ContactPage(page);

        const accessToken = await authenticateUser(
            testData.validUser.username,
            testData.validUser.password,
            { request }
        );
        await createEntity(Data, accessToken, '/contacts', { request });

        await page.reload();
        await page.waitForLoadState('networkidle');

        await contact.viewContact(Data.firstName, Data.lastName);

        await contact.contactEdit(
            contactTestData.firstName,
            contactTestData.lastName,
            contactTestData.birthdate,
            contactTestData.email,
            contactTestData.phone,
            contactTestData.street1,
            contactTestData.city,
            contactTestData.stateProvince,
            contactTestData.postalCode,
            contactTestData.country
        );

        await contact.validateContactCreated(
            contactTestData.firstName,
            contactTestData.lastName,
            contactTestData.birthdate,
            contactTestData.email,
            contactTestData.phone,
            contactTestData.street1,
            contactTestData.city,
            contactTestData.stateProvince,
            contactTestData.postalCode,
            contactTestData.country
        );
    });

    test.only('Contact Delete test', async ({ page, request }) => {
        const Data = {
            "firstName": "Delete",
            "lastName": "User",
            "birthdate": "1990-01-01",
            "email": "deleteuser@gmail.com",
            "phone": "9800000000",
            "street1": "Address1", 
            "city": "City1",
            "stateProvince": "State1",
            "postalCode": "12345",
            "country": "Nepal"
        };

        const contact = new ContactPage(page);

        const accessToken = await authenticateUser(
            testData.validUser.username,
            testData.validUser.password,
            { request }
        );
        await createEntity(Data, accessToken, '/contacts', { request });

        await page.reload();
        await page.waitForLoadState('networkidle');

        await contact.viewContact(Data.firstName, Data.lastName);

        await contact.contactDelete();

        await contact.validateContactDeleted(Data.firstName, Data.lastName);
    });

});