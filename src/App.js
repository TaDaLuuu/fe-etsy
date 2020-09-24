import React, { useEffect, useState } from "react";
import TableVertical from "./components/TableVertical/TableVertical";
import BootstrapTable from "react-bootstrap-table-next";
import { ExportToCsv } from "export-to-csv";
import ToolkitProvider, {
  ColumnToggle,
  Search,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory, { Type } from "react-bootstrap-table2-editor";
import filterFactory, { selectFilter } from "react-bootstrap-table2-filter";
import { Parser as HtmlToReactParser } from "html-to-react";
import EtsyDataService from "./services/etsy-service";

const { SearchBar, ClearSearchButton } = Search;

function App() {
  const [rowsDelete, setRowsDelete] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [shopProduct, setShopProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [infoProduct, setInfoProduct] = useState([]);
  const [infoShop, setInfoShop] = useState({});
  const [fileTM, setFileTM] = useState("");
  const [newFileTM, setNewFileTM] = useState("");
  const [template, setTemplate] = useState("");

  const getShop = () => {
    EtsyDataService.getAll(valueInput)
      .then((response) => {
        const res = response.data;
        console.log({ res });
        setInfoShop(res.infoShop);
        setProducts(res.listProducts);
        setFileTM(res.fileTM);
        setTemplate(res.fileTemplate);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  console.log({ products });
  const listTM = [];
  const fileTMSplit = fileTM.split("\n");
  fileTMSplit.forEach((e) => listTM.push(e));
  const listTemplate = [];
  const fileTemplateSplit = template.split("\n");
  fileTemplateSplit.forEach((e) => listTemplate.push(e));
  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setNewFileTM(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const uploadFile = () => {
    console.log({ newFileTM });
    EtsyDataService.uploadFileTM(newFileTM)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    sizePerPageList: [
      { text: "10", value: 10 },
      { text: "25", value: 25 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
      { text: "all", value: products.length },
    ],
  });

  const transformedProducts = products.map((product) => {
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
  const arrayTemplate = [];

  listTemplate.forEach((list, index) => {
    const template = [];
    for (let i = 0; i < products.length; i++) {
      const name = list.split(".")[0];
      const fields = list.split(".")[1] || "";
      const listField = fields.split(",") || [];
      let data = {};
      for (let j = 0; j < listField.length; j++) {
        data[`${listField[j]}`] = products[i][`${listField[j]}`];
      }
      template.push(data);
    }
    arrayTemplate.push(template);
  });

  const csvExporter = new ExportToCsv(options);
  arrayTemplate.forEach((e, index) => {});
  const exportCSV1 = () => {
    csvExporter.generateCsv(arrayTemplate[0]);
  };
  const exportCSV2 = () => {
    csvExporter.generateCsv(arrayTemplate[1]);
  };

  const columns = [
    {
      dataField: "id_product",
      text: "Product ID",
      isKey: true,
    },
    {
      dataField: "images_product",
      text: "Image",
      formatter: (cell, row) => {
        const cell1 = cell.slice(2, -2);

        const mapObj = {
          "75x75": "fullxfull",
          "340x270": "fullxfull",
          "180x180": "fullxfull",
        };
        const resizeImages = cell1.replaceAll(
          /75x75|340x270|180x180/gi,
          function (matched) {
            return mapObj[matched];
          }
        );
        const images = resizeImages.split(",");
        const newImages = [];
        let imageMainSrc = "";
        const listImageExtra = [];
        imageMainSrc = images[0].slice(0, -1);
        const listImageExtrasSrc = images.slice(1);
        listImageExtrasSrc.forEach((e) => {
          const img = e.slice(1, -1);
          newImages.push(img);
        });
        const imageMain = (
          <img
            src={imageMainSrc}
            alt="img"
            style={{
              height: 120,
              width: 120,
              objectFit: "cover",
              display: "block",
              marginBottom: 5,
            }}
            className="image-product"
            key={imageMainSrc}
          />
        );
        newImages.forEach((e, index) => {
          listImageExtra.push(
            <img
              key={index}
              src={e}
              alt="img"
              style={{
                height: 60,
                width: 60,
                objectFit: "cover",
                marginRight: 5,
              }}
              className="image-product"
            />
          );
        });
        return [imageMain, listImageExtra];
      },
    },
    {
      dataField: "name",
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
      dataField: "tags",
      text: "Tags",
      formatter: (cell, row) => {
        const htmlInput = `<div>${cell}  ,  </div>`;
        const htmlToReactParser = new HtmlToReactParser();
        return htmlToReactParser.parse(htmlInput);
      },
    },
    {
      dataField: "listing_id",
      text: "Listing ID",
    },
  ];

  const defaultSorted = [
    {
      dataField: "name",
      order: "desc",
    },
  ];
  const selectRow = {
    mode: "checkbox",
    bgColor: "#00BFFF",
    clickToEdit: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (rowsDelete.find((x) => x === row.id_product) !== undefined) {
        const index = rowsDelete.indexOf(row.id_product);
        rowsDelete.splice(index, 1);
        setRowsDelete(rowsDelete);
      } else
        setRowsDelete((rowsDelete) => {
          return [...rowsDelete, row.id_product];
        });
    },
    onSelectAll: (isSelected, rows) => {
      const arrIdProduct = [];
      rows.forEach((e) => arrIdProduct.push(e.id_product));
      setRowsDelete(arrIdProduct);
    },
  };

  const deleteRow = () => {
    const shopProductsCp = products.concat([]);
    const newProducts = shopProductsCp.filter(
      (product) => !rowsDelete.includes(product.id_product)
    );
    console.log({ newProducts });
    return setProducts(newProducts);
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
          <button className="btn btn-success" onClick={getShop}>
            Get
          </button>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-6">
          <TableVertical
            name={infoShop.name}
            sales={infoShop.number_of_sale}
            favourites={infoShop.number_of_favourite}
            title={infoShop.title}
            link={valueInput}
          />
        </div>
        <div className="col-2">
          <input type="file" id="file" onChange={(e) => showFile(e)} />
        </div>
        <div className="col-2">
          <button onClick={uploadFile}>Upload File</button>
        </div>
      </div>

      <ToolkitProvider
        keyField="id"
        data={transformedProducts}
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
              {arrayTemplate.forEach((e) => {
                return (
                  // <div className="col-3">
                  //   <button className="btn btn-info">
                  //     Export CSV by Template 1
                  //   </button>
                  // </div>
                  <h1>adad</h1>
                );
              })}
              {/* <button onClick={exportCSV1} className="btn btn-info">
                  Export CSV by Template 1
                </button>
              </div>
              <div className="col-3">
                <button onClick={exportCSV2} className="btn btn-info">
                  Export CSV by Template 2
                </button> */}

              <div className="col-3">
                <button className="btn btn-info">Add Template</button>
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
              keyField="id_product"
              deleteRow
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
}

export default App;
