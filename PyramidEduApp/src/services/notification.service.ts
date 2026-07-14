import Toast from 'react-native-toast-message';

/**
 * Show a success notification
 */
export function showSuccess(message: string, title?: string): void {
  Toast.show({
    type: 'appSuccess',
    text1: title || 'Success',
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
  });
}

/**
 * Show an error notification
 */
export function showError(message: string, title?: string): void {
  Toast.show({
    type: 'appError',
    text1: title || 'Error',
    text2: message,
    position: 'top',
    visibilityTime: 5000,
    autoHide: true,
  });
}

/**
 * Show a warning notification
 */
export function showWarning(message: string, title?: string): void {
  Toast.show({
    type: 'appWarning',
    text1: title || 'Warning',
    text2: message,
    position: 'top',
    visibilityTime: 4500,
    autoHide: true,
  });
}

/**
 * Show an information notification
 */
export function showInfo(message: string, title?: string): void {
  Toast.show({
    type: 'appInfo',
    text1: title || 'Info',
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
  });
}

export default {
  showSuccess,
  showError,
  showWarning,
  showInfo,
};
