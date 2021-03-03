import React, { Component } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Text,
    Platform
} from 'react-native'

import commonStyle from '../commonStyles'

import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'

const initialState = { desc: '', date: new Date(), showDatePicker: false}

export default class AddTask extends Component {

    state = {
        ...initialState
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }
            
        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })
    }

    getDatePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date} 
                        onChange={(_,date) => { 
                            date = date ? date : new Date()
                            this.setState({ date, showDatePicker: false})}} 
                        mode='date' />

        const dateString = moment(this.state.date).format('dddd, D [de] MMM [de] YYYY')

        if(Platform.OS === 'android'){
            datePicker = (
                <View style={{marginLeft: 15}}>
                    <TouchableOpacity onPress={() => this.setState({showDatePicker: true})}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }

        return datePicker
    }

    render() {
        return (
            <Modal 
                transparent={true} 
                visible={this.props.isVisible}
                onRequestClose={this.props.onCancel}
                animationType='slide'
            >
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
                <View style={styles.container}>
                    <Text style={styles.header}>Nova tarefa</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Informe a descrição..."
                        value={this.state.desc}
                        onChangeText={ (desc) => this.setState({ desc })}    
                    />
                    {this.getDatePicker()}
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={styles.button}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({ ...initialState })}>
                            <Text style={styles.button}>Limpar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={styles.button}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onCancel}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>

            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
    },
    container: {
        backgroundColor: '#fff',
        // flex: 1
    },
    header: {
        fontFamily: commonStyle.fontFamily,
        backgroundColor: commonStyle.colors.today,
        color: commonStyle.colors.secondary,
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 15,
        fontSize: 18, 
    },
    input: {
        fontFamily: commonStyle.fontFamily,
        // width: '90%',
        height: 40,
        margin: 15,
        backgroundColor: '#FFF',
        borderColor: '#e3e3e3',
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 15,
        fontWeight: 'bold'
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        // borderColor: 'red',
        // borderWidth: 1,
    },
    button: {
        margin: 20,
        marginRight: 26,
        color: commonStyle.colors.today,
    },
    date: {
        fontFamily: commonStyle.fontFamily,
        fontSize: 20,
        fontWeight: 'bold'
    },
})
