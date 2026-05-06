import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Button = ({ 
  onPress, 
  title, 
  type = 'primary', 
  loading = false, 
  disabled = false, 
  icon,
  style,
  textStyle 
}) => {
  const getButtonStyle = () => {
    if (disabled || loading) return styles.disabled;
    switch (type) {
      case 'secondary': return styles.secondary;
      case 'danger': return styles.danger;
      case 'outline': return styles.outline;
      case 'ghost': return styles.ghost;
      default: return styles.primary;
    }
  };

  const getTextStyle = () => {
    if (disabled || loading) return styles.disabledText;
    switch (type) {
      case 'secondary': return styles.secondaryText;
      case 'danger': return styles.dangerText;
      case 'outline': return styles.outlineText;
      case 'ghost': return styles.ghostText;
      default: return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, getButtonStyle(), style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={type === 'outline' || type === 'ghost' ? '#3B82F6' : '#FFFFFF'} />
      ) : (
        <View style={styles.content}>
          {icon && <MaterialIcons name={icon} size={20} color={getTextStyle().color} style={styles.icon} />}
          <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primary: {
    backgroundColor: '#3B82F6',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondary: {
    backgroundColor: '#10B981',
  },
  secondaryText: {
    color: '#FFFFFF',
  },
  danger: {
    backgroundColor: '#EF4444',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  outlineText: {
    color: '#3B82F6',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {
    color: '#3B82F6',
  },
  disabled: {
    backgroundColor: '#E5E7EB',
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default Button;
