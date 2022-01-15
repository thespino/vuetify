// Styles
import './VStepper.sass'

// Components
import { VStepperStep } from './VStepperStep'
import { VStepperContent } from './VStepperContent'
import { VStepperLine } from './VStepperLine'
import { VWindow } from '@/components/VWindow'

// Composables
import { makeGroupProps, useGroup } from '@/composables/group'
import { makeTagProps } from '@/composables/tag'

// Utilities
import { computed, provide, toRef } from 'vue'
import { defineComponent } from '@/util'

// Types
import type { InjectionKey, PropType } from 'vue'
import type { GroupProvide } from '@/composables/group'

export const VStepperGroupProvideSymbol: InjectionKey<GroupProvide> = Symbol.for('vuetify:v-stepper-group')
export const VStepperProvideSymbol: InjectionKey<any> = Symbol.for('vuetify:v-stepper')

export const VStepper = defineComponent({
  name: 'VStepper',

  props: {
    stackedLabels: Boolean,
    nonLinear: Boolean,
    flat: Boolean,
    direction: {
      type: String,
      default: 'vertical',
      validator: (v: any) => ['vertical', 'horizontal'].includes(v),
    },
    items: Array as PropType<any[]>,
    ...makeGroupProps({
      mandatory: 'force' as const,
    }),
    ...makeTagProps(),
  },

  emits: {
    'update:modelValue': (v: any) => true,
  },

  setup (props, { slots, emit }) {
    const group = useGroup(props, VStepperGroupProvideSymbol)

    provide(VStepperProvideSymbol, {
      stackedLabels: toRef(props, 'stackedLabels'),
      direction: toRef(props, 'direction'),
    })

    const classes = computed(() => ([
      'v-stepper',
      `v-stepper--${props.direction}`,
    ]))

    return () => {
      if (props.direction === 'vertical') {
        return (
          <props.tag class={ classes.value }>
            { props.items?.map((item, index) => (
              <>
                <VStepperStep { ...item } step={ index + 1 } v-slots={ slots } />

                <div class="v-stepper__wrapper">
                  <VStepperLine empty={ index + 1 === Number(props.items?.length) } />
                  <VStepperContent { ...item } step={ index + 1 } v-slots={ slots } />
                </div>
              </>
            )) }
          </props.tag>
        )
      }

      return (
        <props.tag class={ classes.value }>
          <div class="v-stepper__header">
            { props.items?.map((item, index) => (
              <>
                <VStepperStep { ...item } step={ index + 1 } v-slots={ slots } />
                { index + 1 < Number(props.items?.length) && (
                  <VStepperLine />
                ) }
              </>
            )) }
          </div>

          <div class="v-stepper__wrapper">
            <VWindow modelValue={ group.selected.value }>
              { props.items?.map((item, index) => (
                <VStepperContent { ...item } step={ index + 1 } v-slots={ slots } />
              )) }
            </VWindow>
          </div>
        </props.tag>
      )
    }
  },
})
