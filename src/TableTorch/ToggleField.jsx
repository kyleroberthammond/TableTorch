import React from "react";
import { FormGroup, Label, Input } from "reactstrap";

import Switch from "react-switch";

class ToggleField extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.input.onChange(e.target.checked);
  }

  render() {
    const {
      input: { value, onChange, name },
      color,
      disabled,
    } = this.props;

    return (
      <Switch
        checked={_.isBoolean(value) ? value : false}
        onChange={onChange}
        disabled={disabled}
        uncheckedIcon={false}
        checkedIcon={false}
        onColor={color}
        id={name}
      />
    );
  }
}

export default ToggleField;
