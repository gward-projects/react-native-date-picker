import type {CodegenTypes, TurboModule} from 'react-native'
import {TurboModuleRegistry} from 'react-native'

export interface Spec extends TurboModule {
    // Codegen reads this spec: it needs an object literal type, not Record<string, never>.
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    readonly getConstants: () => {}

    closePicker(): void

    openPicker(props: CodegenTypes.UnsafeObject): void

    removeListeners(type: CodegenTypes.Double): void

    addListener(eventName: string): void
}

export default TurboModuleRegistry.get<Spec>('RNDatePicker')
