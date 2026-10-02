import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('End-to-End Grant Completeness Review Flow', () => {
  test('Complete workflow from landing -> login -> upload -> review -> summary', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page.locator('text=Review grant applications with absolute confidence')).toBeVisible();

    // 2. Navigate to Login
    await page.click('text=Start Review');
    await expect(page.locator('text=Welcome back')).toBeVisible();

    // 3. Login with Demo credentials
    await page.fill('input[type="email"]', 'demo@example.com');
    await page.fill('input[type="password"]', 'demo123');
    await page.click('button[type="submit"]');

    // 4. Dashboard View
    await expect(page.locator('text=Review Dashboard')).toBeVisible();

    // 5. Navigate to New Assessment
    await page.click('text=New Assessment');
    await expect(page.locator('text=New Grant Completeness Assessment')).toBeVisible();

    // 6. Upload guideline and application
    const guidelinePath = path.resolve(__dirname, '../sample-documents/guidelines/community-grant-guideline.pdf');
    const applicationPath = path.resolve(__dirname, '../sample-documents/applications/community-grant-application.pdf');
    const supportingPath = path.resolve(__dirname, '../sample-documents/supporting/registration-certificate.pdf');

    await page.setInputFiles('#guideline-upload', guidelinePath);
    await page.setInputFiles('#application-upload', applicationPath);
    await page.setInputFiles('#supporting-upload', supportingPath);

    // 7. Click Analyze Application
    await page.click('text=Analyze Application');

    // 8. Progress Workflow is shown
    await expect(page.locator('text=Analyzing Your Application')).toBeVisible();

    // 9. Redirects to Results page
    await expect(page.locator('text=Completeness Score')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=Supplied Evidence & Citations')).toBeVisible();

    // 10. Open Requirement and Confirm Mapping
    const firstReq = page.locator('text=REQ-001').first();
    await firstReq.click();
    await page.click('button:has-text("Confirm")');

    // 11. Open Final Reviewed Summary
    await page.click('text=View Final Reviewed Summary');
    await expect(page.locator('text=Reviewed Completeness Summary')).toBeVisible();
    await page.click('button:has-text("Close")');
  });
});
