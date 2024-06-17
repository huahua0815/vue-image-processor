<template>
  <div class="img-uploader-wrap">
    <div class="flex justify-center">
      <el-upload :auto-upload="false" drag @change="debouncedHandleFileChange" multiple ref="uploadRef"
        :show-file-list="false">
        <div class="upload-inner">
          <Upload />
          <div class="upload-text">
            拖动文件上传或<span style="color: #5236f2">点击</span>
          </div>
        </div>
      </el-upload>
    </div>
    <div class="img-display">
      <img-choose-tool v-for="(item,index) in imgUploadArr" :key="item.originImgUrl" :src="item.originImgUrl" :width="100" :number="item.number"
        :height="80" @click="handleOrder(index)"/>
    </div>
    <div class="select-operation">
      
    </div>
  </div>
</template>

<script setup lang="ts">
import Upload from '@/assets/upload.svg?component'
import type { UploadFile, UploadFiles } from "element-plus";
import ImgChooseTool from "./img-choose-tool.vue";
import { ref } from "vue";
import _ from "lodash";

const imgUploadArr = ref([])
const uploadRef = ref();
const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  let arr: any = [];
  uploadFiles.forEach(file => {
    let url = URL.createObjectURL(file.raw as Blob);
    arr.push({
      originImgUrl: url,
      number:-1,
    });
  });
  imgUploadArr.value.unshift(...arr)
  console.log(imgUploadArr.value);
  uploadRef.value.clearFiles();

};

const debouncedHandleFileChange = _.debounce(handleFileChange, 500);

let start = 1
const handleOrder =(index:number)=>{
  if(imgUploadArr.value[index].number === -1){
    imgUploadArr.value[index].number = start++
  }else{
    imgUploadArr.value[index].number = -1
    start--
  }
}
</script>

<style scoped lang="scss">
@import '@/style/index.scss';

.upload-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-text {
  color: #7e7e7e;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 183.333% */
  margin-top: 4px;
}

:deep(.el-upload .el-upload-dragger) {
  width: 172px !important;
  height: 80px !important;
  border: 1px dashed $priamryColor;
  display: flex;
  background: $priamryColor5;
  align-items: center;
  justify-content: center;
}

:deep(.el-upload) {
  width: 172px !important;
  height: 90px !important;
}

:deep(.el-upload .el-upload-dragger:hover) {
  border: 1px dashed $priamryColor;
  background-color: $priamryColor4 !important;
}

.img-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
