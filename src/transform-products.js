const transformProducts = (products, listTM) => {
  products.map((product) => {
    let html = product.name;
    listTM.forEach((e) => {
      if (html.length > 0) {
        html = html.replaceAll(
          e,
          `<span style="background-color: yellow">${e}</span>`
        );
      }
    });

    return {
      ...product,
      name: html,
    };
  });
};
export default transformProducts;
