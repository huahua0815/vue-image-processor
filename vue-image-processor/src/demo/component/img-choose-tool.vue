<template>
  <div :class="['img-choose-tool-wrap', { 'active': number !== -1 }]">
    <el-image :src="src" :style="{ maxWidth: `${width}px`, maxHeight: `${height}px` }"></el-image>
    <div class="mask">
      <svg class="cirle-icon" width="16px" height="16px">
        <circle cx="8" cy="8" r="8" :fill="number === -1 ? '#707070AD' : '#5236f2'" />
        <text v-if="number !== -1" x="8" y="10" font-size="12px" text-anchor="middle" dominant-baseline="middle" fill="#fff">{{ number }}</text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  width: number
  height: number
  number: number //-1表示未选，大于零的数字表示被第几个选中
}
const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.img-choose-tool-wrap {
  position: relative;

  &:hover {
    .mask {
      display: block;
    }
  }
  .mask {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.308);
    .cirle-icon {
      position: absolute;
      top: 4px;
      left:4px;
      pointer-events: none;
      
    }
  }
  &.active {
    .mask {
      display: block;
    }
  }
}
</style>
