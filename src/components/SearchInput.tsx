import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface Props {
    onDebounce: (value: string) => void;
}

export const SearchInput = ({ onDebounce }: Props) => {

    const [textValue, setTextValue] = useState('')

    const debauncedValue = useDebouncedValue(textValue)

    useEffect(() => {
        onDebounce(debauncedValue)
    }, [debauncedValue])
    

    return (
        <View style={styles.container}>
            <View style={styles.textBackground}>
                <TextInput 
                    placeholder="Search"
                    style={styles.textInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={textValue}
                    onChangeText={setTextValue}
                />

                <Icon name="search" color="grey" size={ 30 }  />
            </View>        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'red',
    },

    textBackground: {
        backgroundColor: '#f3f1f3',
        borderRadius: 50,
        height: 40,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },

    textInput: {
        fontSize: 18,
        flex: 1,
    },
});
