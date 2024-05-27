<template>
  <div :class="{ 'img-template-box-table': true, active: isActive }">
    <div class="img-template-box-row" v-for="(col, i) in row">
      <div class="img-template-box-col" v-for="(column, j) in column">
        <div
          class="img-template-box"
          :style="{
            width,
            height,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
interface ImgTemplateBox {
  row: number;
  column: number;
  isActive: boolean;
}
const config = {
  total: 40,
  padding: 2,
};

const width = computed(() => {
  const { total, padding } = config;
  let res = (total - (props.column - 1) * padding) / props.column;
  return `${res}px`;
});

const height = computed(() => {
  const { total, padding } = config;
  let res = (total - (props.row - 1) * padding) / props.row;
  return `${res}px`;
});

const props = defineProps<ImgTemplateBox>();
</script>

<style scoped lang="scss">
.img-template-box-table {
  padding: 5px 3px 3px 5px;
  border-radius: 2px;
  border: 1px solid #d3d3d3;
  transform: border-color 0.5s ease-in-out;
  width: max-content;
  height: max-content;
  &.active {
    border: 1px solid #5236f2;
    .img-template-box {
      background-color: #eae7ff;
    }
  }
  .img-template-box-row {
    display: flex;
    border-bottom: 2px solid #fff;
  }
  .img-template-box {
    border-right: 2px solid #fff;
    background-color: #f5f5f5;
    box-sizing: content-box;
    transform: background-color 0.5s ease-in-out;
  }
}
</style>
