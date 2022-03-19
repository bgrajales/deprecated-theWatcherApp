import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { NotAuth } from '../components/NotAuth';
import { AuthContext } from '../context/AuthContext';

export const MoviesScreen = () => {

  const { status } = useContext(AuthContext);


  return (
    <View style={{ flex: 1 }}>
      {
        status === 'unauthenticated' 
        ? <NotAuth />
        : <Text>MoviesScreen</Text>
      }
    </View>
  )
}