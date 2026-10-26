import { Alert, Platform, ToastAndroid } from 'react-native';

/** Thông báo ngắn cho người dùng */
export const notify = (message: string, title = 'Thông báo'): void => {
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Alert.alert(title, message);
  }
};
