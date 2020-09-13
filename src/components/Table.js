import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { ExportToCsv } from "export-to-csv";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import cellEditFactory from "react-bootstrap-table2-editor";

const { SearchBar, ClearSearchButton } = Search;
const products = [];
const { ExportCSVButton } = CSVExport;
function addProducts(quantity) {
  const startId = products.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    products.push({
      id: id,
      name: "Item name " + id,
      image:
        "https://images.unsplash.com/photo-1599687265846-1ead869a1971?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
      price: 2100 + i,
    });
  }
}

addProducts(5);
const pagination = paginationFactory({
  page: 1,
  sizePerPage: 20,
  sizePerPageList: [
    { text: "10", value: 10 },
    { text: "25", value: 25 },
    { text: "50", value: 50 },
    { text: "100", value: 100 },
    { text: "all", value: products.length },
  ],
});

const Table = () => {
  const [rowsDelete, setRowsDelete] = useState([]);
  const [product, setProduct] = useState([
    { id: 1, name: "Tadaluuu", age: 20, check: true },
    { id: 2, name: "Gnas", age: 29, check: false },
    { id: 3, name: "Pica Poca", age: 30, check: false },
    { id: 4, name: "Auspicious", age: 16, check: false },
    { id: 5, name: "Poli.lielove", age: 90, check: true },
  ]);
  const txtTM = ["grandma", "Tada"];
  const [checkTM, setCheckTM] = useState(false);
  console.log();

  const checkTextTM = () => {
    for (let i = 0; i < txtTM.length; i++) {
      if (product[0].name.search(txtTM[i]) >= 0) {
        setCheckTM(true);
        break;
      } else setCheckTM(false);
    }
  };
  useEffect(() => {
    const b = checkTextTM();
    return b;
  });
  const columns = [
    {
      dataField: "id",
      text: "Product ID",
      sort: true,
    },
    {
      dataField: "name",
      text: "Product Name",
      sort: true,
      style: function (cell, row, rowIndex, colIndex) {
        if (cell.search("Tadaluuu") >= 0) {
          return " color: red";
        }
        console.log(cell, row);
      },
    },
    {
      dataField: "age",
      text: "Age",
      sort: true,
    },
    {
      dataField: "image",
      text: "Image",
      sort: true,
      formatter: (cell, row) => {
        return <img src={cell} alt="img" style={{ height: 50 }} />;
      },
    },
    {
      dataField: "check",
      text: "Check",
      sort: true,
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
    clickToSelect: true,
    clickToEdit: true,
    bgColor: "#fe7171",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log({ rowsDelete });
      console.log("id : ", row.id);
      setRowsDelete((rowsDelete) => [...rowsDelete, row.id]);
    },
    //   onSelectAll: (isSelect, rows, e) => {
    //     console.log(isSelect);
    //     console.log(rows);
    //     console.log(e);
    //   },
  };
  // console.log({ rowsDelete });

  const deleteRow = () => {
    const productsCp = product.concat([]);
    const newProducts = productsCp.filter(
      (product) => !rowsDelete.includes(product.id)
    );
    return setProduct(newProducts);
  };
  const check = true;

  return (
    <div>
      <ToolkitProvider
        keyField="id"
        data={product}
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
            <button onClick={deleteRow}>Filter</button>
            <h3>Input something at below input field:</h3>
            <SearchBar {...props.searchProps} placeholder="Search" />
            <ClearSearchButton {...props.searchProps} />
            <hr />
            <BootstrapTable
              {...props.baseProps}
              pagination={pagination}
              cellEdit={cellEditFactory({ mode: "dbclick" })}
              selectRow={selectRow}
            />
          </div>
        )}
      </ToolkitProvider>
    </div>
  );
};

export default Table;
