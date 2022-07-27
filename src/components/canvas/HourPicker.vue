<template>
  <div class="picker-container">
    <v-stage
      :config="configKonva"
      ref="hourPicker"
      @mousemove="handleMousemove"
      @mousedown="enableTouch"
      @mouseup="disableTouch"
    >
      <v-layer>
        <v-rect
          v-for="(v, i) in list"
          :key="i"
          :config="getConfig(v, i)"
          @click="handleBrickClick(v)"
        />
      </v-layer>
    </v-stage>

    <div class="w-full mt-6px">
      <div class="-mx-1px flex items-center">
        <div class="px-1px flex-1 text-12px leading-18px" v-for="i in list">
          <div class="text-white text-opacity-60">{{ i }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { range } from "lodash"
const props = withDefaults(
  defineProps<{
    /** 已经选择的时间 */
    value?: number[]
  }>(),
  {
    value: () => []
  }
)

const emit = defineEmits<{
  /** 选区改变 */
  (event: "input", value: number[]): void
}>()

const gap = 2
const size = 18
const list = range(0, 24)
const width = (list.length - 1) * gap + list.length * size

/** 开始选择X */
const startX = ref(0)

const hourPicker = ref()
const isTouch = ref(false)

const enableTouch = () => {
  isTouch.value = true
}

const disableTouch = () => {
  isTouch.value = false
}

const configKonva = {
  width,
  height: size
}

const bg = "#a7a7a7"
const bgActive = "#4176ff"

function handleBrickClick(v: number) {
  // console.log("handleBrickClick", v, props.value)
  let newValue: number[] = []
  if (props.value.includes(v)) {
    newValue = props.value.filter((el) => el != v)
  } else {
    newValue = [...props.value, v].sort((a, b) => a - b)
  }
  emit("input", newValue)
}

function getConfig(value: number, index: number) {
  return {
    x: index * size + index * gap,
    y: 0,
    width: size,
    height: size,
    fill: props.value.includes(value) ? bgActive : bg,
    drag: true
  }
}

function handleMousemove(e: MouseEvent) {
  if (isTouch.value) {
    console.log("handleMousemove", e.movementX)
  }
}

onMounted(() => {
  nextTick(() => {
    // const el = hourPicker.value
    // console.log(el.getNode())
  })
})
</script>
<style scoped>
.picker-container {
  width: v-bind(width + "px");
}
</style>
