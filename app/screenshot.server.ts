let puppeteer: typeof import("@cloudflare/puppeteer");

export async function screenshot(env: Env, owner: string, id: string) {
  if (import.meta.env.DEV !== true && !import.meta.hot) {
    puppeteer = await import("@cloudflare/puppeteer");
  }

  const browser = await puppeteer.launch(env.screenshotBrowser);
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({
    "User-Agent": env.BROWSER_SECRET,
  });
  await page.goto(
    `https://boards.orange-js.dev/internal/screenshot/${owner}/${id}`,
  );
  await page.waitForResponse((res: any) => res.status() === 201, {
    timeout: 1000 * 10,
  });
  await browser.close();
}
