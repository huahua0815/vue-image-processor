<template>
 <div class="img-template-box-table">
      <div class="img-template-box-row" v-for="(col, i) in row">
        <div class="img-template-box-col" v-for="(column, j) in column">
          <div
            class="img-template-box"
            :style="{
              width: basis + 'px',
              height: Math.ceil( basis * ratio) + 'px',
            }"
          >
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ImgTemplateBox } from './type'


const props = defineProps<ImgTemplateBox>()
</script>

<style scoped lang="scss"> 
.img-template-box-table {
  border-left: 1px solid black;
  border-top: 1px solid black;
  .img-template-box-row {
    display: flex;
    border-bottom: 1px solid black;
  }
}
.img-template-box {
  border-right: 1px solid black;
  background-color: #fff;
  box-sizing: border-box;
}
</style>