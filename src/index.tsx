import React from 'react'
import {Appearance, Platform, Text} from 'react-native'

import {colorToHex} from './colorToHex'
import type {DatePickerProps, PlatformPickerProps} from './types'
import {throwIfInvalidProps} from './propChecker'

export type {DatePickerProps} from './types'

// Required lazily: each platform module looks up its native component when loaded,
// which throws on the other platform. A static import would load both.
/* eslint-disable @typescript-eslint/no-require-imports */
const DatePicker = Platform.select<() => React.ComponentType<PlatformPickerProps>>({
    android: () => (require('./DatePickerAndroid') as typeof import('./DatePickerAndroid')).DatePickerAndroid,
    ios: () => (require('./DatePickerIOS') as typeof import('./DatePickerIOS')).DatePickerIOS,
    default: () => () =>
        <Text>DatePicker is not supported on this platform.</Text>,
})()
/* eslint-enable @typescript-eslint/no-require-imports */

const DatePickerWrapper = (props: DatePickerProps) => {
    if (__DEV__) throwIfInvalidProps(props)
    return (
        <DatePicker
            {...props}
            textColor={colorToHex(getTextColor(props))}
            dividerColor={colorToHex(getDividerColor(props))}
            buttonColor={colorToHex(getButtonColor(props))}
            theme={getTheme(props)}
            title={getTitle(props)}
            confirmText={props.confirmText ? props.confirmText : 'Confirm'}
            cancelText={props.cancelText ? props.cancelText : 'Cancel'}
            minuteInterval={props.minuteInterval ? props.minuteInterval : 1}
            mode={props.mode ? props.mode : 'datetime'}
            timeZoneOffsetInMinutes={
                props.timeZoneOffsetInMinutes == null
                    ? ''
                    : props.timeZoneOffsetInMinutes.toString()
            }
        />
    )
}

const getTheme = (props: DatePickerProps): DatePickerProps['theme'] => {
    if (props.theme) return props.theme
    if (!Appearance) return 'auto'
    const scheme = Appearance.getColorScheme()
    if (scheme === 'light' || scheme === 'dark') return scheme
    return undefined
}

const getDividerColor = (props: DatePickerProps) => {
    if (props.dividerColor) return props.dividerColor
    const theme = getTheme(props)
    if (theme === 'dark') return 'white'
    if (theme === 'light') return 'black'
    return undefined
}

const getTextColor = (props: DatePickerProps) => {
    const theme = getTheme(props)
    if (theme === 'dark') return 'white'
    if (theme === 'light') return 'black'
    return undefined
}

const getButtonColor = (props: DatePickerProps) => {
    if (props.buttonColor) return props.buttonColor
    const theme = getTheme(props)
    if (theme === 'dark') return 'white'
    if (theme === 'light') return 'black'
    return undefined
}

const getTitle = (props: DatePickerProps) => {
    const {title, mode} = props
    if (title === null) return ''
    if (title) return title
    if (mode === 'time') return 'Select time'
    return 'Select date'
}

export default React.memo(DatePickerWrapper)
