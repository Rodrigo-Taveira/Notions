import React, { Component } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    Alert
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'

import { server, showError } from '../common'

import todayImage from '../../assets/image/today.jpg'
import tomorrowImage from '../../assets/image/tomorrow.jpg'
import weekImage from '../../assets/image/week.jpg'
import monthImage from '../../assets/image/month.jpg'

import commonStyle from '../commonStyles'
import Task from '../components/Task'
import AddTask from './AddTask'


const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: []
}

export default class TaskList extends Component {

    state = {
        ...initialState
    }

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTasks
        }, this.filterTasks)
        this.loadTasks()
    }

    loadTasks = async () => {
        try {
            const maxDate = moment()
                .add({ days: this.props.daysAhead })
                .format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data }, this.filterTasks)
        } catch (error) {
            showError(error)
        }
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            const pending = task => task.doneAt === null
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })

        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    addTask = async newTask => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados invalidos', 'Descrição não informada!')
            return
        }
        console.log(newTask.date)
        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })
            this.setState({ showAddTask: false }, this.loadTasks)
        } catch (error) {
            showError(error)
        }


    }

    deleteTask = async id => {
        try {
            await axios.delete(`${server}/tasks/${id}`)
            this.loadTasks()
        } catch (error) {
            showError(error)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commonStyle.colors.today
            case 1: return commonStyle.colors.tomorrow
            case 7: return commonStyle.colors.week
            default: return commonStyle.colors.month
        }
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMM') //formatação da data
        return (
            <View style={styles.container}>
                <AddTask
                    isVisible={this.state.showAddTask}
                    onCancel={() => this.setState({ showAddTask: false })}
                    onSave={this.addTask}
                />
                <ImageBackground source={this.getImage()} style={styles.background}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                            <Icon
                                name='bars'
                                size={20} color={commonStyle.colors.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toggleFilter} >
                            <Icon
                                name={this.state.showDoneTasks ?
                                    'eye' : 'eye-slash'}
                                size={20} color={commonStyle.colors.secondary} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList
                        data={this.state.visibleTasks}
                        keyExtractor={item => `${item.id}`}
                        renderItem={({ item }) =>
                            <Task {...item}
                                onclick={this.toggleTask}
                                onDelete={this.deleteTask}
                            />}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.addButton, {backgroundColor: this.getColor()}]}
                    onPress={() => this.setState({ showAddTask: true })}
                    activeOpacity={0.7}
                >
                    <Icon name='plus' size={20} color={commonStyle.colors.secondary} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={this.loadTasks}
                    activeOpacity={0.7}
                >
                    <Icon name='refresh' size={20} color={commonStyle.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3
    },
    taskList: {
        flex: 7,
        // marginTop: 10,
        backgroundColor: '#fff'
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyle.fontFamily,
        color: commonStyle.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        // marginBottom: 20, //lembrar de descomentar
    },
    subtitle: {
        fontFamily: commonStyle.fontFamily,
        color: commonStyle.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
        // borderWidth: 1,
        // borderColor: 'red',
    },
    iconBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginTop: Platform.OS === 'ios' ? 40 : 10
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButton: {
        position: 'absolute',
        right: 30,
        bottom: 85,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#36d964",
        justifyContent: 'center',
        alignItems: 'center',
    },
})
