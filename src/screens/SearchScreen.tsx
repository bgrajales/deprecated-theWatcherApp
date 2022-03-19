import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, KeyboardAvoidingViewComponent, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { multiDB } from '../api/movieDB'
import { SearchCard } from '../components/SearchCard'
import { SearchInput } from '../components/SearchInput'
import { SearchIndiv, SearchResponse } from '../interfaces/movieInterface'

export const SearchScreen = () => {

  const { top } = useSafeAreaInsets()

  const [ isFetching, setIsFetching ] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [ searchedElementsArray, setSearchElementsArray ] = useState<SearchIndiv[]>([])

  useEffect(() => {
    if ( searchText.length > 2 ) {
      getElements()
    }
  }, [searchText]);

  const getElements = async () => {
    
    console.log(isFetching, searchedElementsArray)    
    setIsFetching(true)

    const searchParam = searchText.replaceAll(" ", "%20")

    const searchedElements = multiDB.get<SearchResponse>(`/search/multi?query=${searchParam}`)

    const searchPromise = await Promise.all([searchedElements])

    setSearchElementsArray(searchPromise[0].data.results)
    setIsFetching(false)
  }

  return (
    <View style={{ marginTop: top + 20, paddingHorizontal: 20, flex: 1 }}>
        
        <SearchInput 
          onDebounce={(value) => setSearchText(value)}
        />

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