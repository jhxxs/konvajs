<template>
  <div>
    <div class="flex">
      <div class="mr-12px">
        <div
          v-for="(v, index) in weekdays"
          class="label leading-18px text-right"
          :class="index < weekdays.length - 1 ? 'mb-2px' : ''"
        >
          {{ v }}
        </div>
      </div>
      <div>
        <v-stage
          class="picker-container"
          :config="configKonva"
          ref="stageRef"
          @mousemove="handleMousemove"
          @mousedown="handleMousedown"
          @mouseup="handleMouseup"
        >
          <v-layer ref="layerRef">
            <v-rect
              v-for="(v, i) in list"
              :key="i"
              name="rectangle"
              :config="getConfig(v, i)"
              @click="handleBrickClick(v)"
              :data-pos="v"
            />
            <v-rect :config="selectionRect" ref="selectionRectRef" />
          </v-layer>
        </v-stage>
        <div class="w-full mt-6px h-18px">
          <div class="-mx-1px flex items-center">
            <div class="px-1px flex-1" v-for="v in hours">
              <div class="label">{{ v }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="controller flex justify-between items-center w-full">
      <div>
        <ControlButton label="Enable">
          <el-icon name="s-open" />
        </ControlButton>
      </div>
      <div></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { range } from "lodash"
import type { ShapeConfig } from "konva/lib/Shape"
import type { Stage } from "konva/lib/Stage"
import type { Layer } from "konva/lib/Layer"
import type { Rect } from "konva/lib/shapes/Rect"
import Konva from "konva"
import ControlButton from "./ControlButton.vue"

type Value = number[][]

const props = withDefaults(
  defineProps<{
    /** 已经选择的`x`, `y`坐标 */
    value?: Value
  }>(),
  {
    value: () => []
  }
)

const emit = defineEmits<{
  /** 选区改变 */
  (event: "input", value: Value): void
}>()

const selectionStart = ref({
  x: 0,
  y: 0
})

const gap = 2
const size = 18
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const hours = range(0, 24)
const list = weekdays.map((v, vi) => hours.map((sv, svi) => [svi, vi])).flat()

const width = (hours.length - 1) * gap + hours.length * size
const height = (weekdays.length - 1) * gap + weekdays.length * size

const stageRef = ref<Stage | null>(null)
const layerRef = ref<Layer | null>(null)
const selectionRectRef = ref<Rect>()
const isTouch = ref(false)

const handleMousedown = (e: KonvaEvent) => {
  const { offsetX, offsetY } = e.evt
  isTouch.value = true

  selectionStart.value = {
    x: offsetX,
    y: offsetY
  }

  selectionRect.value.visible = true
  selectionRect.value.x = offsetX
  selectionRect.value.y = offsetY

  console.log("handleMousedown", selectionStart.value)
}

const enableAll = () => emit("input", [...list])

const disableAll = () => emit("input", [])

const handleMouseup = (e: KonvaEvent) => {
  isTouch.value = false
  selectionRect.value = {
    ...unref(selectionRect),
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
  selectionStart.value = { x: 0, y: 0 }
}

type KonvaEvent = {
  evt: MouseEvent
  target: any
}

function handleMousemove(e: KonvaEvent) {
  if (isTouch.value) {
    // console.log("handleMousemove", e.evt, selectionStart)
    const { offsetX: endX, offsetY: endY } = e.evt
    const { x: startX, y: startY } = unref(selectionStart)

    const selectW = Math.abs(endX - startX)
    const selectH = Math.abs(endY - startY)

    selectionRect.value = {
      ...unref(selectionRect),
      visible: true,
      x: Math.min(startX, endX),
      y: Math.min(startY, endY),
      width: selectW,
      height: selectH
    }

    const layer = layerRef.value?.getStage()
    const selBox = selectionRectRef.value?.getStage()?.getClientRect()!

    const pos = (
      layer?.find(".rectangle").filter((el) => {
        const elBox = el.getClientRect()
        if (Konva.Util.haveIntersection(selBox, elBox)) {
          const pos = el.attrs["data-pos"]
          if (pos) {
            // console.log(pos)
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      }) || []
    ).map((v) => v.attrs["data-pos"] as number[])

    const newValue = sortValue([...props.value, ...pos])
    emit("input", newValue)
  }
}

const configKonva = {
  width,
  height
}

const selectionRect = ref({
  fill: "transparent",
  visible: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0
})

const bg = "#a7a7a7"
const bgActive = "#4176ff"

function handleBrickClick(value: number[]) {
  //   console.log("handleBrickClick", value, props.value)
  const [vx, vy] = value
  const index = props.value.findIndex(([x, y]) => x == vx && y == vy)

  let newValue: Value = []

  if (index >= 0) {
    newValue = [...props.value]
    newValue.splice(index, 1)
  } else {
    newValue = [...props.value, value]
  }

  newValue = sortValue(newValue)

  emit("input", newValue)
}

const sortValue = (arr: Value) => arr.sort((a, b) => a[0] - b[0] || a[1] - b[1])

function getConfig(value: number[], index: number) {
  //   console.log("getConfig", value)
  const [vx, vy] = value
  const indexFind = props.value.findIndex(([x, y]) => x == vx && y == vy)
  let fill = bg
  let hitFunc: ShapeConfig["hitFunc"] = (ctx, shape) => {
    ctx.fillRect(x, y, size, size)
  }

  //   console.log(vx, vy)

  const x = vx * size + vx * gap
  const y = vy * size + vy * gap

  // 右下
  if (vx < hours.length - 1 && vy < weekdays.length - 1) {
    // console.log("1️⃣ Right Bottom")
    fill = "rgba(255, 255, 25, 0.8)"
    // hitFunc = (ctx) => {
    //   console.log(ctx)
    //   ctx.beginPath()
    //   ctx.strokeStyle = "red"
    //   ctx.moveTo(20, 20)
    //   ctx.lineTo(200, 20)
    //   ctx.stroke()
    // }
  }

  //   右
  if (vy == weekdays.length - 1 && vx < hours.length - 1) {
    // console.log("3️⃣ Right")
    fill = "cyan"
    // console.log(vx, vy)

    hitFunc = function (ctx, shape) {
      //   console.log(ctx.fill)
      console.log(shape)

      //   ctx.beginPath()
      //   ctx.rect(x, y, size + gap, size)
      //   //   context.arc(0, 0, this.outerRadius() + 10, 0, Math.PI * 2, true);
      //   ctx.closePath()
      //   //   context.fillStrokeShape(this);
      //   ctx.fillStrokeShape(this)
    }
  }

  // 下
  if (vx == hours.length - 1 && vy < weekdays.length - 1) {
    // console.log("2️⃣ Bottom")
    fill = "rgba(23, 122, 25, 0.8)"
    // hitFunc = (ctx) => {
    //   //   console.log(ctx)
    //   ctx.beginPath()
    //   ctx.strokeStyle = "red"
    //   ctx.lineWidth = 2
    //   ctx.moveTo((vx + 1) * size, vy * size)
    //   ctx.lineTo((vx + 1) * size, (vy + 1) * size)
    //   ctx.stroke()
    // }
  }

  return {
    x,
    y,
    width: size,
    height: size,
    fill: indexFind >= 0 ? bgActive : bg
    // fill,
    // hitFunc
    // hitFunc(ctx: CanvasRenderingContext2D) {
    //   // ctx.beginPath()
    // }
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
  height: v-bind(height + "px");
}

.label {
  @apply text-white text-opacity-60 text-12px leading-18px select-none;
}
</style>
