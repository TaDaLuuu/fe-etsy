import paginationFactory from "react-bootstrap-table2-paginator";
const pagination = () => {
  return paginationFactory({
    page: 1,
    sizePerPage: 10,
    sizePerPageList: [
      { text: "10", value: 10 },
      { text: "25", value: 25 },
      { text: "50", value: 50 },
      { text: "100", value: 100 },
    ],
  });
};

const options = () => ({
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  showTitle: true,
  title: "My Awesome CSV",
  useTextFile: false,
  useBom: true,
  useKeysAsHeaders: true,
});
const defaultSorted = () => [
  {
    dataField: "name",
    order: "desc",
  },
];

export default { pagination, options, defaultSorted };
