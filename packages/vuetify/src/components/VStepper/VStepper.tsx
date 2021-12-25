// Styles
import './VStepper.sass'

// Components
import { VStepperStep } from './VStepperStep'
import { VStepperContent } from './VStepperContent'
import { VStepperLine } from './VStepperLine'

// Composables
import { makeGroupProps, useGroup } from '@/composables/group'
import { makeTagProps } from '@/composables/tag'

// Utilities
import { computed, provide, toRef } from 'vue'
import { defineComponent } from '@/util'

// Types
import type { InjectionKey } from 'vue'
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
    items: Array,
    ...makeGroupProps(),
    ...makeTagProps(),
  },

  emits: {
    'update:modelValue': (v: any) => true,
  },

  setup (props, { slots, emit }) {
    useGroup(props, VStepperGroupProvideSymbol)

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
                <VStepperStep { ...item } step={ index + 1 } v-slots={ slots } last={ index === (props.items?.length ?? 0) - 1 } />
                { index + 1 < Number(props.items?.length) && (
                  <VStepperLine />
                ) }
              </>
            )) }
          </div>

          <div class="v-stepper__wrapper">
            { props.items?.map((item, index) => (
              <VStepperContent { ...item } step={ index + 1 } v-slots={ slots } />
            )) }
          </div>
        </props.tag>
      )
    }
  },
})
