import React, { useContext } from 'react'
import { View } from 'react-native'
import { NotAuth } from '../components/NotAuth';
import { ProfileComponent } from '../components/ProfileComponent';
import { AuthContext } from '../context/AuthContext';
import { ProfileDrawer } from '../navigation/ProfileDrawer';

export const ProfileScreen = () => {

  const { status } = useContext(AuthContext);

  return (
    <View style={{ flex: 1 }}>
    {
      status === 'unauthenticated' 
      ? <NotAuth />
      : <ProfileDrawer />
    }
    </View>
  )
}