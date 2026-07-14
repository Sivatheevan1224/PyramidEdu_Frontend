import { Stack } from 'expo-router';
import { FeeStoreProvider } from '../../src/modules/fees/store/fee.store';

export default function FeesLayout() {
  return (
    <FeeStoreProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </FeeStoreProvider>
  );
}
