import { Redirect } from "expo-router";
import { useAuth } from "../src/hooks/useAuth";

export default function IndexScreen() {
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return null;
  }

  return <Redirect href={isAuthenticated ? "/dashboard" : "/(welcome)"} />;
}
