import React, { useState } from "react";
import styled from "styled-components";
const TableVertical = () => {
  const Table = styled.table`
    width: 100%;
    border: 1px solid black;
    text-align: center;
  `;
  const TH = styled.th`
    border: 1px solid black;
  `;
  const TD = styled.td`
    border: 1px solid black;
  `;
  const [infoProduct, setInfoProduct] = useState({
    name: "atolyeTEE",
    link: "https://www.etsy.com/shop/atolyeTEE",
    title: "trendy + basic",
    views: 54574,
    sales: 1715,
    favourites: 398,
  });
  Object.size = function (obj) {
    var size = 0,
      key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };
  return (
    <Table>
      <tr>
        <TH>Name:</TH>
        <TD>{infoProduct.name}</TD>
      </tr>
      <tr>
        <TH>Link:</TH>
        <TD>{infoProduct.link}</TD>
      </tr>
      <tr>
        <TH>Title:</TH>
        <TD>{infoProduct.title}</TD>
      </tr>
      <tr>
        <TH>Views:</TH>
        <TD>{infoProduct.views}</TD>
      </tr>
      <tr>
        <TH>Sales:</TH>
        <TD>{infoProduct.sales}</TD>
      </tr>
      <tr>
        <TH>Favourites:</TH>
        <TD>{infoProduct.favourites}</TD>
      </tr>
    </Table>
  );
};

export default TableVertical;
