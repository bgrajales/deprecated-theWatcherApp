import React, { useContext } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { NotAuth } from '../components/NotAuth';
import { ProfileComponent } from '../components/ProfileComponent';
import { AuthContext } from '../context/AuthContext';

export const ProfileScreen = () => {

  const { status } = useContext(AuthContext);

  return (
    <ScrollView style={{ flex: 1 }}>
    {
      status === 'unauthenticated' 
      ? <NotAuth />
      : <ProfileComponent />
    }
    </ScrollView>
  )
}