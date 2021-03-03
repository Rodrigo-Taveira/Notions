import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'

import commonStyle from '../commonStyles'
import AuthInput from '../components/AuthInput'
import Icon from 'react-native-vector-icons/FontAwesome'

import { server, showError, showSucess } from '../common'

const initalState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    stageNew: false
}

export default class Auth extends Component {

    state = {
        ...initalState
    }

    signInOrSignUp = () => {
        if (this.state.stageNew) {
            this.signup()
        } else {
            this.signin()
        }
    }

    signup = async () => {
        if (this.state.password !== this.state.confirmPassword) {
            Alert.alert('Erro ao criar conta', 'confirmação e senha diferentes')
            return
        }
        try {
            await axios.post(`${server}/signup`, {
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                confirmPassword: this.state.confirmPassword,
            })

            showSucess('Usuário cadastrado!')
            this.setState({ ...initalState })
        } catch (error) {
            showError(error)
        }
    }

    signin = async () => {
        try {
            const res = await axios.post(`${server}/signin`, {
                email: this.state.email,
                password: this.state.password
            })
            AsyncStorage.setItem('userData', JSON.stringify(res.data))
            axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
            this.props.navigation.navigate('Home', res.data)
        } catch (error) {
            showError(error)
        }
    }

    render() {
        const validations = []
        validations.push(this.state.email && this.state.email.includes('@'))
        validations.push(this.state.password && this.state.password.length >= 6)

        if (this.state.stageNew) {
            validations.push(this.state.name && this.state.name.trim().length >= 3)
            validations.push(this.state.password === this.state.confirmPassword)
        }
        const validForm = validations.reduce((t, a) => t && a)

        return (
            <View style={styles.background}>
                <Image
                    style={styles.image}
                    source={require('../../assets/image/undraw_Note_list_re_r4u9.png')}
                />
                <Text style={styles.title}>Notions</Text>
                <View style={styles.formContainer}>
                    {/* // NAME */}
                    {this.state.stageNew &&
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.text}>Name</Text>
                                <Text style={{ color: 'red' }}> *</Text>
                            </View>
                            <AuthInput
                                style={styles.input}
                                value={this.state.name}
                                onChangeText={name => this.setState({ name })}
                            />
                        </>
                    }
                    {/* // EMAIL */}
                    {this.state.stageNew ?
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text}>Your email</Text>
                            <Text style={{ color: 'red' }}> *</Text>
                        </View>
                        :
                        <Text style={styles.text}>Your email</Text>
                    }
                    <AuthInput
                        style={styles.input}
                        value={this.state.email}
                        onChangeText={email => this.setState({ email })}
                    />
                    {/* // PASSWORD */}
                    {this.state.stageNew ?
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.text}>Password</Text>
                            <Text style={{ color: 'red' }}> *</Text>
                        </View>
                        :
                        <Text style={styles.text}>Password</Text>
                    }
                    <AuthInput
                        style={styles.input}
                        value={this.state.password}
                        placeholder={this.state.stageNew ? "mín. 6 car." : ''}
                        secureTextEntry={true}
                        onChangeText={password => this.setState({ password })}
                    />
                    {/* // CONFIRM PASSWORD */}
                    {this.state.stageNew &&
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.text}>Confirm password</Text>
                                <Text style={{ color: 'red' }}> *</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <AuthInput
                                    style={
                                        this.state.password !== this.state.confirmPassword
                                            && this.state.password !== ''
                                            && this.state.confirmPassword.length >= this.state.password.length
                                            ? [styles.input, { borderColor: 'red' }]
                                            : styles.input
                                    }
                                    value={this.state.confirmPassword}
                                    secureTextEntry={true}
                                    onChangeText={confirmPassword => this.setState({ confirmPassword })}
                                />
                                {this.state.password !== this.state.confirmPassword
                                    && this.state.password !== ''
                                    && this.state.confirmPassword.length >= this.state.password.length
                                    && <Icon name={'times'} color={'red'} />
                                }
                            </View>
                        </>

                    }
                    {this.state.stageNew && <Text style={{ color: 'red', fontSize: 12, textAlign: 'right' }}>* obrigatório</Text>}

                    <TouchableOpacity
                        onPress={this.signInOrSignUp}
                        style={[styles.button, validForm ?
                            {} : { backgroundColor: '#ccc' }]}
                        activeOpacity={0.7} disabled={!validForm}>
                        <Text style={styles.textButton}>
                            {this.state.stageNew ? 'Create Account' : 'Sign in'}
                        </Text>
                    </TouchableOpacity>

                    {this.state.stageNew ?
                        <View style={{ flexDirection: 'row', padding: 17, justifyContent: 'center' }}>
                            <Text>Already have an account?</Text>
                            <TouchableOpacity onPress={() => this.setState({ stageNew: !this.state.stageNew })} activeOpacity={0.7}>
                                <Text style={styles.CreateTextButton}>Log in</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={() => this.setState({ stageNew: !this.state.stageNew })}
                            style={styles.Createbutton}
                            activeOpacity={0.7}>
                            <Text style={styles.CreateTextButton}>Create Account</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: commonStyle.fontFamily,
        color: "#d83535",
        fontSize: 70,
        paddingBottom: 12,
        fontWeight: 'bold',
    },
    text: {
        color: '#464d80',
        fontWeight: 'bold',
        // width: '50%'
    },
    formContainer: {
        width: '85%',
        marginBottom: 50,
    },
    image: {
        height: 120,
        width: 110,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#36D964',
        padding: 17,
        borderRadius: 15,
    },
    textButton: {
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        fontSize: 15,
    },
    Createbutton: {
        marginTop: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#d83535',
        padding: 17,
    },
    CreateTextButton: {
        fontWeight: 'bold',
        color: '#d83535',
        textAlign: 'center',
        fontSize: 15,
    },
    input: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    }
})