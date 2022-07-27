<template>
  <div class="text-white w-full h-full bg-hex-222">
    LAB

    <div>
      <HourPicker v-model="selectedHours" />
    </div>
    <div class="mt-20px">
      <DayAndHourPicker v-model="selectedDays" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import HourPicker from "@/components/canvas/HourPicker.vue"
import DayAndHourPicker from "@/components/canvas/DayAndHourPicker.vue"
const selectedHours = ref<number[]>([0, 12, 13, 22])
const selectedDays = ref<number[][]>([])
</script>
