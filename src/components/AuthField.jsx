import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const GOLD = '#f5a53d';

/**
 * Shared "modern" input used on the Login and Signup screens: left icon,
 * focus/error border highlight, optional eye-toggle for password fields,
 * inline error text. Pure presentational - all validation state still
 * comes from the parent's Formik instance.
 */
const AuthField = ({
  icon,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  secureToggle = false,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  returnKeyType = 'next',
  onSubmitEditing,
  blurOnSubmit,
  inputRef,
}) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const showError = Boolean(touched && error);

  const borderColor = showError ? '#e5484d' : focused ? GOLD : '#262626';
  const iconColor = showError ? '#e5484d' : focused ? GOLD : '#7a7a7a';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.field, { borderColor }]}>
        {icon ? (
          <MaterialIcons name={icon} size={19} color={iconColor} style={styles.icon} />
        ) : null}
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6b6b6b"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          secureTextEntry={secureToggle ? hidden : secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
        {secureToggle ? (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MaterialIcons name={hidden ? 'visibility-off' : 'visibility'} size={19} color="#888" />
          </TouchableOpacity>
        ) : null}
      </View>
      {showError ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },
  error: {
    color: '#e5484d',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
});

export default AuthField;
