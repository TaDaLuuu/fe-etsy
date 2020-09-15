import http from "../http-common";

const getAll = (url) => {
  return http.get("/god", {
    params: {
      url: url,
    },
  });
};
const getProduct = (url) => {
  return http.get("product", {
    params: {
      url: url,
    },
  });
};
export default {
  getAll,
  getProduct,
};
