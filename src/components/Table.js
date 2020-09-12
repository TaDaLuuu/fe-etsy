import React, { useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
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
    { id: 1, name: "Tadaluuu", age: 20 },
    { id: 2, name: "Gnas", age: 29 },
    { id: 3, name: "Pica Poca", age: 30 },
    { id: 4, name: "Auspicious", age: 16 },
    { id: 5, name: "Poli.lielove", age: 90 },
  ]);
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
    },
    {
      dataField: "price",
      text: "Product Price",
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
      console.log(row.id);
      console.log(isSelect);
      console.log(rowIndex);
      console.log(e);
      setRowsDelete((rowsDelete) => [...rowsDelete, row.id]);
    },
    //   onSelectAll: (isSelect, rows, e) => {
    //     console.log(isSelect);
    //     console.log(rows);
    //     console.log(e);
    //   },
  };
  console.log({ rowsDelete });

  const deleteRow = () => {
    console.log({ products });
    console.log({ rowsDelete });
  };

  return (
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
          <ExportCSVButton {...props.csvProps}>Export CSV!!</ExportCSVButton>
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
  );
};

export default Table;
