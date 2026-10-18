import React, {useCallback, useEffect, useRef} from 'react'
import {NativeEventEmitter} from 'react-native'

import {getNativeComponent, getNativeModule} from './modules'
import type {NativePickerProps, PlatformPickerProps} from './types'
import {useModal} from './modal'

type DateData = {date: string, id: string | null, dateString: string}
type SpinnerStateData = {spinnerState: 'spinning' | 'idle', id: string | null}

// Old architecture sends the data through the event emitter, new architecture through the component event.
type NativeData<T> = {nativeEvent: T} | (T & {nativeEvent?: undefined})

type AndroidNativeProps = NativePickerProps<NativeData<DateData>, NativeData<SpinnerStateData>>

const NativeComponent = getNativeComponent<AndroidNativeProps>()
const NativeModule = getNativeModule()

const height = 180
const timeModeWidth = 240
const defaultWidth = 310

export const DatePickerAndroid = React.memo(function DatePickerAndroid(props: PlatformPickerProps) {
    const thisId = useRef(Math.random().toString()).current

    const onChange = useCallback(
        (e: NativeData<DateData>) => {
            const {date, id, dateString} = e.nativeEvent ?? e
            const newArch = id !== null
            if (newArch && id !== thisId) return
            const jsDate = fromIsoWithTimeZoneOffset(date)
            if (props.onDateChange) props.onDateChange(jsDate)
            if (props.onDateStringChange) props.onDateStringChange(dateString)
        },
        [props, thisId]
    )

    const onSpinnerStateChanged = useCallback(
        (e: NativeData<SpinnerStateData>) => {
            const {spinnerState, id} = e.nativeEvent ?? e
            const newArch = id !== null
            if (newArch && id !== thisId) return
            if (props.onStateChange) props.onStateChange(spinnerState)
        },
        [props, thisId]
    )

    useEffect(() => {
        const eventEmitter = new NativeEventEmitter<{
            dateChange: [NativeData<DateData>],
            spinnerStateChange: [NativeData<SpinnerStateData>],
        }>(NativeModule)
        const subscriptionDateChange = eventEmitter.addListener('dateChange', onChange)
        const subscriptionSpinnerStateChange = eventEmitter.addListener('spinnerStateChange', onSpinnerStateChanged)
        return () => {
            subscriptionDateChange.remove()
            subscriptionSpinnerStateChange.remove()
        }
    }, [onChange, onSpinnerStateChanged])

    const modifiedProps: AndroidNativeProps = {
        ...props,
        date: toIsoWithTimeZoneOffset(props.date),
        id: thisId,
        minimumDate: toIsoWithTimeZoneOffset(props.minimumDate),
        maximumDate: toIsoWithTimeZoneOffset(props.maximumDate),
        timezoneOffsetInMinutes: getTimezoneOffsetInMinutes(props),
        style: getStyle(props),
        onChange,
        onStateChange: onSpinnerStateChanged,
    }

    useModal({props: modifiedProps, id: thisId})

    if (props.modal || !NativeComponent) return null

    return <NativeComponent {...modifiedProps} />
})

const getStyle = (props: PlatformPickerProps) => {
    const width = props.mode === 'time' ? timeModeWidth : defaultWidth
    return [{width, height}, props.style]
}

const getTimezoneOffsetInMinutes = (props: PlatformPickerProps) => {
    // eslint-disable-next-line eqeqeq
    if (props.timeZoneOffsetInMinutes == undefined) return undefined
    return props.timeZoneOffsetInMinutes
}

const toIsoWithTimeZoneOffset = (date: Date | undefined) => {
    if (!date) return undefined
    return date.toISOString()
}

const fromIsoWithTimeZoneOffset = (timestamp: string) => {
    return new Date(timestamp)
}

export default DatePickerAndroid
