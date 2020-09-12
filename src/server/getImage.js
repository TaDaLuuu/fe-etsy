import puppeteer from "puppeteer";

const getImages = async (url) => {
  const extractPartners = async () => {
    const page = await browser.newPage();
    await page.goto(url);
    page.on("console", (msg) => {
      console.log({ msg });
    });

    const partners = await page.evaluate(async () => {
      const arrayImages = [];
      const product_wrapper = document.querySelectorAll(
        "ul .carousel-pagination-item-v2"
      );
      for (const product of product_wrapper) {
        try {
          const imgs = product.querySelector("img").src;
          arrayImages.push(imgs);
        } catch (err) {
          console.log(err);
        }
      }
      return arrayImages;
    });
    await page.close();
    return partners;
  };

  const browser = await puppeteer.launch();
  const x = await extractPartners(url);
  await browser.close();
  return x;
};
