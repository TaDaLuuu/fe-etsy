import http from "../http-common";

const getAll = (url) => {
  return http.get("/productsShop", {
    params: {
      url: url,
    },
  });
};

const uploadFileTM = (text) => {
  return http.post("/uploadFileTM", {
    text: text,
  });
};

export default {
  getAll,
  uploadFileTM,
};
