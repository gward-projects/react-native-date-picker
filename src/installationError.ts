import {Platform} from 'react-native'

const getMessage = (message: string[]) => {
    return [
        'react-native-date-picker is not installed correctly. Make sure you: ',
        '',
        ...message,
        '',
        'Please reply in this thread if this solved your issue or not: ',
        'https://github.com/henninghall/react-native-date-picker/issues/404',
        '',
        "To ignore this warning, add 'global.ignoreDatePickerWarning = true' to the top of your index file.",
    ].join('\n')
}

const messages = {
    ios: {
        expo: getMessage([
            "1. Have rebuilt your app (with for instance 'npx expo run:ios')",
            '2. Are not using Expo Go (Expo Go is unsupported). See README for more info: ',
            'https://github.com/henninghall/react-native-date-picker',
        ]),
        nonExpo: getMessage([
            "1. Installed pods (by for instance running 'cd ios && pod install')",
            "2. Rebuilt the app (by for instance 'npx react-native run-ios')",
        ]),
    },
    android: {
        expo: getMessage([
            "1. Have rebuilt your app (with for instance 'npx expo run:android')",
            '2. Are not using Expo Go (Expo Go is unsupported). See README for more info: ',
            'https://github.com/henninghall/react-native-date-picker',
        ]),
        nonExpo: getMessage([
            "1. Rebuilt the app (by for instance 'npx react-native run-ios')",
        ]),
    },
}

export const getInstallationErrorMessage = () => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
        return 'react-native-date-picker is not supported on this platform'
    }
    try {
        // Only detects whether the app uses Expo: expo-constants is not a dependency.
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('expo-constants')
        return messages[Platform.OS].expo
    } catch {
        return messages[Platform.OS].nonExpo
    }
}
