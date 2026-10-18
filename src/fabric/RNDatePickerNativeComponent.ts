import {codegenNativeComponent} from 'react-native'
import type {CodegenTypes, HostComponent, ViewProps} from 'react-native'

type DateEvent = {
    timestamp: CodegenTypes.Double
}

export interface NativeProps extends ViewProps {
    locale?: string
    date: string
    maximumDate?: string
    minimumDate?: string
    minuteInterval?: CodegenTypes.Int32
    mode?: CodegenTypes.WithDefault<'date' | 'time' | 'datetime' | 'yearAndMonth', 'datetime'>
    onChange: CodegenTypes.BubblingEventHandler<DateEvent>

    // Type has to be string to allow null/undefined as value.
    // For timezoneOffset, undefined and 0 means different things. 0 means GMT and undefined means device timezone.
    timeZoneOffsetInMinutes?: string | null
    textColor?: string
    dividerColor?: string
    buttonColor?: string
    is24hourSource?: CodegenTypes.WithDefault<'locale' | 'device', 'device'>
    theme?: CodegenTypes.WithDefault<'light' | 'dark' | 'auto', 'auto'>

    // Modal props
    modal?: boolean
    open?: boolean
    onConfirm?: CodegenTypes.BubblingEventHandler<DateEvent>
    onCancel?: CodegenTypes.BubblingEventHandler<undefined>
    confirmText?: string
    cancelText?: string
    title?: string
}

export default codegenNativeComponent<NativeProps>(
    'RNDatePicker'
) as HostComponent<NativeProps>
