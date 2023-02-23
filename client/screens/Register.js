import { TextInput, View, StyleSheet, Text, Button } from "react-native";
import { useState } from "react";
import { register } from "../actions/auth";
import DropDownPicker from "react-native-dropdown-picker";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirm, setConfirm] = useState("");
  const [userType, setUserType] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [items, setItems] = useState([
    { label: "Investor", value: "Investor" },
    { label: "Social Venture", value: "SocialVenture" },
  ]);
  function clear() {
    setEmail("");
    setPassword("");
    setConfirm("");
    setName("");
  }

  const handleSubmit = async () => {
    try {
      console.log(userType);
      if (confirm !== password) {
        console.log("PASSWORDS DO NOT MATCH!");
      }
      await register(name, email, password, userType);
      clear();
      navigation.navigate("Login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.inputField}
        placeholder="Name"
        onChangeText={(n) => setName(n)}
        clearButtonMode="always"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        placeholder="Email"
        onChangeText={(e) => setEmail(e)}
        clearButtonMode="always"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        secureTextEntry={true}
        placeholder="Password"
        onChangeText={(p) => setPassword(p)}
        clearButtonMode="always"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.inputField}
        secureTextEntry={true}
        placeholder="Confirm Password"
        onChangeText={(c) => setConfirm(c)}
        clearButtonMode="always"
        autoCapitalize="none"
      />
      <DropDownPicker
        items={items}
        open={open}
        value={value}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Select"
        onChangeValue={(i) => setUserType(i)}
      />
      <Button
        title="Submit"
        style={styles.button}
        onPress={() => handleSubmit()}
        disabled={name.length == 0 || email.length < 6 || password.length < 6}
      />
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
  button: {
    backgroundColor: "green",
  },
});
