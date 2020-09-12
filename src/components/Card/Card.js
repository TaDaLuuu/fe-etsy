import React from "react";
import Input from "../Input/Input.js";
import Select from "../Input/Select.js";
const Card = () => {
  return (
    <div className="card mb-5">
      <div className="card-header">Filter</div>
      <div className="card-body">
        <div className="row">
          <div className="col-4">
            <Input placeholder="Search" />
          </div>
          <div className="col-4">
            <Select />
          </div>
          <div className="col-4">
            <button type="button" className="btn btn-primary">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
