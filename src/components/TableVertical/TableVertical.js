import React from "react";
import styled from "styled-components";
const TableVertical = (props) => {
  const Table = styled.table`
    width: 100%;
    border: 1px solid black;
    text-align: center;
  `;
  const TH = styled.th`
    width: 40%;
    border: 1px solid black;
  `;
  const TD = styled.td`
    width: 60%;
    border: 1px solid black;
  `;

  return (
    <Table>
      <tbody>
        <tr>
          <TH>Name:</TH>
          <TD>{props.name}</TD>
        </tr>
        <tr>
          <TH>Link:</TH>
          <TD>{props.link}</TD>
        </tr>
        <tr>
          <TH>Title:</TH>
          <TD>{props.title}</TD>
        </tr>
        <tr>
          <TH>Sales:</TH>
          <TD>{props.sales}</TD>
        </tr>
        <tr>
          <TH>Favourites:</TH>
          <TD>{props.favourites}</TD>
        </tr>
      </tbody>
    </Table>
  );
};

export default TableVertical;
