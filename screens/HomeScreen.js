import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from '../theme'
import randomImage from '../assets/images/randomImage'
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { getDocs, query } from "firebase/firestore";
import { cashboxRef, pocketRef } from "../config/firebase";
import { PlusCircleIcon } from "react-native-heroicons/outline";


export default function HomeScreen() {
  const navigation = useNavigation();

  const [pockets, setPockets] = useState([]);
  const [cashbox, setCashbox] = useState([]);

  const isFocused = useIsFocused();

  const fetchCashbox = async () => {
    const querySnapshot = await getDocs(cashboxRef);
    let data = []
    querySnapshot.forEach(doc => {
      // console.log(doc.data());
      data.push({...doc.data(), id: doc.id})
    })
    setCashbox(data);
    // console.log(data);
    
  }
  const fetchPockets = async () => {
    const q = query(pocketRef)
    const querySnapshot = await getDocs(q);
    let data = []
    querySnapshot.forEach(doc => {
      // console.log(doc.data());
      data.push({...doc.data(), id: doc.id})
    })
    setPockets(data);
  }

  useEffect(()=> {
    if(isFocused)
      fetchCashbox();
      fetchPockets();
  },[isFocused])

  return (
    <ScreenWrapper className="flex-1">
      <View className='flex-row justify-between items-center p-4'>
        <Text className={`${colors.heading} font-bold text-3xl`}>Split Pocket</Text>
        <TouchableOpacity className='p-2 px-3 bg-white border border-gray-200 rounded-full'>
          <Text onPress={()=> navigation.navigate('Welcome')} className={colors.heading}>Logout</Text> 
        </TouchableOpacity>
      </View>
      <View className='justify-center bg-blue-200 rounded-xl mx-4 mb-4 p-6'>
        <Text className='mb-4'>Cashbox</Text>
        <View className='flex-row justify-between items-center'>
        <Text className='text-base'>{`฿ ${cashbox.length > 0 ? cashbox[0].amount : 'Loading...'}`}</Text>
        <PlusCircleIcon onPress={() => navigation.goBack()} size="35" color={colors.button}/>
        {/* <Image className='w-60 h-60' source={require('../assets/images/banner.png')}/> */}
        </View>
      </View>
      <View className='px-4 space-y-3'>
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>Pockets</Text>
            <TouchableOpacity onPress={()=> navigation.navigate('AddPocket')} className="p-2 px-3 bg-white border border-gray-200 rounded-full">
              <Text className={colors.heading}>Add Pocket</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: 430}}>
            <FlatList
              data={pockets}
              numColumns={2}
              ListEmptyComponent={<EmptyList message={"You haven't recorded any trips yet"}/>}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={{
                justifyContent: 'space-between'
              }}
              className="mx-1"
              renderItem={({item}) => {
                return (
                  <TouchableOpacity onPress={()=> navigation.navigate('PocketExpenses', {...item})} className='bg-white p-3 rounded-2xl mb-3'>
                    <View>
                      <Image className='w-36 h-36 mb-2' source={randomImage()} />
                      <Text className={`${colors.heading} font-bold`}>{item.pocketName}</Text>
                      <Text className={`${colors.heading} text-xs`}>{`฿ ${item.amount}`}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          </View>
      </View>
    </ScreenWrapper>
  );
}
