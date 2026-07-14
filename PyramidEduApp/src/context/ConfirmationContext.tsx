import React, { createContext, useContext, useState, ReactNode } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ActivityIndicator, Pressable } from 'react-native';
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
      
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <Pressable 
          style={styles.overlay} 
          onPress={loading ? undefined : handleCancel}
        >
          <Pressable style={[styles.alertContainer, { backgroundColor: colors.cardBg }]}>
            {options && (
              <View style={styles.content}>
                <Text style={[styles.titleText, { color: colors.textPrimary }]}>
                  {options.title}
                </Text>
                
                <Text style={[styles.messageText, { color: colors.textSecondary }]}>
                  {options.message}
                </Text>

                {loading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : (
                  <View style={styles.buttonRow}>
                    <TouchableOpacity 
                      style={[styles.button, styles.cancelButton, { backgroundColor: isDark ? '#2C2C2E' : '#F2F2F7' }]} 
                      onPress={handleCancel}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.buttonText, { color: colors.textSecondary }]}>
                        {options.cancelText || 'Cancel'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[
                        styles.button, 
                        { backgroundColor: options.isDestructive ? colors.error || '#FF3B30' : colors.primary }
                      ]} 
                      onPress={handleConfirm}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                        {options.confirmText || 'Confirm'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    borderRadius: 20,
    width: '85%',
    maxWidth: 320,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  content: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: 19,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  loadingContainer: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
