import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface Props {
    onDebounce: (value: string) => void;
}

export const SearchInput = ({ onDebounce }: Props) => {

    const [textValue, setTextValue] = useState('')
    const { colorScheme } = useContext(AuthContext)
    const debauncedValue = useDebouncedValue(textValue)

    useEffect(() => {
        onDebounce(debauncedValue)
    }, [debauncedValue])
    

    return (
        <View style={{
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'        
        }}>
            <View style={{
                ...styles.textBackground,
                backgroundColor: colorScheme === 'dark' ? '#6c6c6c' : '#f3f1f3'
            }}>
                <TextInput 
                    placeholder="Search"
                    style={{
                        ...styles.textInput,
                        color: colorScheme === 'dark' ? '#fff' : '#000'
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={textValue}
                    onChangeText={setTextValue}
                />

                <Icon name="search" color={
                    colorScheme === 'dark' ? '#fff' : 'grey'
                } size={ 30 }  />
            </View>        
        </View>
    )
}

const styles = StyleSheet.create({
    
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
