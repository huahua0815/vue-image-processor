<template>
  <div class="drag-wrap">
    <div class="img-list">
      <span> 图片选择列表 </span>
      <div
        class="img-drag"
        v-for="(img, index) in imgList"
        :key="img.src"
        draggable="true"
        :ref="`img-drag-${img.id}`"
        @dragstart="handleDrag(index)"
      >
        <img :src="img.src" class="drag-img" alt="" />
      </div>
    </div>
    <span> 模版配置列表 </span>
    <div class="img-template-list">
      <div
        class="img-template-item"
        v-for="(template, index) in boxTemplateList"
        @click="changeTemplate(index)"
      >
        <boxTemplate
          :basis="template.basis"
          :ratio="template.ratio"
          :row="template.row"
          :column="template.column"
        />
      </div>
    </div>
    <div class="img-operation">
      <div class="img-box-table-wrap">
        <span>图片拼接区</span>
        <div class="img-box-table" v-if="boxTableData.length">
          <div class="img-box-row" v-for="(col, i) in imgBoxConfig.row">
            <div class="img-box-col" v-for="(column, j) in imgBoxConfig.column">
              <div
                class="img-box"
                :style="{
                  width: imgBoxConfig.basis + 'px',
                  height: imgBoxConfig.basis * imgBoxConfig.ratio + 'px',
                }"
                @dragover="handleDragOver"
                @drop="handleDrop(i, j)"
              >
                <!-- <img  v-if="boxTableData[i][j].src" class="img-placeholder" :src="boxTableData[i][j].src" alt=""> -->
                <imgBoxCut
                  :src="boxTableData[i][j].src"
                   :boxInfo="imgBoxConfig"
                  :position="{ row: i, column: j }"
                  @ready="handleImgBoxCutReady"
                  @move="handleImgBoxMove"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="img-box-config-wrap">
        <span>图片拼接配置</span>
        <div class="img-box-config">
          <div class="img-box-config-item">
            <span>规则单元格宽度:</span>
            <input type="text" v-model="imgBoxConfig.basis" />
          </div>
          <div class="img-box-config-item">
            <span>规则单元格高/宽比例:</span>
            <input type="text" v-model="imgBoxConfig.ratio" />
          </div>
        </div>
      </div>
    </div>
    <div class="img-result">
      <div class="img-preview">
        <span>图片拼接预览</span>
       
        <canvas ref="canvasResultRef"></canvas>
      </div>
      <div class="img-result-operatio">
        <button @click="handlePreview">预览</button>
        <button @click="handleDownload">下载</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import imgBoxCut from "./img-box-cut.vue";
import boxTemplate from "./box-template.vue";
import { ImgTemplateBox } from "./type";
import { fillModePuzzle } from "@/algorithm/puzzle.ts";
const imgList = ref([
  {
    id: 1,
    src: "http://image.sp.com/material/84906539c54c26287cddaf8e54266df8.jpg",
  },
  {
    id: 2,
    src: "http://image.sp.com/material/55cd76c85641ee5232e398276e1cfab1.jpg",
  },
]);

const activeTemplate = ref(0);
const boxTemplateList = ref([
  { row: 1, column: 3, basis: 30, ratio: 3 },
  { row: 3, column: 1, basis: 80, ratio: 1 / 2 },
  { row: 2, column: 2, basis: 40, ratio: 1 },
  { row: 1, column: 3, basis: 40, ratio: 2 },
  { row: 1, column: 2, basis: 40, ratio: 2 },
  { row: 2, column: 1, basis: 80, ratio: 1 / 2 },
]);

const imgBoxConfig = reactive<ImgTemplateBox>({
  row: 1,
  column: 3,
  basis: 150,
  ratio: 3,
});

const boxTableData = ref([]);

const generateBoxTableData = ()=>{
  const tableData = [];
for (let row = 0; row < imgBoxConfig.row; row++) {
  const rowData = [];
  for (let column = 0; column < imgBoxConfig.column; column++) {
    rowData.push({ row, column, src: "", imgEle:null, canvasInfo:null });
  }
  tableData.push(rowData);
}
boxTableData.value = tableData
}

const curInfo = reactive({
  imgIndex: -1,
  boxCordinate: [-1, -1],
});

const handleDragOver = (e: Event) => {
  e.preventDefault();
};

const handleDrag = (index: number) => {
  curInfo.imgIndex = index;
};

const handleDrop = (i: number, j: number) => {
  boxTableData.value[i][j].src = imgList.value[curInfo.imgIndex].src;
};

const changeTemplate = (index: number) => {
  imgBoxConfig.row = boxTemplateList.value[index].row;
  imgBoxConfig.column = boxTemplateList.value[index].column;
  imgBoxConfig.ratio = boxTemplateList.value[index].ratio;
  generateBoxTableData()
};

const init = () => {
  generateBoxTableData()
};

onMounted(()=>{
  init()
});

const canvasResultRef = ref(null)
const handlePreview = ()=>{
  const canvas = canvasResultRef.value
  fillModePuzzle(boxTableData.value, canvas)
  console.log('after canvasRes', canvas)
}

const handleDownload = ()=>{
  const canvas = canvasResultRef.value
  let url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.download = 'test.png'
  a.href = url
  a.click()
  document.body.removeChild(a)
}

const handleImgBoxCutReady = (imgInfo:any, position:any)=>{
  // console.log("handleImgBoxCutReady", imgInfo, position)
  const {row, column } = position
  boxTableData.value[row][column].imgEle = imgInfo.imgEle
}

const handleImgBoxMove = (canvasInfo:any, position:any)=>{
  const {row, column } = position
  boxTableData.value[row][column].canvasInfo = canvasInfo
  console.log('boxTableData.value', boxTableData.value)
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
  border-left: 1px solid black;
  border-top: 1px solid black;
  margin-right: 16px;
  .img-box-row {
    display: flex;
    border-bottom: 1px solid black;
  }
  .img-box {
    border-right: 1px solid black;
    background-color: #fff;
    box-sizing: border-box;
    // overflow: hidden;
  }
}

.img-placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-template-list {
  display: flex;
  margin: 10px 0;
  .img-template-item {
    margin-right: 16px;
  }
}
.img-box-config {
  width: 600px;
  margin-bottom: 20px;
  &-item {
    display: flex;
    margin-bottom: 8px;
  }
}
.img-operation {
  display: flex;
}
</style>
