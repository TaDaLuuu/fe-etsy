import React, { useState } from "react";
import TableVertical from "./components/TableVertical/TableVertical";
import BootstrapTable from "react-bootstrap-table-next";
import { ExportToCsv } from "export-to-csv";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import { Parser as HtmlToReactParser } from "html-to-react";
import fileTM from "./fileTM";
import EtsyDataService from "./services/etsy-service";

const { SearchBar, ClearSearchButton } = Search;
function App() {
  const [rowsDelete, setRowsDelete] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [shopProduct, setShopProduct] = useState([]);
  const [nameShop, setNameShop] = useState("GodGroup");
  const [numberOfSalesShop, setNumberOfSalesShop] = useState(0);
  const [numberOfFavourites, setNumberOfFavourites] = useState(0);
  const [titleShop, setTitleShop] = useState("");
  const [product, setProduct] = useState([]);
  const [infoProduct, setInfoProduct] = useState([]);

  const getShop = () => {
    EtsyDataService.getAll(valueInput)
      .then((response) => {
        const res = response.data;

        const listLinks = [];
        res.forEach((e) => listLinks.push(e.link));
        setShopProduct(res);
        getDataProduct(listLinks);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getInfoShop = () => {
    EtsyDataService.getInfoShop(valueInput)
      .then((response) => {
        const res = response.data;
        setNameShop(res.nameShop);
        setNumberOfSalesShop(res.numberOfSaleShops);
        setNumberOfFavourites(res.numberOfFavourites);
        setTitleShop(res.titleShop);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const getInfo = () => {
    getInfoShop();
    getShop();
  };

  const getDataProduct = async (listLinks) => {
    const temp = [];
    for (const ll of listLinks) {
      await EtsyDataService.getProduct(ll)
        .then((res) => {
          temp.push(res.data);
          console.log({ res });
        })
        .catch((error) => {
          console.log(error);
        });
    }
    setInfoProduct(temp);
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 5,
    sizePerPageList: [
      { text: "10", value: 10 },
      { text: "25", value: 25 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      // { text: "all", value: shop.products.length },
    ],
  });

  console.log({ shopProduct });
  const transformedProducts = shopProduct.map((sp) => {
    let html = sp.title;
    fileTM.forEach((e) => {
      if (html.length > 0) {
        html = html.replaceAll(
          e,
          `<span style="background-color: yellow">${e}</span>`
        );
        console.log({ html });
      }
    });

    return {
      ...sp,
      title: html,
    };
  });
  console.log({ transformedProducts });

  const shopProductConcat = transformedProducts.concat([]);
  const infoProductConcat = infoProduct.concat([]);

  infoProductConcat.forEach((e, index) => {
    shopProductConcat[index].img = shopProductConcat[index].img.concat(
      e.arrayImages
    );
    shopProductConcat[index].listingID = e.listingID;
    shopProductConcat[index].listTags = e.listTags;
  });

  const options = {
    fieldSeparator: ",",
    quoteStrings: '"',
    decimalSeparator: ".",
    showLabels: true,
    showTitle: true,
    title: "My Awesome CSV",
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };

  const data1 = [];
  const data2 = [];
  product.map((e) =>
    data1.push({
      id: e.id,
      name: e.name,
      school: "",
      numberOfSales: e.numberOfSales,
      age: "",
      image: e.image,
      check: e.check,
    })
  );
  product.map((e) =>
    data2.push({
      id: e.id,
      name: e.name,
      school: "",
      numberOfSales: e.numberOfSales,
      age: "",
      god: "",
      image: e.image,
      check: e.check,
    })
  );
  const csvExporter = new ExportToCsv(options);
  const exportCSV1 = () => {
    csvExporter.generateCsv(data1);
  };
  const exportCSV2 = () => {
    csvExporter.generateCsv(data2);
  };
  const qualityType = {
    true: "true",
    false: "false",
  };
  const columns = [
    {
      dataField: "id",
      text: "Product ID",
    },
    {
      dataField: "img",
      text: "Image",
      formatter: (cell, row) => {
        console.log({ cell });
        const imageMainSrc = cell[0];
        const listImageExtrasSrc = cell.slice(1);
        const imageMain = (
          <img
            src={imageMainSrc}
            alt="img"
            style={{ height: 100, display: "block", marginBottom: 5 }}
            className="image-product"
            key={imageMainSrc}
          />
        );
        const listImageExtra = [];
        listImageExtrasSrc.forEach((e, index) =>
          listImageExtra.push(
            <img
              key={index}
              src={e}
              alt="img"
              style={{ height: 60, marginRight: 5 }}
              className="image-product"
            />
          )
        );
        return [imageMain, listImageExtra];
      },
    },
    {
      dataField: "title",
      text: "Product Name",
      sort: true,
      classes: "cell-product-name",
      formatter: function (cell, row) {
        const htmlInput = `<div>${cell}</div>`;
        const htmlToReactParser = new HtmlToReactParser();
        return htmlToReactParser.parse(htmlInput);
      },
      editor: {
        type: Type.TEXTAREA,
      },
    },
    {
      dataField: "listTags",
      text: "Tags",
      formatter: (cell, row) => {
        const htmlInput = `<div>${cell} ,  </div>`;
        const htmlToReactParser = new HtmlToReactParser();
        return htmlToReactParser.parse(htmlInput);
      },
    },
    {
      dataField: "check",
      text: "Check",
      sort: true,
      filter: selectFilter({ options: qualityType }),
    },
    { dataField: "listingID", text: "Listing ID " },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const selectRow = {
    mode: "checkbox",
    clickToEdit: true,
    bgColor: "#fe7171",
    onSelect: (row, isSelect, rowIndex, e) => {
      if (rowsDelete.find((e) => e === row.id) !== undefined) {
        const index = rowsDelete.indexOf(row.id);
        rowsDelete.splice(index, 1);
        setRowsDelete(rowsDelete);
      } else
        setRowsDelete((rowsDelete) => {
          return [...rowsDelete, row.id];
        });
    },
  };

  const deleteRow = () => {
    const shopProductsCp = shopProduct.concat([]);
    const newProducts = shopProductsCp.filter(
      (product) => !rowsDelete.includes(product.id)
    );
    return setShopProduct(newProducts);
  };

  return (
    <div className="App" style={{ margin: "20px" }}>
      <h1 className="text-center mb-5">ETSY Listing God Group</h1>
      <div className="row mb-4">
        <div className="col-4">
          <input
            type="text"
            className="form-control"
            id="inputText"
            placeholder="Search"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
          />
        </div>
        <div className="col-1">
          <button className="btn btn-success" onClick={getInfo}>
            Get
          </button>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-6">
          <TableVertical
            name={nameShop}
            sales={numberOfSalesShop}
            favourites={numberOfFavourites}
            title={titleShop}
            link={valueInput}
          />
        </div>
      </div>

      <ToolkitProvider
        keyField="id"
        data={shopProductConcat}
        columns={columns}
        // search
        exportCSV={{
          fileName: "etsy.csv",
        }}
        bootstrap4
        defaultSorted={defaultSorted}
      >
        {(props) => (
          <div>
            <button
              type="button"
              onClick={deleteRow}
              className="btn btn-primary mb-4"
            >
              Filter
            </button>
            <h5 className="mb-3">Input something at below input field:</h5>
            <div className="mb-3">
              <SearchBar {...props.searchProps} placeholder="Search" />
              <ClearSearchButton {...props.searchProps} />
            </div>
            <div className="row">
              <div className="col-3">
                <button onClick={exportCSV1} className="btn btn-info">
                  Export CSV by Template 1
                </button>
              </div>
              <div className="col-3">
                <button onClick={exportCSV2} className="btn btn-info">
                  Export CSV by Template 2
                </button>
              </div>
            </div>
            <hr />
            <BootstrapTable
              {...props.baseProps}
              pagination={pagination}
              cellEdit={cellEditFactory({
                mode: "dbclick",
                blurToSave: true,
              })}
              selectRow={selectRow}
              filter={filterFactory()}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
}

export default App;
