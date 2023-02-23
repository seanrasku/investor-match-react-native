import { Text, ScrollView, View, StyleSheet, Pressable } from "react-native";
import Login from "./Login";
export default function Dashboard({ navigation }) {
  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.viewOne}>
        <Pressable
          style={styles.press}
          onPress={() => navigation.navigate("Tags")}
        >
          <Text>Tags</Text>
        </Pressable>
        <Pressable
          style={styles.press}
          onPress={() => navigation.navigate("Connections")}
        >
          <Text>Connections</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  scroll: {
    display: "flex",
    flex: 1,
    alignContent: "flex-end",
  },
  viewOne: {
    //display: "flex",
    flexDirection: "row",
    //alignContent: "center",
    marginBottom: 40,
    //alignItems: "baseline",
  },
  press: {
    width: "45%",
    backgroundColor: "green",
    padding: 20,
    marginLeft: 10,
    marginRight: 5,
  },
});
