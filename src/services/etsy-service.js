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

const addTemplate = (text) => {
  return http.post("/addTemplate", {
    text: text,
  });
};

const updateDataToDB = (products) => {
  return http.put("/updateDataToDB", {
    products: products,
  });
};

export default {
  getAll,
  uploadFileTM,
  addTemplate,
  updateDataToDB,
};
