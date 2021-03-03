/**
 * @format
 */

import {AppRegistry} from 'react-native';
import Navigator from './src/Navigator';
// import Navigator from './src/screens/AddTask';
// import Navigator from './src/screens/TelaFLex';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Navigator);
