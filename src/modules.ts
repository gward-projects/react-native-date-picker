import type {HostComponent, TurboModule} from 'react-native'
import {NativeModules, Platform, requireNativeComponent, TurboModuleRegistry} from 'react-native'

import {createInstallationError} from './installationError'

declare global {
    // Set by the app to silence the installation error, see installationError.ts.
    var ignoreDatePickerWarning: boolean | undefined
}

/** Native module shared by both platforms: iOS also receives the modal callbacks. */
export interface DatePickerNativeModule {
    addListener: (eventType: string) => void
    removeListeners: (count: number) => void
    openPicker: (...args: [props: object] | [props: object, onConfirm: (params: object) => void, onCancel: (params: object) => void]) => void
    closePicker: () => void
}

export const getNativeComponent = <T extends object>(): HostComponent<T> | null => {
    try {
        switch (Platform.OS) {
            case 'android':
            case 'ios':
                return requireNativeComponent<T>('RNDatePicker')
            default:
                throw Error(
                    'react-native-date-picker is not supported on this platform'
                )
        }
    } catch (error) {
        if (globalThis.ignoreDatePickerWarning) return null
        throw createInstallationError(error)
    }
}

export const getNativeModule = (): DatePickerNativeModule | null => {
    try {
        switch (Platform.OS) {
            case 'ios':
                return NativeModules.RNDatePicker
            case 'android':
                return TurboModuleRegistry?.get<DatePickerNativeModule & TurboModule>('RNDatePicker') || NativeModules.RNDatePicker
            default:
                throw Error(
                    'react-native-date-picker is not supported on this platform'
                )
        }
    } catch (error) {
        if (globalThis.ignoreDatePickerWarning) return null
        throw createInstallationError(error)
    }
}
