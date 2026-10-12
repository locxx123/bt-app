import { Image, ImageBackground, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";



const Excercise = () => {
  const insets = useSafeAreaInsets();
    return (
        <View style={[{ paddingTop: insets.top, paddingLeft: 20, height: 100, backgroundColor: 'red' }]}>
            <Text style ={[{ color: 'white', fontSize: 20, fontWeight: 'bold' }]}>Hồ sơ</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                    <Image
                        source={require('../assets/images/avatar.jpg')}
                        style={{ width: 80, height: 80, borderRadius: 40, marginRight: 10 }}
                    />
                    <View>
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Nguyễn Văn A</Text>
                        <Text style={{ color: 'white', fontSize: 14 }}>Lớp CNTT1 - Khoa Công nghệ thông tin</Text>
                    </View>
                </View>
        </View>
    )
}

export default Excercise