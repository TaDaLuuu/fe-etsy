import puppeteer from "puppeteer";
import getImages from "./getImage.js";
const server = async () => {
  const extractPartners = async (url) => {
    const page = await browser.newPage();
    await page.goto(url);
    page.on("console", (msg) => {
      console.log({ msg });
    });

    const lastNumberLi = await page.evaluate(() => {
      const pagination = document.querySelector(
        ".wt-action-group.wt-list-inline.wt-flex-no-wrap.wt-flex-no-wrap.wt-pt-lg-1.wt-pb-lg-3"
      );
      const liArr = pagination.querySelectorAll("li");
      const lastNumberLi = liArr[liArr.length - 2];
      const pageNumbers = /\d+/g.exec(lastNumberLi.innerText);
      return pageNumbers;
    });

    const partners = await page.evaluate(async () => {
      const products = [];
      const product_wrapper = document.querySelectorAll(".v2-listing-card");
      for (const product of product_wrapper) {
        const dataJson = {};
        try {
          dataJson.img = product.querySelector(
            ".v2-listing-card__img .height-placeholder > img"
          ).src;
          dataJson.title = product.querySelector(
            ".v2-listing-card__info > div > h3"
          ).innerText;
          dataJson.link = product.querySelector(
            ".v2-listing-card .listing-link"
          ).href;
          const images = getImages(dataJson.link);
          dataJson.images = images;
        } catch (err) {
          console.log(err);
        }
        products.push(dataJson);
      }
      return products;
    });
    await page.close();

    const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
    if (nextPageNumber < Number(lastNumberLi) + 1) {
      const nextUrl = `https://www.etsy.com/shop/atolyeTEE?page=${nextPageNumber}`;
      return partners.concat(await extractPartners(nextUrl));
    } else {
      return partners;
    }
  };

  const browser = await puppeteer.launch();
  const url = "https://www.etsy.com/shop/atolyeTEE?page=16";
  const partners = await extractPartners(url);
  console.log({ partners });
  await browser.close();
  return partners;
};
export default server;
