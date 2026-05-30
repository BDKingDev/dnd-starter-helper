import { expect, test } from "@playwright/test";

async function chooseHappyPath(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: /Fighter token Fighter/ }).click();
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: /Protect the Vulnerable/ }).click();
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: /A Younger Relative/ }).click();
  await page.getByRole("button", { name: "Next" }).click();

  await page.getByRole("button", { name: /Reckless Protector/ }).click();
  await page.getByRole("button", { name: "Next" }).click();
}

async function reachReviewWithName(
  page: import("@playwright/test").Page,
  playerName = "Bailey"
) {
  await chooseHappyPath(page);
  await page.getByRole("textbox", { name: "Player name" }).fill(playerName);
}

test.describe("submission flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test.describe("Apps Script endpoint behavior", () => {
    test("includes the configured submission token in the outbound request", async ({
      page
    }) => {
      let postedBody: Record<string, unknown> | null = null;

      await page.route(
        "https://script.google.com/macros/s/playwright-test/exec",
        async (route) => {
          const postData = route.request().postData();
          postedBody = postData ? JSON.parse(postData) : null;
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ success: true })
          });
        }
      );

      await reachReviewWithName(page, "Token Tester");
      await page.getByRole("button", { name: "Send to DM sheet" }).click();

      expect(postedBody).not.toBeNull();
      expect(postedBody?.playerName).toBe("Token Tester");
      expect(postedBody?.submissionToken).toBe("playwright-test-token");
    });

    test("shows the Apps Script success copy after an opaque submission", async ({
      page
    }) => {
      await page.route(
        "https://script.google.com/macros/s/playwright-test/exec",
        async (route) => {
          await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ success: true })
          });
        }
      );

      await reachReviewWithName(page, "Token Tester");
      await page.getByRole("button", { name: "Send to DM sheet" }).click();

      await expect(
        page.getByText(
          "Your submission was sent. This connection does not provide an instant confirmation"
        )
      ).toBeVisible();
    });

    test("does not leak the submission token into the visible JSON preview", async ({
      page
    }) => {
      await reachReviewWithName(page, "Token Tester");
      await expect(page.getByText('"submissionToken"')).toHaveCount(0);
    });
  });
});
