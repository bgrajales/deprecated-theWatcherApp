import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { MoviesSeen } from '../components/MoviesSeen';
import { NotAuth } from '../components/NotAuth';
import { AuthContext } from '../context/AuthContext';

export const MoviesScreen = () => {

  const { status } = useContext(AuthContext);


  return (
    <View style={{ flex: 1 }}>
      {
        status === 'unauthenticated' 
        ? <NotAuth />
        : <MoviesSeen />
      }
    </View>
  )
}