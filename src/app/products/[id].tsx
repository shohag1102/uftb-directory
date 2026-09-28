import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text>ProductDetails of {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
