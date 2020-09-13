import React from "react";
const Dropdown = () => {
  return (
    <div className="dropdown show">
      <a
        className="btn btn-secondary dropdown-toggle"
        href="#"
        role="button"
        id="dropdownMenuLink"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Template
      </a>

      <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
        <a className="dropdown-item">Template Flag</a>
        <a className="dropdown-item">Another GOD</a>
      </div>
    </div>
  );
};

export default Dropdown;
