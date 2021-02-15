// @flow
import React, { PureComponent } from "react";
import { View, Platform } from "react-native";
import { Picker } from '@react-native-picker/picker'

import KeyboardModal from "./KeyboardModal";
import DisableKeyboard from "./DisableKeyboard";

type PropsType = {
  values: Array<{ label: string, value: string }>
};

class PickerModal extends PureComponent<PropsType> {
  pickerModal: ?KeyboardModal;

  openPicker = () => {
    if (this.pickerModal) this.pickerModal.open();
  };

  onValueChange = (value: any) => {
    // if (value === '') return;
    if (this.props.onChangeText) this.props.onChangeText(value);
    if (this.props.onSubmitEditing) this.props.onSubmitEditing();
    if (this.props.onChangeCb) this.props.onChangeCb(value);
  };

  renderPicker = () => {
    const { placeholder, value, disabled, clearable } = this.props;
    if (!this.props.values || !this.props.values.length) return null;
    const values = [...this.props.values];
    if (Platform.OS === "ios") {
      values.unshift({ value: "", label: placeholder || "" });
    }
    else if (clearable) {
      // Fix for issue: https://github.com/facebook/react-native/issues/15556
      values.unshift({ value: "", label: "" });
    }
    const picker = (
      <Picker
        onValueChange={this.onValueChange}
        selectedValue={value}
        prompt={placeholder}
        enabled={!disabled}
      >
        {values.map(item => (
          <Picker.Item key={item.value} {...item} />
        ))}
      </Picker>
    );

    return Platform.OS === "ios" ? (
      <KeyboardModal
        ref={ref => {
          this.pickerModal = ref;
        }}
      >
        {picker}
      </KeyboardModal>
    ) : (
        <View
          style={{
            opacity: 0.00000001,
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
          }}
        >
          {picker}
        </View>
      );
  };

  render() {
    return (
      <View>
        <DisableKeyboard onPress={this.openPicker}>
          {this.props.children}
        </DisableKeyboard>
        {this.renderPicker()}
      </View>
    );
  }
}

export default PickerModal;
