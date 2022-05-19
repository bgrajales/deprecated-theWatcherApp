import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'

export const MoviesSeen = () => {

    const navigation = useNavigation<any>()

    const { user, colorScheme } = useContext( AuthContext )

    const { top } = useSafeAreaInsets()

    if ( !user ) {
    
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={ 80 }/>
            </View>
          );
    
    } else {
        
        return (
            <View style={{ 
                flex: 1, 
                paddingTop: top,
                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'                
            }}>
                {
                    user.movies.length > 0 ?
                    <FlatList 
                        data={ user.movies }
                        keyExtractor={ ( item: any ) => item.id.toString() }
                        ListHeaderComponent={ () => { 
                            return (
                            <View>
                                <Text style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginVertical: 20,
                                    color: colorScheme === 'dark' ? '#fff' : '#000'
                                }}>Movies Watched</Text>
                            </View>
                        )}}
                        renderItem={ ({ item }: any) => {
                            return (
                                <TouchableOpacity style={{ 
                                    flex: 1/3, 
                                    marginHorizontal: 8,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
    
                                    elevation: 5,
                                }} activeOpacity={0.8}
                                    onPress={ () => { navigation.navigate('MovieDetailScreen', item ) } }
                                >
                                    <Image 
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }}
                                        style={{ width: "100%", height: 200, borderRadius: 10 }}
                                    />
                                </TouchableOpacity>
                            )
                        }}
                        numColumns={ 3 }
                        ItemSeparatorComponent={ () => {
                            return (
                                <View style={{ height: 20}}></View>
                            )
                        }}
                        contentContainerStyle={{
                            paddingBottom: 20,
                        }}
                    /> :
                    <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                        flexDirection: 'column',
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        height: Dimensions.get('window').height

                    }}
                >
                    <Image 
                        source={ require('../assets/fullIcon.png') }
                        style={{ width: 140, height: 100, marginTop: 20, marginBottom: 20}}
                    />
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingHorizontal: 14,
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                        textAlign: 'center', 
                        marginBottom: 20
                    }}>
                            Nothing to see here
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            paddingHorizontal: 14,
                            color: '#0055ff',
                            textAlign: 'center'
                        }}
                    >
                        Add movies you have seen to track them here!
                    </Text>
                    
                </View>

                }
            </View>
        )
    }
}
                   