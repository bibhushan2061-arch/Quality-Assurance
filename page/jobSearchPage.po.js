const { expect } = require('@playwright/test');

exports.JobSearchPage = class JobSearchPage {
  constructor(page) {
    this.page = page;

    // Locators
    this.searchInput = 'form input[placeholder*="Search"]';
    this.searchBtn = 'form button[type="submit"]';
    this.applyFiltersBtn = 'button:has-text("Apply Filters")';
    this.jobTitleLinks = 'a[href*="/vacancy/"]';
    
    // Job detail locators
    this.applyButton = 'button:has-text("Apply"), a:has-text("Apply"), button:has-text("Apply Now")';
    this.jobTitleHeader = 'h1'; // Usually the main heading on the detail page is the job title
    this.jobSpecificationHeader = 'text=Job Specification, text=Job Description';
  }

  // Set Search Input on the search page
  async searchForJob(keyword) {
    await this.page.locator(this.searchInput).fill(keyword);
    await this.page.locator(this.searchBtn).click();
    await this.page.waitForLoadState('networkidle');
  }

  // Expand accordion and apply filter checkbox
  async applyFilter(filterGroup, optionText) {
    // 1. Check if the filter accordion is expanded, if not, click it
    // Select the button that acts as the header/trigger for the accordion group
    const trigger = this.page.locator(`button:has-text("${filterGroup}")`).first();
    if (await trigger.count() > 0) {
      const isExpanded = await trigger.getAttribute('aria-expanded');
      if (isExpanded !== 'true') {
        await trigger.click();
        await this.page.waitForTimeout(500); // Allow animation to complete
      }
    }

    // 2. Locate the option checkbox or its label, and click it
    // MeroJob uses <label> text for checkboxes
    const optionLabel = this.page.locator(`label:has-text("${optionText}")`).first();
    await expect(optionLabel).toBeVisible({ timeout: 5000 });
    await optionLabel.click();

    // 3. Click "Apply Filters" button to trigger the search reload
    const applyBtn = this.page.locator(this.applyFiltersBtn).first();
    if (await applyBtn.count() > 0 && await applyBtn.isVisible()) {
      await applyBtn.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  // Verify at least one search result exists
  async verifySearchResultsExist() {
    const jobList = this.page.locator(this.jobTitleLinks);
    await expect(jobList.first()).toBeVisible({ timeout: 10000 });
    const count = await jobList.count();
    expect(count).toBeGreaterThan(0);
  }

  // Click on the first job link in the search results
  async viewFirstJobDetails() {
    const firstJobLink = this.page.locator(this.jobTitleLinks).first();
    await expect(firstJobLink).toBeVisible();
    
    // Get text of first job title to assert on detail page later
    const expectedTitle = await firstJobLink.innerText();
    
    await firstJobLink.click();
    await this.page.waitForLoadState('networkidle');
    
    return expectedTitle;
  }

  // Validate the job detail page elements
  async validateJobDetailPage(expectedTitle) {
    // Verify we navigated to a /vacancy/ URL
    await expect(this.page).toHaveURL(/\/vacancy\//);

    // Verify key job elements like Apply Button or Job Specification are visible
    // We expect the job details container/specification to be loaded
    const applyBtn = this.page.locator(this.applyButton).first();
    await expect(applyBtn).toBeVisible({ timeout: 8000 });

    // Verify the title is present on the detail page (case insensitive or substring match)
    if (expectedTitle) {
      const detailTitle = await this.page.locator(this.jobTitleHeader).first().innerText();
      // Remove extra whitespaces and compare
      expect(detailTitle.toLowerCase().trim()).toContain(expectedTitle.toLowerCase().trim().split('\n')[0]);
    }
  }
};
