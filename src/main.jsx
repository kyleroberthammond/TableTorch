import React from 'react'
import ReactDOM from 'react-dom'
import TableTorch from './TableTorch/entry.jsx'
import _ from 'lodash'





const columns = [
  {
    header: "Name",
    dataKey: "name",
    sort: true,
  },
];

const data = [
  {
    name: "John Doe",
  },
  {
    name: "Jane Doe",
  },
  {
    name: "Jim Doe",
  },
];

ReactDOM.render(<TableTorch columns={columns} data={data} />, document.getElementById("root"));

