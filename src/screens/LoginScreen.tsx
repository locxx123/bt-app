import { Button, Text, View } from "react-native";



export function LoginScreen({ navigation }: any) {


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Login Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.push('home')} />
    </View>
  );
}