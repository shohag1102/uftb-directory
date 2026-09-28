import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ProductList() {
  return (
    <View>
      <Text>Product List</Text>
      <Link href={"/products/1"}>Product 1</Link>
      <Link href={"/products/2"}>Product 2</Link>
      <Link href={"/products/3"}>Product 3</Link>
    </View>
  );
}

const styles = StyleSheet.create({});
