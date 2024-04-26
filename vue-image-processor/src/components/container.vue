<template>
  <div class="drag-wrap">
    <div class="area">
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
      <div class="img-template-generate">
        <div>模版生成器</div>
        <el-form size="small">
          <el-form-item label="行数">
              <el-input v-model="curInfo.templateNew.row" />
            </el-form-item>
            <el-form-item label="列数">
              <el-input v-model="curInfo.templateNew.column" />
            </el-form-item>
            <el-form-item label="单元格宽度">
              <el-input v-model="curInfo.templateNew.basis" />
            </el-form-item>
            <el-form-item label="单元格高/宽比例">
              <el-input v-model="curInfo.templateNew.ratio" />
            </el-form-item>
            <el-form-item >
              <el-button type="primary" size="small" @click="handleGenerateTemplate">生成</el-button>
            </el-form-item>
        </el-form>
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
                <imgBoxCut
                  :src="boxTableData[i][j].src"
                  :boxInfo="imgBoxConfig"
                  :position="{ row: i, column: j }"
                  @ready="handleImgBoxCutReady"
                  @move="handleImgBoxMove"
                  ref="imgBoxCutRef"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="img-box-config-wrap">
        <span>图片拼接配置</span>
        <div class="img-box-config">
          <el-form>
            <el-form-item label="规则单元格宽度">
              <el-input v-model="imgBoxConfig.basis" />
            </el-form-item>
            <el-form-item label="规则单元格高/宽比例">
              <el-input v-model="imgBoxConfig.ratio" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="img-result-operation">
        <el-button
          class="mr-4"
          type="primary"
          :icon="View"
          @click="handlePreview"
          size="small"
          >预览</el-button
        >
        <el-button
          class="mr-4"
          type="primary"
          :icon="Download"
          @click="handleDownload"
          size="small"
          >下载</el-button
        >
      </div>
    </div>
    <div class="img-result">
      <div class="img-preview">
        <div>图片拼接预览</div>
        <canvas ref="canvasResultRef"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import imgBoxCut from "./img-box-cut.vue";
import boxTemplate from "./box-template.vue";
import { ImgTemplateBox } from "./type";
import { fillModePuzzle } from "@/algorithm/puzzle.ts";
import { Download, View } from "@element-plus/icons-vue";
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

const handleGenerateTemplate = () => {
  const { row , column, basis, ratio} = curInfo.templateNew
  boxTemplateList.value.push({
    row: Number(row), column : Number(column), basis: Number(basis), ratio
  })
  console.log('22', boxTemplateList.value)
}

const imgBoxConfig = reactive<ImgTemplateBox>({
  row: 1,
  column: 3,
  basis: 150,
  ratio: 3,
});

const boxTableData = ref([]);
const generateBoxTableData = () => {
  const tableData = [];
  for (let row = 0; row < imgBoxConfig.row; row++) {
    const rowData = [];
    for (let column = 0; column < imgBoxConfig.column; column++) {
      rowData.push({ row, column, src: "", imgEle: null, canvasInfo: null });
    }
    tableData.push(rowData);
  }
  boxTableData.value = tableData;
};

const curInfo = reactive({
  imgIndex: -1,
  boxCordinate: [-1, -1],
  templateNew:{
    row: 0,
    column: 0,
    basis: 0,
    ratio: 1,
  }
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

const imgBoxCutRef = ref();
const changeTemplate = (index: number) => {
  imgBoxCutRef.value.forEach((refEl: any) => {
    if (refEl) {
      refEl.reset();
    }
  });
  imgBoxConfig.row = boxTemplateList.value[index].row;
  imgBoxConfig.column = boxTemplateList.value[index].column;
  imgBoxConfig.ratio = boxTemplateList.value[index].ratio;
  generateBoxTableData();
};

const init = () => {
  generateBoxTableData();
};

onMounted(() => {
  init();
});

const canvasResultRef = ref(null);
const handlePreview = () => {
  const canvas = canvasResultRef.value;
  fillModePuzzle(boxTableData.value, canvas);
};

const handleDownload = () => {
  const canvas = canvasResultRef.value;
  let url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  document.body.appendChild(a);
  const time = new Date().getTime();
  a.download = `puzzle_${time}.png`;
  a.href = url;
  a.click();
  document.body.removeChild(a);
};

const handleImgBoxCutReady = (canvasInfo: any, position: any) => {
  const { row, column } = position;
  boxTableData.value[row][column].canvasInfo = canvasInfo;
};

const handleImgBoxMove = (canvasInfo: any, position: any) => {
  const { row, column } = position;
  boxTableData.value[row][column].canvasInfo = canvasInfo;
};
</script>

<style scoped lang="scss">
.drag-wrap {
  width: 300px;
  height: 300px;
}
.drag-img {
  width: 200px;
}
.area{
  display: flex;
  width: 100%;
}
.img-template-generate{
  width: 300px;
  margin-left: 30px;
  flex: none;
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
    overflow: hidden;
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
  width: 400px;
  margin-bottom: 20px;
  &-item {
    display: flex;
    margin-bottom: 8px;
  }
}
.img-operation {
  display: flex;
}
.img-result-operation{
  display: flex;
}
</style>
