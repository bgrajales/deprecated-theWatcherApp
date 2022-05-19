import React, { useContext, useEffect, useState } from 'react'
import { KeyboardAvoidingView, KeyboardAvoidingViewComponent, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { multiDB } from '../api/movieDB'
import { SearchCard } from '../components/SearchCard'
import { SearchInput } from '../components/SearchInput'
import { AuthContext } from '../context/AuthContext'
import { SearchIndiv, SearchResponse } from '../interfaces/movieInterface'

export const SearchScreen = () => {

  const { top } = useSafeAreaInsets()
  const { colorScheme } = useContext(AuthContext)

  const [ isFetching, setIsFetching ] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [ searchedElementsArray, setSearchElementsArray ] = useState<SearchIndiv[]>([])

  useEffect(() => {
    if ( searchText.length > 2 ) {
      getElements()
    } else if ( searchText.length === 0 ) {
      setSearchElementsArray([])
    }
  }, [searchText]);

  const getElements = async () => {
    
    setIsFetching(true)

    let searchParam

    if ( searchText.indexOf(" ") >= 0 ) {
      searchParam = searchText.replace(/\s/g, '%20')
    } else {
      searchParam = searchText
    }

    const searchedElements = multiDB.get<SearchResponse>(`/search/multi?query=${searchParam}`)

    const searchPromise = await Promise.all([searchedElements])

    setSearchElementsArray(searchPromise[0].data.results)
    setIsFetching(false)
  }

  return (
    <View style={{ 
      marginTop: top + 20, 
      paddingHorizontal: 20, 
      flex: 1, 
      backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'        
    }}>
        
        <SearchInput 
          onDebounce={(value) => setSearchText(value)}
        />

        {
          searchedElementsArray.length === 0 && !isFetching &&
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}
          >
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: colorScheme === 'dark' ? '#fff' : '#000',
              textAlign: 'center',
              marginBottom: 20
            }}>
              Type the title of the movie or TV show you want to search for
            </Text>
            <Icon name="search" size={50} color='#0055ff' />
          </View>
        }
        <View style={{ flex: 1 }}>
          <ScrollView style={{ paddingVertical: 20 }}>
            {
              searchedElementsArray.map((element) => {
                
                return <SearchCard key={element.id} element={element} type={ element.media_type } />
                
              })
            }
          </ScrollView>
        </View>

    </View>
  )
}