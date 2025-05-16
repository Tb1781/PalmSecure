import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import supabase from "../utils/supabase";
import NavigationBar from "../components/NavigationBar";

export default function Home() {
  const router = useRouter();
  const [totalUsers, setTotalUsers] = useState(0);
  const [verifiedUsers, setVerifiedUsers] = useState(0);
  const [pendingUsers, setPendingUsers] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: users, error } = await supabase.from("Users").select("*");
    if (error) {
      console.error("Error fetching users:", error.message);
      return;
    }

    const total = users.length;

    const today = new Date().toISOString().slice(0, 10);

    const verified = users.filter((user) => {
      if (!user.verified_at) return false;
      return user.verified_at.slice(0, 10) === today;
    });

    const verifiedCount = verified.length;
    const pending = total - verifiedCount;
    const success = total > 0 ? (verifiedCount / total) * 100 : 0;

    setTotalUsers(total);
    setVerifiedUsers(verifiedCount);
    setPendingUsers(pending);
    setSuccessRate(success);

    const recentData = verified
      .sort((a, b) => new Date(b.verified_at) - new Date(a.verified_at))
      .slice(0, 3);

    setRecentActivity(recentData);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout failed:", error.message);
        Alert.alert("Logout Failed", error.message);
      } else {
        console.log("User logged out successfully");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#333" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <NavigationBar />

      <View style={styles.statsContainer}>
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

      <View style={styles.recentActivityContainer}>
        <Text style={styles.recentActivityTitle}>Recent Activity</Text>
        <FlatList
          data={recentActivity}
          keyExtractor={(item) => item.id || item.Name}
          renderItem={({ item }) => (
            <View style={styles.activityItem}>
              <FontAwesome name="user" size={40} color="#ccc" />
              <View style={styles.activityDetails}>
                <Text style={styles.userName}>{item.Name || "N/A"}</Text>
                <Text style={styles.activityTime}>
                  {formatVerifiedTimeUTCPlus5(item.verified_at)}
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

// Format UTC timestamp into Pakistan Standard Time with readable date
function formatVerifiedTimeUTCPlus5(timestamp) {
  const time = new Date(timestamp); // UTC
  const localTime = new Date(time.getTime() + 5 * 60 * 60 * 1000); // UTC+5

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return localTime.toLocaleString("en-US", options).replace(",", " –");
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
