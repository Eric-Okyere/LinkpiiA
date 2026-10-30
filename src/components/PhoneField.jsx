import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal';

const GOLD = '#f5a53d';

/**
 * Phone input with a tappable country-code chip, styled to match AuthField.
 * Reuses `react-native-country-picker-modal`, already a dependency and
 * already used the same way on the advert/shop post forms (Post.jsx,
 * ShopPost.jsx, etc.) - `country` is `{ code, callingCode }` and the caller
 * is responsible for combining `+${country.callingCode}${value}` before
 * sending the phone number anywhere. `value` itself is just the local
 * number, with any leading trunk "0" stripped as the user types (same
 * convention already used on the post forms).
 */
const PhoneField = ({
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  country,
  onSelectCountry,
  placeholder = 'Phone number',
  returnKeyType = 'next',
  onSubmitEditing,
  blurOnSubmit,
  inputRef,
}) => {
  const [focused, setFocused] = useState(false);
  const showError = Boolean(touched && error);

  const borderColor = showError ? '#e5484d' : focused ? GOLD : '#262626';

  return (
    <View style={styles.wrapper}>
      <View style={[styles.field, { borderColor }]}>
        <CountryPicker
          countryCode={country.code}
          withCallingCode
          withFilter
          withAlphaFilter
          onSelect={(c) => onSelectCountry({ code: c.cca2, callingCode: c.callingCode[0] })}
          renderFlagButton={(flagProps) => (
            <TouchableOpacity onPress={flagProps.onOpen} style={styles.dialChip} activeOpacity={0.7}>
              <Text style={styles.dialChipText}>+{country.callingCode}</Text>
              <MaterialIcons name="arrow-drop-down" size={18} color="#8a8a8a" />
            </TouchableOpacity>
          )}
        />
        <View style={styles.divider} />
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6b6b6b"
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/^0/, ''))}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          keyboardType="phone-pad"
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
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
  dialChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialChipText: {
    color: '#fff',
    fontSize: 15,
    marginRight: 2,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 10,
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

export default PhoneField;
