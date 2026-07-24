import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { ScreenPlaceholder } from "../../src/components/ScreenPlaceholder";
import { useAppTheme } from "../../src/hooks/useAppTheme";

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useAppTheme();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <ScreenPlaceholder
        title="Notifications"
        description="System notifications placeholder."
      />
    </ScrollView>
  );
}
