import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { ExportToCsv } from "export-to-csv";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import { Parser as HtmlToReactParser } from "html-to-react";
import fileTM from "../fileTM.js";
import EtsyDataService from "../services/etsy-service";

const { SearchBar, ClearSearchButton } = Search;

const Table = () => {
  const [rowsDelete, setRowsDelete] = useState([]);
  const [shop, setShop] = useState([]);
  const [product, setProduct] = useState([]);
  useEffect(() => {
    getShop();
  }, []);
  useEffect(() => {
    getProduct();
  }, []);

  const getShop = () => {
    EtsyDataService.getAll("https://www.etsy.com/shop/atolyeTEE")
      .then((response) => {
        setShop(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getProduct = () => {
    EtsyDataService.getProduct()
      .then((response) => {
        setProduct(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 20,
    sizePerPageList: [
      { text: "10", value: 10 },
      { text: "25", value: 25 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "all", value: product.length },
    ],
  });
  const transformedProducts = product.map((product) => {
    let html = product.title;
    fileTM.forEach((e) => {
      if (html.length > 0) {
        html = html.replaceAll(
          e,
          `<span style="background-color: yellow">${e}</span>`
        );
      }
    });

    return {
      ...product,
      title: html,
    };
  });
  const info = transformedProducts.concat([]);
  const infoEachProduct = product.concat([]);
  infoEachProduct.forEach((e, index) => {
    info[index].image = info[index].image.concat(e.imageProduct);
    info[index].listingID = e.listingID;
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
      sort: true,
    },
    {
      dataField: "imageProduct",
      text: "Image",
      sort: true,
      formatter: (cell, row) => {
        const a = row.image.concat([]);
        const imageMain = row.image[0];
        const c = (
          <img
            src={imageMain}
            alt="img"
            style={{ height: 100, display: "block", marginBottom: 5 }}
            className="image-product"
            key={imageMain}
          />
        );
        a.splice(0, 1);
        const b = [];
        a.forEach((e, index) =>
          b.push(
            <img
              key={index}
              src={e}
              alt="img"
              style={{ height: 40, marginRight: 5 }}
              className="image-product"
            />
          )
        );
        return [c, b];
      },
    },
    {
      dataField: "title",
      text: "Product Name",
      sort: true,
      classes: "cell-product-name",
      formatter: function (cell, row) {
        var htmlInput = `<div>${cell}</div>`;
        var htmlToReactParser = new HtmlToReactParser();
        return htmlToReactParser.parse(htmlInput);
      },
      editor: {
        type: Type.TEXTAREA,
      },
    },
    {
      dataField: "numberOfSales",
      text: "Number Of Sales",
      sort: true,
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
    const productsCp = product.concat([]);
    const newProducts = productsCp.filter(
      (product) => !rowsDelete.includes(product.id)
    );
    return setProduct(newProducts);
  };

  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={info}
        columns={columns}
        search
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
};

export default Table;
