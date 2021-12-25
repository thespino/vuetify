// Styles
import './VStepperContent.sass'

// Components
import { VExpandTransition } from '@/components/transitions'

// Composables
import { useLazy } from '@/composables/lazy'

// Utilities
import { computed, inject } from 'vue'
import { defineComponent } from '@/util'
import { VStepperGroupProvideSymbol, VStepperProvideSymbol } from './VStepper'

export const VStepperContent = defineComponent({
  name: 'VStepperContent',

  inheritAttrs: false,

  props: {
    step: {
      type: Number,
      required: true,
    },
    value: null,
    eager: Boolean,
  },

  setup (props, { slots, emit }) {
    const group = inject(VStepperGroupProvideSymbol)

    if (!group) throw new Error('foo')

    const open = computed(() => {
      const item = group.items.value[props.step - 1]
      return !!item && group.selected.value.includes(item.id)
    })

    const { hasContent, onAfterLeave } = useLazy(props, open)

    const stepper = inject(VStepperProvideSymbol)

    if (!stepper) throw new Error('foo')

    return () => (
      <div
        class={[
          'v-stepper-content',
          `v-stepper-content--${stepper.direction.value}`,
        ]}
      >
        <VExpandTransition onAfterLeave={ onAfterLeave }>
          <div
            class="v-stepper-content__wrapper"
            v-show={ open.value }
          >
            { slots[`content.${props.value}`] && hasContent.value && slots[`content.${props.value}`]!(group) }
          </div>
        </VExpandTransition>
      </div>
    )
  },
})
