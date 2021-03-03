import React from 'react'
import { View, TextInput, StyleSheet } from 'react-native'

export default props => {
    return (
        <View style={styles.container}>
            <TextInput {...props} style={props.style} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
})