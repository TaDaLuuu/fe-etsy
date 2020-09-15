import React from "react";

const InputText = (props) => {
  return (
    <div>
      <input
        type="text"
        className="form-control"
        id="inputText"
        placeholder={props.placeholder}
        value={props.value}
      />
    </div>
  );
};
export default InputText;
