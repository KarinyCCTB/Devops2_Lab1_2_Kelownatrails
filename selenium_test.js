const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function kelownaWineTourTests() {
    // Set Chrome options for headless mode
    let options = new chrome.Options();
    options.addArguments('--headless'); // Run in headless mode
    options.addArguments('--disable-gpu'); // Disable GPU for headless mode
    options.addArguments('--window-size=1920,1080'); // Set window size if needed for consistent layout

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Load the webpage
        await driver.get('https://test-devops2-lab1-1-kariny.web.app');

        // 1. Verify Page Load and Elements
        await driver.wait(until.titleIs('DevOps Bonus Project - CCTB'), 1000);

        // Check that key elements are present
        await driver.findElement(By.id('GroupSize'));
        await driver.findElement(By.id('discRate'));
        await driver.findElement(By.id('addMemberBtn'));
        await driver.findElement(By.id('deleteMemberBtn'));
        await driver.findElement(By.id('sortMemberListBtn'));

        // 2. Test Group Size Input Validation
        const groupSizeInput = driver.findElement(By.id('GroupSize'));
        await groupSizeInput.clear();
        await groupSizeInput.sendKeys('invalid input'); // Non-numeric input
        await driver.findElement(By.id('addMemberBtn')).click();

        let alert = await driver.switchTo().alert();
        let alertText = await alert.getText();
        console.log("Alert Text for invalid group size:", alertText); // Expect alert for non-numeric input
        await alert.accept();

        // Enter a valid group size to continue
        await groupSizeInput.clear();
        await groupSizeInput.sendKeys('6'); // Valid input with expected 10% discount

        // 3. Test Discount Calculation for Group Size
        await driver.findElement(By.id('addMemberBtn')).click();
        await driver.wait(until.elementTextIs(driver.findElement(By.id('discRate')), '45.00'), 1000); // 10% discount applied
        let discountRate = await driver.findElement(By.id('discRate')).getAttribute('value');
        console.log("Discount Rate for 6 people:", discountRate); // Expect "45.00" for 10% discount

        // 4. Add, Sort, and Delete Members
        const firstNameInput = driver.findElement(By.id('firstname'));
        const lastNameInput = driver.findElement(By.id('lastname'));
        const membersList = driver.findElement(By.id('members'));

        await firstNameInput.sendKeys('John');
        await lastNameInput.sendKeys('Doe');
        await driver.findElement(By.id('addMemberBtn')).click();

        let membersCount = await membersList.findElements(By.tagName('option')).length;
        console.log("Members count after adding one:", membersCount); // Should be 1

        // Test sorting members (adding another member first)
        await firstNameInput.sendKeys('Jane');
        await lastNameInput.sendKeys('Smith');
        await driver.findElement(By.id('addMemberBtn')).click();

        await driver.findElement(By.id('sortMemberListBtn')).click(); // Sort list
        membersCount = await membersList.findElements(By.tagName('option')).length;
        console.log("Members count after sorting:", membersCount); // Should remain 2

        // 5. Verify Flying Bee Animation and Advice Display
        await driver.wait(until.elementIsVisible(driver.findElement(By.id('bee'))), 5000);
        const advice = await driver.findElement(By.id('advice'));
        await driver.wait(until.elementIsVisible(advice), 10000); // Wait for bee to complete animation
        console.log("Advice displayed:", await advice.isDisplayed()); // Expect true

    } finally {
        await driver.quit();
    }
})();
