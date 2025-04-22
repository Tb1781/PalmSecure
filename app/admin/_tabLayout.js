import { Tabs } from "expo-router";

export default function AdminTabs() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Overview"}} />
      <Tabs.Screen name="users" options={{ title: "Users"}} />
      <Tabs.Screen name="add-user" options={{ title: "New User"}} />
    </Tabs>
  );
}