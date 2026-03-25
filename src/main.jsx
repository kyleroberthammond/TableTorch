import React from 'react'
import ReactDOM from 'react-dom'
import TableTorch from './TableTorch/entry.jsx'
import _ from 'lodash'


// Extending lodash
const isNotEmpty = (value) => {
    if (_.isArray(value)) {
      if (_.isEmpty(value)) {
        return false;
      } else {
        return !_.some(value, (v) => _.isEmpty(v));
      }
    } else {
      return !_.isEmpty(value);
    }
  };
  
  const isPresent = (value) => {
    return !_.isEmpty(value);
  };
  
  
  const sortByKeys = (object, comparator, direction = "ASC") => {
    var sortedKeys = _.orderBy(
      _.keys(object),
      function (key) {
        return comparator ? comparator(object[key], key) : key;
      },
      direction
    );
  
    const mappedKeysValues = _.map(sortedKeys, (key) => [` ${key}`, object[key]]);
    return _.fromPairs(mappedKeysValues);
  };
  
  _.mixin({ isNotEmpty: isNotEmpty, sortByKeys: sortByKeys, isPresent: isPresent });


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

