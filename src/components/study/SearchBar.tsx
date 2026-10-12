import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { COLORS, RADIUS, SPACING } from '../../constants/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Tìm kiếm...',
}) => (
  <View style={styles.container}>
    <Ionicons name="search" size={18} color={COLORS.textMuted} />
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
      autoCorrect={false}
      returnKeyType="search"
    />
    {value.length > 0 ? (
      <TouchableOpacity
        onPress={() => onChangeText('')}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  input: {
    flex: 1,
    marginHorizontal: SPACING.sm,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },
});
