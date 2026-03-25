/**
 * A table component that allows filtering, sorting, and customization of columns and data.
 *
 * @param {Object} props - The props object.
 * @param {string} [props.tableClassName="table_torch"] - The class name for the table.
 * @param {Object} [props.tableStyle={}] - The style object for the table.
 * @param {boolean} [props.selectable=true] - If selectable or not used for selecting rows. Use onSelect to get the selected rows.
 * @param {Function} [props.onSelect] - The function that returns the selected rows.
 * @param {boolean} [props.showFilters=true] - Whether to show filters for each column.
 * @param {boolean} [props.showCount=true] - Whether to show the count of the data.
 * @param {boolean} [props.showHeaders=true] - Whether to show the table headers.
 * @param {Object} [props.rowStyle={}] - The style object for each row.
 * @param {string} [props.className=""] - The class name for the table.
 * @param {Array} props.columns - The array of column objects.
 * @param {Array} props.data - The array of data objects.
 * @param {Function} [props.childComponent=null] - The function that returns the child component for each row.
 * @returns {JSX.Element} - The table component.
 */

// Example usage:
// import { TableTorch } from "modules/5_view_helpers/web";
//
// const columns = [
//   {
//     header: "Name",
//     dataKey: "name",
//     sort: true,
//     cellRenderer: (dataCell, dataRow) => {
//       return <div>{dataCell}</div>;
//     },
//   },
//   {
//     header: "Email",
//     dataKey: "email",
//     sort: true,
//     cellRenderer: (dataCell, dataRow) => {
//       return <div>{dataCell}</div>;
//     },
//   },
//   {
//     header: "Phone",
//     dataKey: "phone",
//     sort: true,
//     cellRenderer: (dataCell, dataRow) => {
//       return <div>{dataCell}</div>;
//     },
//   },
// ];
//
// const data = [
//   {
//     name: "John Doe",
//     email: "john.doe@gmail",
//     phone: "123-456-7890",
//   },
//   {
//     name: "Jane Doe",
//     email: "jane.doe@gmail",
//     phone: "123-456-7890",
//   },
// ];
//
// const Example = (props) => {
//   return (
//     <TableTorch
//       columns={columns}
//       data={data}
//       showFilters={true}
//       showCount={true}
//       showHeaders={true}
//       selectable={true}
//       rowStyle={(dataRow) => {
//         return { backgroundColor: dataRow.name === "John Doe" ? "red" : "white" };
//       }}
//       childComponent={(dataRow) => {
//         return <div>{dataRow.name}</div>;
//       }}
//     />
//   );
// };
//
// export default Example;

import React, { Fragment, useState, useMemo, useEffect } from "react";
import "./TableTorch.css";
import Select from "react-select";

import { Button, ButtonGroup, Col, FormGroup, Label, Modal, ModalBody, ModalHeader, Popover, PopoverBody, PopoverHeader, Row } from "reactstrap";
import { Field, Form } from "react-final-form";
import ToggleField from "./ToggleField";
import _ from "lodash";
import qs from "query-string";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

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

