<template>
  <div class="flex items-center justify-center flex-col relative">
    <div
      class="icon w-28px h-28px relative cursor-pointer before:(w-full h-full absolute rounded-4px block scale-0 duration-150) hover:(before:bg-hex-535e6b scale-1)"
    >
      <div class="absolute z-1 w-full h-full flex items-center justify-center">
        <slot />
      </div>
    </div>
    <div v-if="label" class="mt-6px text-hex-f7f8f9 text-14px">
      {{ label }}
    </div>
  </div>
</template>
<script lang="ts" setup>
export type ButtonProps = {
  label?: string
}
withDefaults(defineProps<ButtonProps>(), {})
</script>
<style scoped lang="less">
.icon {
  &::before {
    content: "";
    // background: #535e6b;
    // background: #046dec;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  // &:hover {
  //   .icon::before {
  //     background: #046dec;
  //     transform: scale(1) !important;
  //   }
  // }
}
</style>
