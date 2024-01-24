import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/screenWrapper'
import { colors } from '../theme'
import randomImage from '../assets/images/randomImage';
import EmptyLost from '../components/emptyList';
import { useNavigation } from '@react-navigation/native';
const items = [
    {
      id: 1,
      place: 'Gujrat',
      country: 'pakistan',
    },
    {

      id: 2,
      place: 'London Eye',
      country: 'England',
    },
    {
      id: 3,
      place: 'Washington dc',
      country: 'America',
    },
    {
      id: 4,
      place: 'New york',
      country: 'America',
    },

  ]

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl shadow-sm`}>Expensify</Text>
        <TouchableOpacity className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text className={colors.heading}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View className="flex justify-center items-center bg-blue-200 rounded-xl mx-4 mb-4">
        <Image className="w-60 h-60" source={require('../assets/images/banner.png')} />
      </View>
      <View className="px-4 space-y-4">
        <View className="flex-row justify-between items-center">
        <Text className={`${colors.heading} font-bold text-xl `}>Recent Trips</Text>
        <TouchableOpacity onPress={()=> navigation.navigate('AddTrip')} className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text className={colors.heading}>Add Trip</Text>
        </TouchableOpacity>
        </View>
        <View style={{heading: 430}}>
          <FlatList 
          data={[items]}
          numColumns={2}
          ListEmptyComponent={<EmptyLost message={"You haven't recorded any Trips yet"}/> }
          keyExtractor={item=> item.id}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={{
              justifyContent: 'space-between'
            }}
            className="mx-1"
          renderItem={({item})=>{
            return(
              <TouchableOpacity className=" bg-white p-3  rounded-2xl mb-3 shadow-sm">
                <View>
                  <Image  className="w-36 h-36 mb-2" source={randomImage()}  />
                  <Text className={`${colors.heading} font-bold `}>{item.place}</Text>
                  <Text className={`${colors.heading}`}>{item.country}</Text>
                </View>
              </TouchableOpacity>
            )
            
          }}
          />

        </View>
      </View>
    </ScreenWrapper>
  )
}