function Chip({ label, onDelete, variant: _variant, className = "", style, ...rest }) {
  return (
    <span
      className={`table-torch-chip ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 16,
        fontSize: 13,
        lineHeight: 1.25,
        ...style,
      }}
      {...rest}
    >
      <span>{label}</span>
      {onDelete ? (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Remove"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "0 0 0 4px",
            margin: 0,
            fontSize: 18,
            lineHeight: 1,
            color: "inherit",
          }}
        >
          ×
        </button>
      ) : null}
    </span>
  );
}

const TableTorch = (props) => {
  const [filterValues, setFilterValues] = useState([]); // Filter values
  const [sortObject, setSortObject] = useState({}); // Sort values
  const [groupByPopoverOpen, setGroupByPopoverOpen] = useState(false); // Group by popover
  const toggleGroupByPopover = () => setGroupByPopoverOpen(!groupByPopoverOpen); // Toggle group by popover
  const [showReportModal, setShowReportModal] = useState(false); // Report modal
  const toggleReportModal = () => setShowReportModal(!showReportModal); // Toggle report modal

  const [showExportModal, setShowExportModal] = useState(false); // Export modal
  const toggleExportModal = () => setShowExportModal(!showExportModal); // Toggle export modal

  const [selectedRows, setSelectedRows] = useState([]); // Selected rows
  const { selectedRowsOverride, setSelectedRowsOverride } = props;

  const setActualRowsSelected = setSelectedRowsOverride || setSelectedRows;
  const actualSelectedRows = selectedRowsOverride || selectedRows;

  const { tableClassName, tableStyle } = props; // Style related props
  const {
    showFilters,
    showCount,
    showHeaders,
    rowStyle,
    className,
    selectable,
    onSelect,
    showCreateReport,
    reportURL,
    showGroupBy,
    showExportButton,
    reportModalButtonLabel,
    reportModal,
    initialGroupBy,
    showGroupByAtTop,
  } = props; // Table configuration props
  const { columns, data, childComponent } = props; // Data related props
  const [groupBy, setGroupBy] = useState(initialGroupBy); // Group by values

  // Validate the columns prop.
  if (!data) {
    throw new Error("TableTorch: data prop is required");
  }
  if (!columns) {
    throw new Error("TableTorch: columns prop is required");
  }

  if (showCreateReport && !reportURL) {
    throw new Error("TableTorch: reportURL prop is required when showCreateReport is true");
  }

  // Filter the data based on the filter values.
  const onFilterChange = (event, dataKey) => {
    const { value } = event.target;
    setFilterValues({ ...filterValues, [dataKey]: value });
  };
  let dataToDisplay = _.toArray(data);
  if (filterValues) {
    _.each(filterValues, (filter, dataKey) => {
      dataToDisplay = _.filter(dataToDisplay, (dataRow) => {
        if (filter) {
          const findColumn = columns.find((col) => col.dataKey === dataKey);
          let dataCell;
          if (findColumn.cellRenderer) {
            dataCell = findColumn.cellRenderer(_.get(dataRow, dataKey), dataRow);
          } else {
            dataCell = _.get(dataRow, dataKey);
          }

          // Enable the ability to filter by multiple values using a comma separated string.
          const filterValue = filter?.toString().toLowerCase().split(",");
          return _.some(filterValue, (filterValue) => {
            if (filterValue === "") {
              return false;
            } else {
              return _.includes(dataCell?.toString().toLowerCase(), filterValue);
            }
          });

          // return _.includes(dataCell?.toString().toLowerCase(), filter?.toString().toLowerCase());
        } else {
          return true;
        }
      });
    });
  }
  // Filter the data based on the filter values.

  // Sort the data based on the sort values.
  if (sortObject) {
    const { name, direction } = sortObject;
    if (name && direction) {
      if (sortObject.sortValueFunc) {
        dataToDisplay = _.orderBy(dataToDisplay, (dataRow) => sortObject.sortValueFunc(_.get(dataRow, name), dataRow), [direction]);
      } else {
        dataToDisplay = _.orderBy(dataToDisplay, [name], [direction]);
      }
    }
  }

  const isGrouped = _.isNotEmpty(groupBy);
  let groupedData = [];

  // Group By using lodash
  if (_.isNotEmpty(groupBy)) {
    const groupByDataKeys = _.map(groupBy, "value");
    groupedData = _.groupBy(dataToDisplay, (dataRow) => {
      return _.map(groupByDataKeys, (dataKey) => {
        const findColumn = columns.find((col) => col.dataKey === dataKey);
        let value = _.get(dataRow, dataKey);
        if (findColumn?.cellRenderer) {
          value = findColumn?.cellRenderer(value, dataRow);
        }

        return `${findColumn?.header} - ${value}`;
      });
    });
  }

  if (isGrouped) {
    dataToDisplay = groupedData;
  }
  // Calculate the count of the data to display.
  const count = useMemo(() => {
    return _.size(dataToDisplay);
  }, [dataToDisplay]);
  // Calculate the count of the data to display.

  // Send onSelect event to parent component
  useEffect(() => {
    if (onSelect) {
      onSelect(selectedRows);
    }
  }, [selectedRows]);

  return (
    <Fragment>
      <Row>
        {showCount && (
          <Col md={2}>
            <b>Count : {count}</b>
          </Col>
        )}

        {showGroupByAtTop && isGrouped && (
          <Col>
            <GroupByDisplay
              groupBy={groupBy}
              removeGroupBy={(groupByToRemove) => {
                const newGroupBy = _.filter(groupBy, (group) => group.value !== groupByToRemove.value);
                setGroupBy(newGroupBy);
              }}
            />
          </Col>
        )}

        {actualSelectedRows.length > 0 && (
          <Col className="mr-5">
            <b>Selected : {actualSelectedRows.length}</b>
          </Col>
        )}

        {showCreateReport && (
          <Col className="text-right mr-2 mb-2">
            <Button
              size="sm"
              onClick={
                reportModal
                  ? toggleReportModal
                  : () => {
                    const selectedIDS = _.map(actualSelectedRows, "id");
                    const newOptions = { id: selectedIDS };
                    const query = qs.stringify(newOptions, { arrayFormat: "comma" });
                    window.open(`${reportURL}?${query}`);
                  }
              }
              color="success"
            >
              {" "}
              {reportModalButtonLabel}
            </Button>
          </Col>
        )}
        {showExportButton && (
          <div className="text-right mb-2 mr-1">
            <FontAwesomeIcon icon={faFileExport} title="Export to excel" style={{ cursor: "pointer" }} onClick={toggleExportModal} />
          </div>
        )}
        {showGroupBy && (
          <div className="text-right mr-3" id="GroupByPopover">
            <FontAwesomeIcon icon={faLayerGroup} title="Group By" style={{ cursor: "pointer" }} onClick={toggleGroupByPopover} />
          </div>
        )}
      </Row>

      {showGroupBy && (
        <GroupByPopover
          columns={columns}
          onChange={setGroupBy}
          groupBy={groupBy}
          isOpen={groupByPopoverOpen}
          toggle={() => setGroupByPopoverOpen(!groupByPopoverOpen)}
        />
      )}

      <table className={`${tableClassName} ${className}`} style={tableStyle}>
        <thead>
          {showHeaders && (
            <RenderHeader
              columns={columns}
              showFilters={showFilters}
              showCount={showCount}
              count={count}
              onFilterChange={onFilterChange}
              childComponent={childComponent}
              sortObject={sortObject}
              setSortObject={setSortObject}
              selectable={selectable}
              isGrouped={isGrouped}
              selectedRows={actualSelectedRows}
              dataToDisplay={dataToDisplay}
              onSelect={(e) => {
                let dataToSelect = dataToDisplay;
                if (isGrouped) {
                  dataToSelect = _.flatMap(dataToDisplay, (dataRow) => dataRow);
                }
                if (e.target.checked) {
                  const merged = _.uniqBy([...actualSelectedRows, ...dataToSelect], "id");
                  setActualRowsSelected(merged);
                } else {
                  setActualRowsSelected(_.difference(actualSelectedRows, dataToSelect));
                }
              }}
            />
          )}
        </thead>
        <tbody>
          {_.map(dataToDisplay, (dataRow, i) => {
            return (
              <RenderRow
                key={i}
                keyName={i}
                dataRow={dataRow}
                columns={columns}
                childComponent={childComponent}
                rowStyle={rowStyle}
                isGrouped={isGrouped}
                selectable={selectable}
                selectedRows={actualSelectedRows}
                onSelect={(e) => {
                  let dataToSelect = dataRow;
                  if (isGrouped) {
                    dataToSelect = _.map(dataRow, (dataRow) => dataRow);
                    if (e.target.checked) {
                      setActualRowsSelected([...actualSelectedRows, ...dataToSelect]);
                    } else {
                      setActualRowsSelected(_.difference(actualSelectedRows, dataToSelect));
                    }
                  } else {
                    if (e.target.checked) {
                      setActualRowsSelected([...actualSelectedRows, dataToSelect]);
                    } else {
                      setActualRowsSelected(actualSelectedRows.filter((row) => row !== dataToSelect));
                    }
                  }
                }}
              />
            );
          })}
        </tbody>
      </table>

      {showReportModal && (
        <ReportModal
          isOpen={showReportModal}
          selectedRows={actualSelectedRows}
          reportModalButtonLabel={reportModalButtonLabel}
          columns={columns}
          reportURL={reportURL}
          toggle={toggleReportModal}
        />
      )}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          selectedRows={actualSelectedRows}
          columns={columns}
          reportURL={reportURL}
          toggle={toggleExportModal}
          data={dataToDisplay}
        />
      )}
    </Fragment>
  );
};

TableTorch.defaultProps = {
  columns: [],
  tableClassName: "table_torch",
  childOptions: {},
  showFilters: true,
  showCount: true,
  showHeaders: true,
  selectable: false,
  showGroupBy: true,
  showExportButton: true,
  showGroupByAtTop: true,
  reportModalButtonLabel: "Get Report",
  reportModal: true,
  initialGroupBy: [],
};

export default TableTorch;

const RenderHeader = (props) => {
  const {
    columns,
    showFilters,
    onFilterChange,
    childComponent,
    sortObject,
    setSortObject,
    selectable,
    onSelect,
    isGrouped,
    selectedRows,
    dataToDisplay,
  } = props;

  const allSelected = _.every(dataToDisplay, (dataRow) => {
    if (isGrouped) {
      return _.some(dataRow, (row) => {
        return _.includes(selectedRows, row);
      });
    } else {
      return _.includes(selectedRows, dataRow);
    }
  });

  return (
    <Fragment>
      {showFilters && (
        <tr>
          {selectable && <th style={{ width: "3%", textAlign: "center" }}></th>}
          {isGrouped && <th style={{ width: "2%" }}></th>}
          {childComponent && <th style={{ width: "5%" }}></th>}
          {_.map(columns, (col, i) => {
            return (
              <th key={i} className={col.className} style={col.headerStyle} colSpan={col.colSpan}>
                {!col.hideFilter && (
                  <input
                    type="string"
                    onChange={(e) => {
                      onFilterChange(e, col.dataKey);
                    }}
                    placeholder={col.filterPlaceholder || `Search ${col.header || col.dataKey}...`}
                    style={{ width: "100%" }}
                  />
                )}
              </th>
            );
          })}
        </tr>
      )}

      <tr>
        {selectable && (
          <th style={{ width: "3%", textAlign: "center" }}>
            <input type="checkbox" onChange={onSelect} checked={allSelected} />
          </th>
        )}
        {isGrouped && <th style={{ width: "2%" }}></th>}
        {childComponent && <th style={{ width: "5%" }}></th>}
        {_.map(columns, (col, i) => {
          let colStyle = { ...col.style };
          let onClickHandler = null;
          if (col.sort) {
            colStyle = { ...colStyle, cursor: "pointer" };
            onClickHandler = (e) => {
              let newSortObject;
              if (sortObject.name == col.dataKey) {
                newSortObject = { name: col.dataKey, direction: sortObject.direction == "asc" ? "desc" : "asc" };
              } else {
                newSortObject = { name: col.dataKey, direction: "asc" };
              }
              if (col.sortValueFunc) {
                newSortObject.sortValueFunc = col.sortValueFunc;
              }
              setSortObject(newSortObject);
            };
          }

          return (
            <th key={i} className={col.className} style={colStyle} colSpan={col.colSpan} onClick={onClickHandler}>
              {col.header || col.dataKey}
              {col.sort && sortObject.name === col.dataKey && <span style={{ marginLeft: "5px" }}>{sortObject.direction === "asc" ? "▲" : "▼"}</span>}
            </th>
          );
        })}
      </tr>
    </Fragment>
  );
};

const RenderRow = (props) => {
  const { dataRow, columns, rowStyle, childComponent, selectable, selectedRows, onSelect, isGrouped, isGroupedData, keyName } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);

  let calculatedStyle = (_.isFunction(rowStyle) && rowStyle(dataRow)) || {};
  let selected;

  if (isGrouped) {
    selected = _.some(selectedRows, (selectedRow) => {
      return _.some(dataRow, (row) => {
        return selectedRow.id == row.id;
      });
    });
  } else {
    selected = _.includes(selectedRows, dataRow);
  }

  if (selected) {
    calculatedStyle = { ...calculatedStyle, backgroundColor: "lightblue" };
  }

  let hasChildData = false;
  if (childComponent) {
    hasChildData = childComponent(dataRow);
  }

  return (
    <Fragment>
      <tr style={calculatedStyle}>
        {selectable && (
          <td style={{ width: "3%", textAlign: "center" }}>
            <input type="checkbox" onChange={onSelect} checked={selected} />
          </td>
        )}
        {isGrouped && (
          <td
            style={{ cursor: "pointer" }}
            className="text-center"
            onClick={() => {
              setGroupOpen(!groupOpen);
            }}
          >
            {groupOpen ? "-" : "+"}
          </td>
        )}
        {/* if its grouped data add an extra col to cover the + and - */}
        {isGroupedData && <td style={{ width: "2%" }}></td>}
        {/* // If the table has child columns, render a column to show/hide the child data. */}
        {childComponent && (
          <td
            style={{ cursor: hasChildData ? "pointer" : "" }}
            onClick={() => {
              hasChildData && setIsOpen(!isOpen);
            }}
          >
            {hasChildData && <div>{isOpen ? "-" : "+"}</div>}
          </td>
        )}

        {isGrouped && (
          <td colSpan={columns.length}>
            {keyName} - Count : <b>{_.size(dataRow)}</b>
          </td>
        )}

        {!isGrouped && (
          <Fragment>
            {_.map(columns, (col, i) => {
              // Use lodash to get the data for the cell. This allows for nested data keys.
              const dataCell = _.get(dataRow, col.dataKey);

              // If the column has a cellRenderer, use it to render the cell.
              if (col.cellRenderer) {
                return (
                  <td key={i} className={col.className} style={col.cellStyle} colSpan={col.colSpan}>
                    {col.cellRenderer(dataCell, dataRow)}
                  </td>
                );
              } else {
                // Otherwise, just render the data.
                return (
                  <td key={i} className={col.className} style={col.cellStyle} colSpan={col.colSpan}>
                    {dataCell}
                  </td>
                );
              }
            })}
          </Fragment>
        )}
      </tr>

      {isGrouped && groupOpen && (
        <Fragment>
          {_.map(dataRow, (dataRow, i) => {
            return (
              <RenderRow
                key={i}
                keyName={i}
                dataRow={dataRow}
                columns={columns}
                childComponent={childComponent}
                rowStyle={rowStyle}
                isGrouped={false}
                isGroupedData={true}
                selectable={selectable}
                selectedRows={selectedRows}
                onSelect={onSelect}
              />
            );
          })}
        </Fragment>
      )}
      {isOpen && (
        <tr>
          <td colSpan={columns.length + 1}>{childComponent(dataRow)}</td>
        </tr>
      )}
    </Fragment>
  );
};

const ReportModal = (props) => {
  const { isOpen, toggle, selectedRows, reportURL, columns, reportModalHeaderLabel, reportModalButtonLabel } = props;

  return (
    <Modal size="lg" isOpen={isOpen} toggle={toggle}>
      <ModalHeader>{reportModalHeaderLabel} Report Options</ModalHeader>
      <ModalBody>
        <Form
          onSubmit={(options) => {
            const selectedIDS = _.map(selectedRows, "id");
            const newOptions = { ...options, id: selectedIDS };
            const query = qs.stringify(newOptions, { arrayFormat: "comma" });
            window.open(`${reportURL}?${query}`);
          }}
          render={({ handleSubmit }) => {
            let columns_filtered = _.filter(columns, (col) => col.print !== false);
            columns_filtered = _.filter(columns_filtered, (col) => !col.disableReportOption);
            const pairs = _.chunk(columns_filtered, 2);

            return (
              <form onSubmit={handleSubmit}>
                {_.map(pairs, (pair, i) => {
                  return (
                    <FormGroup key={i} row>
                      {_.map(pair, (col, j) => {
                        return (
                          <Fragment key={j}>
                            <Label md={3}>{col.header || col.dataKey}</Label>
                            <Col md={3}>
                              <Field name={col.dataKey} component={ToggleField} defaultValue={true} />
                            </Col>
                          </Fragment>
                        );
                      })}
                    </FormGroup>
                  );
                })}

                <hr />
                <ButtonGroup row>
                  <Button onClick={handleSubmit} color="success">
                    {reportModalButtonLabel}
                  </Button>
                </ButtonGroup>
              </form>
            );
          }}
        />
      </ModalBody>
    </Modal>
  );
};

const GroupByPopover = (props) => {
  const { isOpen, toggle, columns, groupBy, onChange } = props;

  const groupableColumns = _.filter(columns, (col) => col.print !== false);

  return (
    <Popover style={{ width: "600px" }} trigger="legacy" toggle={toggle} isOpen={isOpen} target="GroupByPopover">
      <PopoverHeader>
        <b>Group By Column</b>
      </PopoverHeader>
      <PopoverBody>
        <Select
          options={_.map(groupableColumns, (col) => ({ label: col.header || col.dataKey, value: col.dataKey }))}
          value={groupBy}
          onChange={(values) => {
            onChange(values);
          }}
          isMulti
        />
      </PopoverBody>
    </Popover>
  );
};

const ExportModal = (props) => {
  const { isOpen, toggle, selectedRows, columns, reportModalHeaderLabel, data } = props;
  const selectedIDS = _.map(selectedRows, "id");

  const exportData = (options) => {
    const filteredOptions = _.pickBy(options, (option) => option == true);
    const filteredOptionsKeys = _.keys(filteredOptions);

    let filteredData = _.cloneDeep(data);
    // Filter the data if selected rows are present
    if (selectedIDS.length > 0) {
      filteredData = _.filter(filteredData, (dataRow) => {
        return _.includes(selectedIDS, dataRow.id);
      });
    }

    const dataToExport = _.map(filteredData, (dataRow) => {
      let filterDataRow = _.pick(dataRow, filteredOptionsKeys);
      const newDataRow = _.mapValues(filterDataRow, (value, key) => {
        const findColumn = _.find(columns, (col) => col.dataKey == key);
        let returnValue = value;
        if (findColumn.cellRenderer) {
          returnValue = findColumn.cellRenderer(value, dataRow);
        }

        // Convert a hrefs to a link object
        if (returnValue && returnValue.$$typeof === Symbol.for("react.element")) {
          if (returnValue.type == "a") {
            returnValue = returnValue?.props?.children;
          }
        }
        // Convert a hrefs to a link object
        return returnValue;
      });

      return newDataRow;
    });

    const firstKeys = _.keys(dataToExport[0]);
    const findColumns = _.filter(columns, (col) => _.includes(firstKeys, col.dataKey));
    const columnHeaders = _.map(findColumns, (col) => col.header || col.dataKey);

    // // Convert to sheet with custom headers
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // // Replace the top row with your custom labels
    XLSX.utils.sheet_add_aoa(worksheet, [columnHeaders], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "People");

    XLSX.writeFile(workbook, "export.xlsx");
  };

  return (
    <Modal size="lg" isOpen={isOpen} toggle={toggle}>
      <ModalHeader>{reportModalHeaderLabel} Export Columns</ModalHeader>
      <ModalBody>
        <Form
          onSubmit={exportData}
          render={({ handleSubmit }) => {
            const columns_filtered = _.filter(columns, (col) => col.export !== false);
            const pairs = _.chunk(columns_filtered, 2);

            return (
              <form onSubmit={handleSubmit}>
                {_.map(pairs, (pair, i) => {
                  return (
                    <FormGroup key={i} row>
                      {_.map(pair, (col, j) => {
                        return (
                          <Fragment key={j}>
                            <Label md={3}>{col.header || col.dataKey}</Label>
                            <Col md={3}>
                              <Field name={col.dataKey} component={ToggleField} defaultValue={true} />
                            </Col>
                          </Fragment>
                        );
                      })}
                    </FormGroup>
                  );
                })}

                <hr />
                <ButtonGroup row>
                  <Button onClick={handleSubmit} color="success">
                    Export
                  </Button>
                </ButtonGroup>
              </form>
            );
          }}
        />
      </ModalBody>
    </Modal>
  );
};

const GroupByDisplay = (props) => {
  const { groupBy, removeGroupBy } = props;

  return (
    <div>
      <b className="mr-2">Grouped By :</b>
      {_.map(groupBy, (groupBy, i) => {
        return (
          <Chip
            variant="outlined"
            key={i}
            label={groupBy.label}
            onDelete={() => {
              removeGroupBy(groupBy);
            }}
            className="mr-2"
            style={{
              color: "#545CD8",
              borderColor: "#545CD8",
              border: "2px solid",
              fontWeight: "bold",
            }}
          />
        );
      })}
    </div>
  );
};
