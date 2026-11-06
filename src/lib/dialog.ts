import { Alert, Platform } from 'react-native';

export function confirmAction(title: string, message: string, action: () => void | Promise<void>, confirmLabel = '확인') {
  if (Platform.OS === 'web') {
    if (globalThis.confirm(`${title}\n${message}`)) void action();
    return;
  }
  Alert.alert(title, message, [
    { text: '취소', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: () => { void action(); } },
  ]);
}

export function showMessage(title: string, message: string) {
  if (Platform.OS === 'web') globalThis.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
}
