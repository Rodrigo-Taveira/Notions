import React from 'react'
import { ScrollView, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import Icone from 'react-native-vector-icons/MaterialIcons'
import commonStyles from '../commonStyles'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'

export default props => {

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('AuthOrApp')
    }

    return (
        <ScrollView>
            <Text style={styles.title}>Notions</Text>
            <View style={styles.header}>
                {/* <Gravatar 
                    style={styles.avatar}
                    options={{
                        email: props.navigation.getParam('email'),
                        secure: true
                    }}
                /> */}
                
                <Image
                    style={styles.avatar}
                    source={{ uri: "https://github.com/Rodrigo-Taveira.png" }}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{props.navigation.getParam('name')}</Text>
                    <View style={{flexDirection: 'row'}}>
                        {/* <Icone name='account-circle' size={20} style={{marginRight: 5}}/> */}
                        <Text style={styles.email}>{props.navigation.getParam('email')}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={logout}>
                    <View>
                        <Icon name='sign-out' size={25} color='#D93636' />
                    </View>
                </TouchableOpacity>
            </View>
            <DrawerItems {...props} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#ddd',
        // marginTop: 30,
        marginLeft: 10,
        paddingBottom: 20
    },
    avatar: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 1,
    },
    userInfo: {
        color: '#000',
        paddingTop: 10,
        fontFamily: commonStyles.fontFamily
    },
    name: {
        fontSize: 20,
        color: commonStyles.colors.mainText
    },
    email: {
        fontSize: 15,
        color: commonStyles.colors.subText,
        paddingVertical: 10
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: "#d83535",
        fontSize: 30,
        paddingBottom: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10
    },
})