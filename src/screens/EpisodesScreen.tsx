import React from 'react'
import { FlatList, Text, View } from 'react-native'
import { useSeriesDetail } from '../hooks/useSeriesDetail';

interface Props {
    seriesId: number;
}

export const EpisodesScreen = ({ seriesId }: Props) => {

    const { seasons } = useSeriesDetail(seriesId)

    console.log(seasons)
  return (
    <View>
        {
            seasons?.map(season => (
                <View key={season._id}>
                <Text>{season.name}</Text>
                <FlatList 
                    data={season.episodes}
                    keyExtractor={ (episode) => episode.id.toString() }
                    renderItem={ ({ item }) => (
                        <Text>{item.name}</Text>
                    )}
                />
                </View>
            ))
        }
    </View>
  )
}
