import {StyleSheet} from 'react-native'

import type {DatePickerProps} from './types'

export function throwIfInvalidProps(props: DatePickerProps) {
    checks.forEach((check) => check.validate(props))
}

type IsInvalid = (props: DatePickerProps) => boolean | undefined

class PropCheck {
    constructor(
        private readonly isInvalid: IsInvalid,
        private readonly errorText: string,
    ) {}

    validate = (props: DatePickerProps) => {
        if (this.isInvalid(props)) {
            throw new Error(
                `${this.errorText} Check usage of react-native-date-picker.`
            )
        }
    }
}

const dateCheck = new PropCheck(
    (props) => props && !(props.date instanceof Date),
    'Invalid or missing Date prop. Must be a Date object.'
)

const widthCheck = new PropCheck(
    (props) => {
        const width = props && StyleSheet.flatten(props.style)?.width
        return !!width && typeof width !== 'number'
    },
    'Invalid style: width. Width needs to be a number. Percentages or other values are not supported.'
)

const heightCheck = new PropCheck(
    (props) => {
        const height = props && StyleSheet.flatten(props.style)?.height
        return !!height && typeof height !== 'number'
    },
    'Invalid style: height. Height needs to be a number. Percentages or other values are not supported.'
)

const modeCheck = new PropCheck(
    (props) =>
        props &&
        !!props.mode &&
        !['datetime', 'date', 'time', 'yearAndMonth'].includes(props.mode),
    "Invalid mode. Valid modes: 'datetime', 'date', 'time'"
)

const themeCheck = new PropCheck(
    (props) =>
        props && !!props.theme && !['light', 'dark', 'auto'].includes(props.theme),
    "Invalid theme. Valid options: 'light', 'dark', 'auto'"
)

const checks = [dateCheck, widthCheck, heightCheck, modeCheck, themeCheck]
