<template>
  <div class="box-template-list-wrap">
    <BoxTemplate v-for="(item, index) in templateList" v-bind="item" @click="changeTemplate(index)" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BoxTemplate from "./box-template.vue";

const templateList = ref([
  { row: 2, column: 1, isActive: false },
  { row: 1, column: 2, isActive: false },
  { row: 2, column: 2, isActive: false },
  { row: 1, column: 4, isActive: false },
]);

const changeTemplate = (index: number) => {
  templateList.value.forEach((item, i) => {
    item.isActive = i === index;
  });
}
</script>

<style scoped lang="scss">

</style>
