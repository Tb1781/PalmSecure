import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import supabase from "./utils/supabase"; // Ensure Supabase client is correctly configured

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AdminDashboard() {
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fetch user data and calculate metrics
  const fetchUserData = async () => {
    const { data: users, error } = await supabase.from("Users").select("*");
    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    const total = users.length;
    const verified = users.filter((user) => user.present_today).length;
    const pending = users.filter((user) => !user.present_today).length;
    const success = total > 0 ? (verified / total) * 100 : 0;

    setTotalUsers(total);
    setVerifiedUsers(verified);
    setPendingUsers(pending);
    setSuccessRate(success);

    // Fetch recent activity (most recent users with present_today = true)
    const recentData = users
      .filter((user) => user.present_today)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3); // Get the top 3 recent users
    setRecentActivity(recentData);
  };

  // Logout button handler
  const handleLogout = async () => {
    try {
      // Log out the user using Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout failed:", error.message);
        Alert.alert("Logout Failed", error.message);
      } else {
        console.log("User logged out successfully");
        // Redirect to the root route (/)
        router.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Logout */}
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#333" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Section */}
      <View style={styles.statsContainer}>
        {/* First Row */}
        <View style={styles.cardRow}>
          <View style={[styles.statCard, styles.totalUsersCard]}>
            <FontAwesome name="users" size={30} color="#666" />
            <View>
              <Text style={styles.statValue}>{totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
          </View>
          <View style={[styles.statCard, styles.verifiedUsersCard]}>
            <FontAwesome name="check" size={30} color="#666" />
            <View>
              <Text style={styles.statValue}>{verifiedUsers}</Text>
              <Text style={styles.statLabel}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Second Row */}
        <View style={styles.cardRow}>
          <View style={[styles.statCard, styles.pendingUsersCard]}>
            <FontAwesome name="clock-o" size={30} color="#666" />
            <View>
              <Text style={styles.statValue}>{pendingUsers}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>
          <View style={[styles.statCard, styles.successRateCard]}>
            <FontAwesome name="chart" size={30} color="#666" />
            <View>
              <Text style={styles.statValue}>{successRate.toFixed(2)}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity Section */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivity}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <FontAwesome name="user" size={40} color="#ccc" />
              <View style={styles.activityDetails}>
                <Text style={styles.userName}>{item.Name}</Text>
                <Text style={styles.activityTime}>
                  {calculateTimeAgo(item.created_at)}
                </Text>
              </View>
              <TouchableOpacity style={styles.activityArrow}>
                <FontAwesome name="angle-right" size={20} color="#ccc" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

// Helper function to calculate time ago
function calculateTimeAgo(timestamp) {
  const now = new Date();
  const createdAt = new Date(timestamp);
  const diffInSeconds = Math.floor((now - createdAt) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  statsContainer: {
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "45%",
    height: 120,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  totalUsersCard: {
    borderColor: "#ccc",
    borderWidth: 1,
  },
  verifiedUsersCard: {
    borderColor: "#28a745",
    borderWidth: 1,
  },
  pendingUsersCard: {
    borderColor: "#ffc107",
    borderWidth: 1,
  },
  successRateCard: {
    borderColor: "#007bff",
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  recentActivityContainer: {
    marginTop: 20,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activityDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityTime: {
    fontSize: 14,
    color: "#666",
  },
  activityArrow: {
    width: 20,
    height: 20,
  },
});