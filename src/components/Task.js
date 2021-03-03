import React from 'react'
import { 
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity
} from 'react-native'

import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome'
import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyle from '../commonStyles'

export default props => {

    const doneOrNotStyle = props.doneAt !== null ? styles.verified : {}
    
    const date = props.doneAt ? props.doneAt : props.estimateAt
    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMM')

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right} onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name='trash' size={20} color='#fff' />
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name='trash' size={20} color='#fff' style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
       <Swipeable
            renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}
       >
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => props.onclick(props.id)}>
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
       </Swipeable>
    )
}

function getCheckView(doneAt) {
    if(doneAt !== null){
        return (
            <View style={styles.done}>
                <Icon name="check" size={20} color='#fff'></Icon>
            </View>
        )
    } else {
       return(
            <View style={styles.pending}></View>
       )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
        shadowColor: '#fff',
        shadowOffset: {
            width: 3,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 5,
        elevation: 6,
        backgroundColor: 'white',
        padding: 12,
        margin: 10,

    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent:'center',
        // paddingHorizontal: 12
    },
    pending: {
        height: 25,
        width: 25,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 13,
        backgroundColor: "#36d964",
        justifyContent: 'center',
        alignItems: 'center'
    },
    desc: {
        fontFamily: commonStyle.fontFamily,
        color: commonStyle.colors.mainText,
        fontSize: 15,
        fontWeight: 'bold' //Lmebrar de descomentar
    },
    date: {
        fontFamily: commonStyle.fontFamily,
        color: commonStyle.colors.subText,
        fontSize: 12

    },
    verified: {
        textDecorationLine: 'line-through',
        fontStyle: 'italic'
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
        marginRight: 10,
        borderRadius: 4,
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'flex-end',
        paddingHorizontal: 10,
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 4,
    },
    excludeText: {
        fontFamily: commonStyle.fontFamily,
        color: '#fff',
        fontSize: 20,
    },
    excludeIcon: {
        marginRight: 10,
    },
})
