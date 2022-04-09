/**
 * @format
 */
import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
// import PushNotification from "";
const PushNotification = require('react-native-push-notification');

PushNotification.createChannel(
    {
        channelId: "8192", // (required)
        channelName: "REC", // (required)
        channelDescription: "Wallet App", // (optional) default: undefined.
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);


AppRegistry.registerComponent(appName, () => App);
