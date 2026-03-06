import { Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PokedexHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require("../../assets/pokemon-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.settings}>
        <Ionicons name="settings-outline" size={22} color="#444" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logo: {
    width: 250,
    height: 60,
    marginLeft: -60,
  },
  settings: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f3f3f3",
    alignItems: "center",
    justifyContent: "center",
  },
});
