<template>
  <div class="drag-wrap">
   <div class="img-list"> <div
      class="img-drag"
      v-for="(img, index) in imgList"
      :key="img.src"
      draggable="true"
      :ref="`img-drag-${img.id}`"
      @dragstart="handleDrag(index)"
    >
      <img :src="img.src" class="drag-img" alt="" />
    </div></div>
    <div class="img-box-table">
      <div class="img-box-row" v-for="(col, i) in imgBoxConfig.row">
        <div class="img-box-col" v-for="(column, j) in imgBoxConfig.column">
          {{ `i:${i} j:${j}` }}
          <div
            class="img-box"
            :style="{
              width: imgBoxConfig.width + 'px',
              height: imgBoxConfig.height + 'px',
            }"
            @dragover="handleDragOver"
            @drop="handleDrop(i,j)"
          >
          <img  v-if="boxTableData[i][j].src" class="img-placeholder" :src="boxTableData[i][j].src" alt="">
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import draggable from "vuedraggable";

const imgList = ref([
  { id:1,src: "http://image.sp.com/material/84906539c54c26287cddaf8e54266df8.jpg" },
  { id:2,src: "http://image.sp.com/material/55cd76c85641ee5232e398276e1cfab1.jpg" },
]);

const imgBoxConfig = reactive({
  row: 3,
  column: 3,
  width: 200,
  height: 200,
});

const tableData = [];
for (let row = 0; row < imgBoxConfig.row; row++) {
  const rowData = [];
  for (let column = 0; column < imgBoxConfig.column; column++) {
    rowData.push({ row, column, src:'' });
  }
  tableData.push(rowData);
}

const boxTableData = ref(tableData);

const curInfo = reactive({
  imgIndex:-1,
  boxCordinate:[-1,-1]
})

const handleDragOver = (e: Event) => {
  e.preventDefault();
};

const handleDrag = (index: number)=>{
  curInfo.imgIndex = index
  console.log('drag', index)
}

const handleDrop = (i:number, j:number)=>{
  console.log("handleDrop", i, j, curInfo.imgIndex,imgList.value[curInfo.imgIndex].src)
  boxTableData.value[i][j].src = imgList.value[curInfo.imgIndex].src
}
</script>

<style scoped lang="scss">
.drag-wrap {
  width: 300px;
  height: 300px;
}
.drag-img {
  width: 200px;
}
.img-box-table {
  .img-box-row {
    display: flex;
  }
}
.img-box {
  border: 1px solid black;
  background-color: #fff;
}
.img-placeholder{
  width: 100%;
  object-fit: cover;
}
</style>
