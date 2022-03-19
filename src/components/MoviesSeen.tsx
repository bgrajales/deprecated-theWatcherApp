import React, { useContext } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'

export const MoviesSeen = () => {

    const { user } = useContext( AuthContext )

    const { top } = useSafeAreaInsets()

    if ( !user ) {
    
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={ 80 }/>
            </View>
          );
    
    } else {
        
        return (
            <View style={{ flex: 1, paddingTop: top }}>
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
                            }}>Movies Watched</Text>
                        </View>
                    )}}
                    renderItem={ ({ item }: any) => {
                        return (
                            <View style={{ flex: 1, padding: 10 }}>
                                <Image 
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }}
                                    style={{ width: "100%", height: 200, borderRadius: 10 }}
                                />
                            </View>
                        )
                    }}
                    numColumns={ 3 }
                />
            </View>
        )
    }
}
                   