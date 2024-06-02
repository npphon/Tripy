import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/screenWrapper'
import { colors } from '../theme'
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
    const navigation = useNavigation();
  return (
    <ScreenWrapper>
    <View className='h-full flex justify-around'>
        <View className='flex-row justify-center mt-10'>
            <Image source={require('../assets/images/welcome.gif')} className='h-96 w-96'/>
        </View>
        <View className='mx-5 mb-20'>
            <Text className={`text-center font-bold text-2xl ${colors.heading} mb-10`}>POCKET MONEY MANAGEMENT MY WAY</Text>
            <TouchableOpacity className='p-3 rounded-full mb-5' style={{backgroundColor:colors.button}}>
                <Text onPress={()=> navigation.navigate('Home')} className='text-center text-white text-lg font-bold'>เข้าสู่ระบบ</Text>
            </TouchableOpacity>
        </View>
    </View>
    </ScreenWrapper>
  )
}