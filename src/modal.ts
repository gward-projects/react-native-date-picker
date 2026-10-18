import {useCallback, useEffect, useRef} from 'react'
import {NativeEventEmitter, Platform} from 'react-native'

import {getNativeModule} from './modules'
import type {ModalProps} from './types'

const NativeModule = getNativeModule()

type ConfirmParams = {id?: string, timestamp?: string, date?: string}
type CancelParams = {id?: string}

const shouldOpenModal = (props: ModalProps, prevProps: ModalProps | undefined) => {
    if (!props.modal) return false
    if (!props.open) return false
    const currentlyOpen = prevProps?.open
    if (currentlyOpen) return false
    return true
}

const shouldCloseModal = (props: ModalProps, prevProps: ModalProps | undefined, isClosing: boolean) => {
    if (!props.modal) return false
    if (props.open) return false
    const currentlyOpen = prevProps?.open
    if (!currentlyOpen) return false
    if (isClosing) return false
    return true
}

const usePrevious = <T>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined)
    useEffect(() => {
        ref.current = value
    })
    return ref.current
}

export const useModal = ({props, id}: {props: ModalProps, id: string | undefined}) => {
    const closing = useRef(false)
    const previousProps = usePrevious(props)

    const onConfirm = useCallback(
        (params: ConfirmParams) => {
            if (params.id !== id) return
            closing.current = true
            const date = Platform.select({
                ios: params.timestamp,
                android: params.date,
            })
            if (props.onConfirm && date !== undefined) props.onConfirm(new Date(date))
        },
        [id, props]
    )

    const onCancel = useCallback(
        (params: CancelParams) => {
            if (params?.id !== id) return
            closing.current = true
            if (props.onCancel) props.onCancel()
        },
        [id, props]
    )

    // open
    useEffect(() => {
        if (shouldOpenModal(props, previousProps)) {
            closing.current = false
            if (Platform.OS === 'android') NativeModule?.openPicker(props)
            else if (Platform.OS === 'ios') NativeModule?.openPicker(props, onConfirm, onCancel)
            else throw Error('Unsupported platform')
        }
    }, [onCancel, onConfirm, previousProps, props])

    // close
    useEffect(() => {
        if (shouldCloseModal(props, previousProps, closing.current)) {
            closing.current = true
            NativeModule?.closePicker()
        }
    }, [previousProps, props])

    useEffect(() => {
        // Not typed through NativeEventEmitter's type parameter: gward-app still compiles this file
        // with the legacy React Native types, where the class is not generic.
        const eventEmitter = new NativeEventEmitter(NativeModule ?? undefined)
        eventEmitter.addListener('onConfirm', (params) => onConfirm(params as ConfirmParams))
        eventEmitter.addListener('onCancel', (params) => onCancel(params as CancelParams))
        return () => {
            eventEmitter.removeAllListeners('onConfirm')
            eventEmitter.removeAllListeners('onCancel')
        }
    }, [onCancel, onConfirm])
}
