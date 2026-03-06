import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export function StatRow({ label, value, icon, color, isMCI = false }: any) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.valueGroup}>
        <Text style={styles.statValue}>{value}</Text>
        {isMCI ? (
          <MaterialCommunityIcons name={icon} size={20} color={color} />
        ) : (
          <Ionicons name={icon} size={20} color={color} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  statLabel: { fontSize: 16, color: "#000", fontWeight: "600" },
  valueGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  statValue: { fontSize: 16, fontWeight: "800" },
});