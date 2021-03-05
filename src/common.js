import { Alert, Platform } from 'react-native'

const server = Platform.OS === 'ios'
    ? 'http://localhost:3333' : 'http://10.0.2.2:3333'

function showError(err) {
    if( err.response && err.response.data){
        Alert.alert('Ops! Ocorreu um problema:', `${err.response.data}`)
    } else {
        Alert.alert('Ops! Ocorreu um problema', `${err}`)
    }
}

function showSucess(msg) {
    Alert.alert('Sucesso', ` Mensagem: ${msg}`)
}

export { server, showError, showSucess }