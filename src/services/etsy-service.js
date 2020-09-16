import http from "../http-common";

const getAll = (url) => {
  return http.get("/god", {
    params: {
      url: url,
    },
  });
};
const getProduct = (url) => {
  return http.get(`/product?url=${url}`);
};
const getInfoShop = (url) => {
  return http.get(`/infoShop?url=${url}`);
};
export default {
  getAll,
  getProduct,
  getInfoShop,
};
