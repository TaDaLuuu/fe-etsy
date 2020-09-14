import React from "react";
import TableVertical from "./components/TableVertical/TableVertical";
// import Card from "./components/Card/Card.js";
import CustomPaginationTable from "./components/Table.js";
import Input from "./components/Input/Input";

function App() {
  return (
    <div className="App" style={{ margin: "20px" }}>
      <h1 className="text-center mb-5">ETSY Listing God Group</h1>
      <div className="row mb-4">
        <div className="col-4">
          <Input placeholder="Search" />
        </div>
        <div className="col-1">
          <button className="btn btn-success">Get</button>
        </div>
      </div>

      <div className="row mb-5">
        <div className="col-6">
          <TableVertical />
        </div>
      </div>

      <CustomPaginationTable />
    </div>
  );
}

export default App;
