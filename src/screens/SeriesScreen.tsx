import React, { useContext } from 'react'
import { View } from 'react-native'
import { NotAuth } from '../components/NotAuth';
import { SeriesSeen } from '../components/SeriesSeen';
import { AuthContext } from '../context/AuthContext';

export const SeriesScreen = () => {

  const { status } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
    {
      status === 'unauthenticated' 
      ? <NotAuth />
      : <SeriesSeen />
    }
    </View>
  )
}