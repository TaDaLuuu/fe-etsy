function loadTxt(fileDataTxt) {
  const listTM = [];
  fetch(fileDataTxt)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      const dataSplit = data.split("\n");
      dataSplit.forEach((e) => listTM.push(e));
      return listTM;
    })
    .catch(function (e) {
      console.log(e);
    });
  return listTM;
}

export default loadTxt;
