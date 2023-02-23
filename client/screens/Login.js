import { TextInput, View, StyleSheet, Text, Button } from "react-native";
import { useState } from "react";
import { login } from "../actions/auth";
export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const user = await login(email, password);
      console.log(user);
      if (
        user !== undefined &&
        user.data.token !== undefined &&
        user.data.token !== ""
      ) {
        navigation.navigate("Dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Email"
        onChangeText={(e) => setEmail(e)}
        autoCapitalize={false}
      />
      <TextInput
        style={styles.inputField}
        secureTextEntry={true}
        placeholder="Password"
        onChangeText={(p) => setPassword(p)}
        autoCapitalize="none"
      />
      <Button title="Submit" onPress={() => handleSubmit()} />
    </View>
  );
}
const styles = StyleSheet.create({
  inputField: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    height: 50,
    fontSize: 30,
    fontWeight: "500",
    textAlign: "center",
  },
  container: {
    backgroundColor: "white",
    flex: 1,
  },
});
