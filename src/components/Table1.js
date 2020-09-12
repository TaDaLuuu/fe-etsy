import React from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
// import BootstrapTable from 'react-bootstrap-table-next';
import "react-bootstrap-table/css/react-bootstrap-table.css";

const products = [];
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
const cellEditProp = {
  mode: "click",
  blurToSave: true,
};

const imageFormatter = (cell, row) => {
  console.log({ cell });
  return <img style={{ height: 50 }} src={cell} alt="etsy" />;
};
addProducts(600);

let order = "desc";
export default class CustomPaginationTable extends React.Component {
  renderShowsTotal(start, to, total) {
    return (
      <p style={{ color: "blue" }}>
        From {start} to {to}, totals is {total}&nbsp;&nbsp;
      </p>
    );
  }

  handleBtnClick = () => {
    if (order === "desc") {
      this.refs.table.handleSort("asc", "name");
      order = "asc";
    } else {
      this.refs.table.handleSort("desc", "name");
      order = "desc";
    }
  };
  render() {
    const selectRow = {
      mode: "checkbox", // or checkbox
    };
    const options = {
      page: 2, // which page you want to show as default
      sizePerPageList: [
        {
          text: "10",
          value: 10,
        },
        {
          text: "50",
          value: 50,
        },
        {
          text: "100",
          value: 100,
        },
        {
          text: "All",
          value: products.length,
        },
      ],
      deleteText: "Custom Delete Text",
      exportCSVText: "Custom Export CSV Text",
      sizePerPage: 10, // which size per page you want to locate as default
      pageStartIndex: 0, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "Prev", // Previous page button text
      nextPage: "Next", // Next page button text
      firstPage: "First", // First page button text
      lastPage: "Last", // Last page button text
      prePageTitle: "Go to previous", // Previous page button title
      nextPageTitle: "Go to next", // Next page button title
      firstPageTitle: "Go to first", // First page button title
      lastPageTitle: "Go to Last", // Last page button title
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      paginationPosition: "top", // default is bottom, top and both is all available
    };

    return (
      <BootstrapTable
        data={products}
        pagination={true}
        options={options}
        cellEdit={cellEditProp}
        csvFileName="etsy-listing"
        exportCSV
        selectRow={selectRow}
      >
        <TableHeaderColumn dataField="id" isKey={true}>
          Product ID
        </TableHeaderColumn>

        <TableHeaderColumn
          dataField="image"
          editable={true}
          dataFormat={imageFormatter}
        >
          Image
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" editable={true}>
          Product Name
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" editable={true}>
          Listing ID
        </TableHeaderColumn>
        <TableHeaderColumn dataField="price" dataSort={true}>
          Product Price
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" editable={true}>
          Number of Sales
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" editable={true}>
          Created At
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" editable={true}>
          Updated At
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
