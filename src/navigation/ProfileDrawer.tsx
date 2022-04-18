import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { ProfileComponent } from '../components/ProfileComponent';
import { PickGenresModal } from '../components/PickGenresModal';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { DrawerActions } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export const ProfileDrawer = () => {

    const { logOut } = useContext( AuthContext )

    return (
        <Drawer.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right',
            }}
            drawerContent={props => {
                return (
                <DrawerContentScrollView {...props}>
                    <DrawerItemList {...props} />
                    <DrawerItem 
                        label="Logout" 
                        onPress={() => {
                            logOut()
                            props.navigation.dispatch(DrawerActions.closeDrawer())
                        }}
                        style={{
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </DrawerContentScrollView>
                )
            }}
        >
            <Drawer.Screen name="Profile" component={ProfileComponent} />
            <Drawer.Screen name="Genres" component={PickGenresModal} />
            {/* <Drawer.Screen name="Article" component={Article} /> */}


        </Drawer.Navigator>
    );
}