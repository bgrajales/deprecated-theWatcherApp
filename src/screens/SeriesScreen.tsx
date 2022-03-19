import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { NotAuth } from '../components/NotAuth';
import { AuthContext } from '../context/AuthContext';

export const SeriesScreen = () => {

  const { status } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
    {
      status === 'unauthenticated' 
      ? <NotAuth />
      : <Text>SeriesScreen</Text>
    }
    </View>
  )
}