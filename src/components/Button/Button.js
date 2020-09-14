import React from "react";

const Button = (props) => {
  return (
    <button type="button" class="btn btn-primary">
      {props.label}
    </button>
  );
};
export default Button;
