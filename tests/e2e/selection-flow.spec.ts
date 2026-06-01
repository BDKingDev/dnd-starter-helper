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

test.describe("selection flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test.describe("intro", () => {
    test("renders the landing headings", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: "D&D Character Picker" })
      ).toBeVisible();
      await expect(page.getByRole("heading", { name: "Checklist" })).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "What you are choosing" })
      ).toBeVisible();
    });

    test("shows the new-player guidance copy", async ({ page }) => {
      await expect(
        page.getByText("You do not need a full backstory. Choose what sounds fun")
      ).toBeVisible();
    });

    test("shows top navigation controls", async ({ page }) => {
      await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
      await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    });
  });

  test.describe("character selection", () => {
    test("does not show artificer as a selectable class", async ({ page }) => {
      await page.getByRole("button", { name: "Next" }).click();
      await expect(page.getByRole("heading", { name: "Artificer" })).toHaveCount(0);
    });

    test("uses the global female toggle for selected class art", async ({ page }) => {
      await page.getByRole("button", { name: "Female" }).click();
      await page.getByRole("button", { name: "Next" }).click();
      await page.getByRole("button", { name: /Fighter token Fighter/ }).click();

      const summaryAvatar = page.locator('aside img[alt="Fighter avatar"]').first();
      await expect(summaryAvatar).toHaveAttribute("src", /fighter-female-avatar\.png$/);
    });
  });

  test.describe("review gating", () => {
    test("disables JSON download until player name is entered", async ({ page }) => {
      await chooseHappyPath(page);

      await expect(page.getByText("Enter your player name.")).toBeVisible();
      await expect(page.getByRole("button", { name: "Download JSON" })).toBeDisabled();

      await page.getByRole("textbox", { name: "Player name (Your name)" }).fill("Bailey");

      await expect(page.getByRole("button", { name: "Download JSON" })).toBeEnabled();
    });

    test("disables JSON copy until player name is entered", async ({ page }) => {
      await chooseHappyPath(page);

      await expect(page.getByText("Enter your player name.")).toBeVisible();
      await expect(page.getByRole("button", { name: "Copy JSON" })).toBeDisabled();

      await page.getByRole("textbox", { name: "Player name (Your name)" }).fill("Bailey");

      await expect(page.getByRole("button", { name: "Copy JSON" })).toBeEnabled();
    });
  });

  test.describe("draft persistence", () => {
    test("restores saved selections from localStorage after reload", async ({ page }) => {
      await chooseHappyPath(page);
      await page.reload();

      await expect(page.getByText("Fighter")).toBeVisible();
      await expect(page.getByText("Protect the Vulnerable")).toBeVisible();
      await expect(page.getByText("A Younger Relative")).toBeVisible();
      await expect(page.getByText("Reckless Protector")).toBeVisible();
    });
  });
});
