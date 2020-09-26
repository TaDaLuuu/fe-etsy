import React, { useState, useRef, useEffect, useCallback } from "react";
import { Parser as HtmlToReactParser } from "html-to-react";
import { Type } from "react-bootstrap-table2-editor";
import ModalImage from "./components/ModalImage/modal-image";

const Columns = (products) => {
  const [imageAdded, setImageAdded] = useState("");
  const [x, setX] = useState([
    {
      id: 1,
      images_product: "adsas, asdasd,asdads",
    },
    {
      id: 2,
      images_product: "Tadaluuu, dat , MrX2",
    },
  ]);

  // eslint-disable-next-line react-hooks/rules-of-hooks

  return;
};

export default Columns;
