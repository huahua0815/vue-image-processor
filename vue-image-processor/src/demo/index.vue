<template>
  <div class="demo-wrap">
    <div class="demo-header">花花的图片编辑台</div>
    <div class="demo-main">
      <div class="demo-aside">
        <div class="demo-aside-menu">
          <div class="menu-upper">
            <div class="menu-item" @click="handleOpenGrid">
              <Grid /> 网格
            </div>
            <div class="menu-item">
              <Poster /> 海报
            </div>
            <div class="menu-item">
              <Crop /> 裁剪
            </div>
          </div>
          <div class="menu-lower">
            <div class="menu-item" @click="handleOpenAddPic">
              <AddPic />添加图片
            </div>
          </div>
        </div>
        <div :class="['demo-aside-work', { 'active': isWorkAreaActive }]">
          <div class="demo-aside-work-content" v-show="isWorkAreaActive">
            <component :is="componentList[curActiveMenu]"></component>
          </div>
          <div class="switch-btn">
            <ArrowRight class="arrow-right-icon" @click="isWorkAreaActive = !isWorkAreaActive" />
          </div>
        </div>
      </div>
      <div class="demo-content">
        <el-button type="primary">11</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import ArrowRight from '@/assets/arrow-right.svg?component'
import Grid from '@/assets/grid.svg?component'
import Poster from '@/assets/poster.svg?component'
import AddPic from '@/assets/add-pic.svg?component'
import Crop from '@/assets/crop.svg?component'
import boxTemplateList from "./component/box-template-list.vue";
import imgUploader from "./component/img-uploader.vue";

const curActiveMenu = ref(0)
const isWorkAreaActive = ref(false)

const componentList = [boxTemplateList, imgUploader]
const handleOpenGrid = () => {
  curActiveMenu.value = 0
  isWorkAreaActive.value = true
}

const handleOpenAddPic = () => {
  curActiveMenu.value = 1
  isWorkAreaActive.value = true
}
</script>

<style scoped lang="scss">
@import '@/style/index.scss';

.demo-header {
  background-color: #EAE9F4;
  color: #847EA8;
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 16px;
}

.demo-main {
  display: flex;
}

.demo-aside {
  background-color: rgb(213 212 225 / 76%);
  height: calc(100vh - 60px);
  color: #807d80;
  position: relative;

  &-menu {
    width: 120px;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;

    .menu-item {
      height: 68px;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12px;
      justify-content: center;
      flex-direction: column;

      &:hover {
        background-color: rgba(184, 182, 203, 0.76);
      }
    }
  }

  &-work {
    position: absolute;
    left: 120px;
    top: 0;
    background: #fff;
    gap: 8px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    height: 100%;
    box-sizing: border-box;

    &-content {
      display: flex;
      width: 226px;
      flex-wrap: wrap;
      max-width: 100%;
      padding: 8px;
      overflow: hidden;
      justify-content: center;
      transition: maxWidth 0.3s ease, padding 0.3s ease;
    }

    .switch-btn {
      position: absolute;
      left: 100%;
      top: calc(50% - 20px);
      background: rgba(217, 216, 235, 0.5);
      height: 52px;
      display: flex;
      align-items: center;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
      width: 20px;
    }

    .arrow-right-icon {
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    &.active .arrow-right-icon {
      transform: rotate(180deg);
    }
  }


}

.demo-content {
  flex: 1;
  background-color: #F4F3F6;
  display: flex;
  justify-content: center;
}
</style>
