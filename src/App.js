import React from "react";
import TableVertical from "./components/TableVertical/TableVertical";
import Card from "./components/Card/Card.js";
import CustomPaginationTable from "./components/Table.js";

function App() {
  return (
    <div className="App" style={{ margin: "20px" }}>
      <h1 className="text-center mb-5">ETSY Listing God Group</h1>
      <div className="row mb-5">
        <div className="col-6 offset-3">
          <TableVertical />
        </div>
      </div>
      <Card />
      <CustomPaginationTable />
    </div>
  );
}

export default App;
