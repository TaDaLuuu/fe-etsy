import React from "react";
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
  return (
    <Table>
      <tr>
        <TH>Name:</TH>
        <TD>Tadaluuu</TD>
      </tr>
      <tr>
        <TH>Telephone:</TH>
        <TD>555 77 854</TD>
      </tr>
      <tr>
        <TH>Telephone:</TH>
        <TD>555 77 855</TD>
      </tr>
    </Table>
  );
};

export default TableVertical;
