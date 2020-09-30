import React, { useState, useRef, useEffect, useCallback } from "react";
import TableVertical from "./components/TableVertical/TableVertical";
import BootstrapTable from "react-bootstrap-table-next";
import { ExportToCsv } from "export-to-csv";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import configTable from "./config-table";
import cellEditFactory from "react-bootstrap-table2-editor";
import filterFactory from "react-bootstrap-table2-filter";
import EtsyDataService from "./services/etsy-service";
import { Parser as HtmlToReactParser } from "html-to-react";
import { Type } from "react-bootstrap-table2-editor";
import ModalImage from "./components/ModalImage/modal-image";

const { SearchBar, ClearSearchButton } = Search;

function App() {
  const [rowsDelete, setRowsDelete] = useState([]);
  const [valueInput, setValueInput] = useState("");
  const [products, setProducts] = useState([]);
  const [infoShop, setInfoShop] = useState({});
  const [fileTM, setFileTM] = useState("");
  const [newFileTM, setNewFileTM] = useState("");
  const [template, setTemplate] = useState("");
  const [newTemplate, setNewTemplate] = useState("");
  const [currentRow, setCurrentRow] = useState(0);
  const hiddenFileInput = useRef(null);
  const [rowIdProduct, setRowIdProduct] = useState(0);

  useEffect(() => {}, [products]);

  const addImage = () => {
    hiddenFileInput.current.click();
  };

  const getShop = () => {
    EtsyDataService.getAll(valueInput)
      .then((response) => {
        const res = response.data;
        setInfoShop(res.infoShop);
        setProducts(res.listProducts);
        setFileTM(res.fileTM);
        setTemplate(res.fileTemplate);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setCurrentRow(row.id_product);
    },
    onChange: (e, row, rowIndex) => {
      handleChangeImage(e);
    },
  };
  const handleChangeImage = (e) => {
    const imageUpload = e.target.files[0];
    const imageUploadUrl = URL.createObjectURL(imageUpload);
    setProducts(
      products.map((obj, index) => {
        if (obj.id_product === currentRow) {
          obj.images_product = obj.images_product.slice(0, -1);
          obj.images_product = obj.images_product
            .concat(',"')
            .concat(imageUploadUrl)
            .concat('""');
          return obj;
        } else return obj;
      })
    );
    return products;
  };

  const updateDataToDb = () => {
    EtsyDataService.updateDataToDB(products)
      .then((response) => {
        console.log({ response });
        console.log({ products });
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const listTM = [];
  const fileTMSplit = fileTM.split("\n");
  fileTMSplit.forEach((e) => listTM.push(e));
  const listTemplate = [];
  const fileTemplateSplit = template.split("\n");
  fileTemplateSplit.forEach((e) => {
    if (e !== "") {
      listTemplate.push(e);
    }
  });

  const showFileTM = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setNewFileTM(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const showFileTemplate = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      setNewTemplate(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const uploadFile = () => {
    EtsyDataService.uploadFileTM(newFileTM)
      .then((res) => {
        const file = document.getElementById("fileTM");
        file.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addTemplate = () => {
    EtsyDataService.addTemplate(newTemplate)
      .then((res) => {
        const file = document.getElementById("fileTemplate");
        file.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const transformedProducts = () => {
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
    return products;
  };

  const arrayTemplate = [];
  const nameTemplate = [];
  listTemplate.forEach((list, index) => {
    const template = [];
    let name = "";
    for (let i = 0; i < products.length; i++) {
      name = list.split(".")[0];
      const fields = list.split(".")[1] || "";
      const listField = fields.split(",") || [];
      let data = {};
      for (let j = 0; j < listField.length; j++) {
        data[`${listField[j]}`] = products[i][`${listField[j]}`];
      }

      template.push(data);
    }
    nameTemplate.push(name);
    arrayTemplate.push(template);
  });

  const csvExporter = new ExportToCsv(configTable.options());

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
    return setProducts(newProducts);
  };

  const updateDataTable = (e, row, column, newValue) => {
    const data = products.map((obj, index) => {
      if (obj.id_product === row.id_product) {
        if (column.dataField === "name") {
          obj.name = newValue;

          return obj;
        } else {
          obj.tags = newValue;
          return obj;
        }
      } else return obj;
    });
    setProducts(data);
    transformedProducts();
    return products;
  };

  const columns = [
    {
      dataField: "id_product",
      text: "Product ID",
      isKey: true,
      headerStyle: (column, colIndex) => {
        return { width: "1%" };
      },
    },
    {
      dataField: "images_product",
      text: "Image",
      headerStyle: (column, colIndex) => {
        return { width: "34%" };
      },

      formatter: (cell, cellIndex, row) => {
        let cell1 = "";
        const a = cell.search("{undefin");
        const b = cell.search("{,");
        if (a >= 0) {
          cell = cell.replace("{undefin,", "");
          cell = cell.replace('""', '"');
          const x = cell.split(",").length;
          if (x > 1) {
            cell1 = cell.slice(1);
          } else {
            cell1 = cell.slice(1, -1);
          }
        } else if (b >= 0) {
          cell = cell.replace('{,"', "");
          if (cell.split(",").length > 1) {
            cell = cell.slice(0, -1);
            cell1 = cell;
          } else {
            cell = cell.slice(0, -2);
            cell1 = cell;
          }
        } else {
          cell1 = cell.slice(2, -1);
        }

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
        const images = resizeImages.split('",');
        const newImages = [];
        let imageMainSrc = "";
        const listImageExtra = [];
        imageMainSrc = images[0];
        const listImageExtrasSrc = images.slice(1);
        listImageExtrasSrc.forEach((e, index) => {
          if (index >= listImageExtrasSrc.length - 1) {
            const img = e.slice(1, -1);
            newImages.push(img);
          } else {
            const img = e.slice(1);
            newImages.push(img);
          }
        });
        const imageMain = (
          <div style={{ display: "block" }} key={imageMainSrc}>
            <ModalImage
              src={imageMainSrc}
              ratio={`1:1`}
              deleteImage={() => {
                const data = products.map((obj, index) => {
                  if (obj.id_product === cellIndex.id_product) {
                    let x = obj.images_product.split(",");
                    x = x.splice(1);
                    x[0] = "{".concat(x[0]);
                    let a = "";
                    x.forEach((e, xi) => {
                      if (x.length === 1) {
                        a = e.slice(0, -1);
                      } else if (xi >= x.length - 1) {
                        a = a.concat(e);
                      } else {
                        a = a.concat(e).concat(",");
                      }
                    });
                    obj.images_product = a;
                    return obj;
                  } else return obj;
                });
                setProducts(data);
                transformedProducts(products);
                return products;
              }}
            />
          </div>
        );
        newImages.forEach((e, i) => {
          listImageExtra.push(
            <ModalImage
              key={i}
              src={e}
              ratio={`3:2`}
              deleteImage={() => {
                const data = products.map((obj, index) => {
                  if (obj.id_product === cellIndex.id_product) {
                    let x = "";
                    listImageExtrasSrc.splice(i, 1);
                    if (i !== newImages.length - 1) {
                      listImageExtrasSrc[
                        listImageExtrasSrc.length - 1
                      ] = listImageExtrasSrc[
                        listImageExtrasSrc.length - 1
                      ].slice(0, -1);
                    }
                    listImageExtrasSrc.forEach((e, index) => {
                      if (index < listImageExtrasSrc.length - 1) {
                        x = x.concat(e).concat('",');
                      } else {
                        x = x.concat(e);
                      }
                    });
                    const images_product = '{"'
                      .concat(imageMainSrc)
                      .concat('",')
                      .concat(x)
                      .concat('"}');
                    obj.images_product = images_product;
                    return obj;
                  } else return obj;
                });
                setProducts(data);
                transformedProducts();
                return products;
              }}
            />
          );
        });

        const button = (
          <div className="mt-2" key="button-upload">
            <input
              type="file"
              id="imgupload"
              style={{ display: "none" }}
              onChange={handleChangeImage}
              ref={hiddenFileInput}
            />
            <button
              id="OpenImgUpload"
              className="btn btn-info"
              onClick={addImage}
            >
              Image Upload
            </button>
          </div>
        );
        return [imageMain, listImageExtra, button];
      },
    },
    {
      dataField: "name",
      text: "Product Name",
      headerStyle: (column, colIndex) => {
        return { width: "30%" };
      },
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
      headerStyle: (column, colIndex) => {
        return { width: "25%" };
      },
      formatter: (cell, row, column) => {
        const htmlInput = `<div>${cell}</div>`;
        const htmlToReactParser = new HtmlToReactParser();
        return htmlToReactParser.parse(htmlInput);
      },
    },
    {
      dataField: "listing_id",
      text: "Listing ID",
      headerStyle: (column, colIndex) => {
        return { width: "10%" };
      },
    },
  ];
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
          <input type="file" id="fileTM" onChange={(e) => showFileTM(e)} />
        </div>
        <div className="col-2">
          <button onClick={uploadFile} className="btn btn-info">
            Upload File TM
          </button>
        </div>
      </div>
      <ToolkitProvider
        keyField={"table"}
        data={transformedProducts()}
        columns={columns}
        search
        exportCSV={{
          fileName: "etsy.csv",
        }}
        bootstrap4
        defaultSorted={configTable.defaultSorted()}
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
              {arrayTemplate.map((e, index) => {
                return (
                  <div className="col-2" key={index}>
                    <button
                      className="btn btn-info btn-block"
                      onClick={() => {
                        csvExporter.generateCsv(e);
                        updateDataToDb();
                      }}
                    >
                      {nameTemplate[index]}
                    </button>
                  </div>
                );
              })}

              <div className="col-2">
                <input
                  type="file"
                  id="fileTemplate"
                  onChange={(e) => showFileTemplate(e)}
                />
              </div>
              <div className="col-2">
                <button onClick={addTemplate} className="btn btn-info">
                  Add Template
                </button>
              </div>
            </div>
            <hr />
            <BootstrapTable
              {...props.baseProps}
              pagination={configTable.pagination()}
              cellEdit={cellEditFactory({
                mode: "dbclick",
                blurToSave: true,
                beforeSaveCell: (oldValue, newValue, row, column) => {
                  updateDataTable(row, column, newValue);
                },
              })}
              selectRow={selectRow}
              filter={filterFactory()}
              keyField="id_product"
              deleteRow
              rowEvents={rowEvents}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
}

export default App;
