import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useAppTheme } from '../hooks/useAppTheme';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  isDestructive?: boolean;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmOptions) => void;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationProvider({ children }: { children: ReactNode }) {
  const { colors, theme } = useAppTheme();
  
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [loading, setLoading] = useState(false);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setVisible(true);
    setLoading(false);
  };

  const handleCancel = () => {
    if (loading) return; // Prevent canceling while loading
    setVisible(false);
    if (options?.onCancel) {
      options.onCancel();
    }
  };

  const handleConfirm = async () => {
    if (loading || !options) return;
    
    try {
      const result = options.onConfirm();
      if (result instanceof Promise) {
        setLoading(true);
        await result;
      }
      setVisible(false);
    } catch (error) {
      console.error('Error executing confirmation action:', error);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const isDark = theme === 'DARK';

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      
      {options && (
        <AwesomeAlert
          show={visible}
          showProgress={loading}
          title={options.title}
          message={options.message}
          closeOnTouchOutside={!loading}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText={options.cancelText || 'Cancel'}
          confirmText={options.confirmText || 'Confirm'}
          confirmButtonColor={options.isDestructive ? colors.error : colors.primary}
          cancelButtonColor={isDark ? '#3A3A3C' : '#E5E5EA'}
          onCancelPressed={handleCancel}
          onConfirmPressed={handleConfirm}
          contentContainerStyle={[
            styles.alertContainer,
            { backgroundColor: colors.cardBg }
          ]}
          titleStyle={[
            styles.titleText,
            { color: colors.textPrimary }
          ]}
          messageStyle={[
            styles.messageText,
            { color: colors.textSecondary }
          ]}
          cancelButtonStyle={styles.button}
          confirmButtonStyle={styles.button}
          cancelButtonTextStyle={[
            styles.buttonText,
            { color: isDark ? '#FFFFFF' : '#333333' }
          ]}
          confirmButtonTextStyle={[
            styles.buttonText,
            { color: '#FFFFFF' }
          ]}
          overlayStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        />
      )}
    </ConfirmationContext.Provider>
  );
}

export function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  alertContainer: {
    borderRadius: 16,
    padding: 16,
    width: '85%',
    maxWidth: 340,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  button: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
