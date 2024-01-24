import { View, Text } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/screenWrapper'
import { colors } from '../theme'
import BackButton from '../components/backButton'

export default function AddTripScreen() {
  return (
    <ScreenWrapper>
      <View className="flex justify-between h-full">
        <View>
            <BackButton /> 
            <Text className={`${colors.heading} text-xl font-bold text-center`}> Add Trip</Text>
        </View>
      </View>
      
    </ScreenWrapper>
    
  )
}