import React, {useCallback} from 'react'
import {StyleSheet} from 'react-native'

import {getNativeComponent} from './modules'
import type {NativePickerProps, PlatformPickerProps} from './types'
import {useModal} from './modal'

type DateEvent = {nativeEvent: {timestamp: string}}

type IOSNativeProps = NativePickerProps<DateEvent>

const NativeComponent = getNativeComponent<IOSNativeProps>()

export const DatePickerIOS = (props: PlatformPickerProps) => {
    const onChange = useCallback(
        (event: DateEvent) => {
            const nativeTimeStamp = event.nativeEvent.timestamp
            if (props.onDateChange) props.onDateChange(new Date(nativeTimeStamp))
        },
        [props]
    )

    const modifiedProps: IOSNativeProps = {
        ...props,
        onChange,
        style: [styles.datePickerIOS, props.style],
        date: props.date ? props.date.toISOString() : undefined,
        locale: props.locale ? props.locale : undefined,
        maximumDate: props.maximumDate
            ? props.maximumDate.toISOString()
            : undefined,
        minimumDate: props.minimumDate
            ? props.minimumDate.toISOString()
            : undefined,
        theme: props.theme ? props.theme : 'auto',
    }

    useModal({props: modifiedProps, id: undefined})

    if (props.modal || !NativeComponent) return null

    return (
        <NativeComponent
            {...modifiedProps}
            onStartShouldSetResponder={() => true}
            onResponderTerminationRequest={() => false}
        />
    )
}

const styles = StyleSheet.create({
    datePickerIOS: {
        height: 216,
        width: 310,
    },
})
