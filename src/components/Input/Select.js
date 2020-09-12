import React from "react";

const Select = () => {
  return (
    <div className="input-group">
      <select className="custom-select" id="inputGroupSelect">
        <option selected>Sort...</option>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>
  );
};

export default Select;
