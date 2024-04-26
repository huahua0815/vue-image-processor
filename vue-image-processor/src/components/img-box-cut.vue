<template>
  <canvas ref="canvasOriginRef" style="display: none;"></canvas>
  <canvas
    ref="canvasTempRef"
    class="canvas-temp"
    @mousedown="handleDragStart"
    @mousemove="handleDrag"
    @wheel="handleScroll"
  ></canvas>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, onBeforeMount } from "vue";
import { ImageBoxCut, ImgCurInfo } from "./type";
import { fillModeInit } from "@/algorithm/cut-algorithm.ts";
import _ from "lodash";

const props = withDefaults(defineProps<ImageBoxCut>(), {
  src: "",
  boxInfo: { row: 0, column: 0, basis: 0, ratio: 0 },
  scaleStep: 0.1,
  mode: "fill",
});

const { boxInfo } = props;
const emits = defineEmits(["ready", "move", "crop"]);

const imgCurInfo = reactive<ImgCurInfo>({
  canvasCur: null as unknown as HTMLCanvasElement,
  canvasCurCtx: null as unknown as CanvasRenderingContext2D,
  imgEle: null as unknown as HTMLImageElement,
  drawInfo: {
    imgX: 0,
    imgY: 0,
    imgW: 0,
    imgH: 0,
    canvasX: 0,
    canvasY: 0,
    canvasW: 0,
    canvasH: 0,
  },
  imgInfo: {
    width: 0,
    height: 0,
  },
});

const initCanvas = () => {
  const { mode, boxInfo } = props;
  switch (mode) {
    case "fill":
      fillModeInit(imgCurInfo, boxInfo);
  }
};

const canvasOriginRef = ref(null);
const canvasTempRef = ref(null);
const init = () => {
  imgCurInfo.canvasCur = canvasOriginRef.value as HTMLCanvasElement;
  imgCurInfo.canvasCurCtx = imgCurInfo.canvasCur.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  imgCurInfo.canvasTemp = canvasTempRef.value as HTMLCanvasElement;
  imgCurInfo.canvasTempCtx = imgCurInfo.canvasTemp.getContext(
    "2d"
  ) as CanvasRenderingContext2D;
  const { src } = props;
  const img = new Image();
  img.setAttribute("crossOrigin", "Anonymous");
  img.onload = () => {
    let imgInfo = {
      width: img.width,
      height: img.height,
    };
    imgCurInfo.imgEle = img;
    imgCurInfo.imgInfo = imgInfo;
    initCanvas();
    const { ratio: boxRatio, basis: boxWidth } = boxInfo;
  const boxHeight = boxWidth * boxRatio;
    const canvasInfo = {
    canvas: imgCurInfo.canvasCur,
    canvasWidth: boxWidth,
    canvasHeight: boxHeight,
    cordinate:{ //tofix：这里传的有问题，不过现在暂时用不到
      x:imgCurInfo.drawInfo.canvasX,
      y:imgCurInfo.drawInfo.canvasY
    },
    imgEle:img
  }
  emits('ready', canvasInfo, props.position)
  };
  img.src = src;
  console.log("imgCurInfo", imgCurInfo);
};

watch(
  [() => props.src, () => props.boxInfo],
  ([newSrc, newBoxInfo], [oldSrc, oldBoxInfo]) => {
    if (newSrc !== oldSrc && newSrc.length > 0) {
      init();
    } else if (newBoxInfo.basis > 0 && newSrc.length > 0) {
      initCanvas();
    } else {
      console.log("111");
    }
  },
  { deep: true }
);

const  dragCur = {
  startX: 0,
  startY: 0,
  offsetY: 0,
  offsetX: 0,
  basisX:0,
  basisY:0,
  isDragging: false,
};
const handleDragStart = (e: MouseEvent) => {
  dragCur.isDragging = true;
  dragCur.startX = e.clientX;
  dragCur.startY = e.clientY;
  // console.log("dragStart");
};

const handleDrag = (e: MouseEvent) => {
  if (dragCur.isDragging) {
    const endX = e.clientX;
    const endY = e.clientY;
    // 累加鼠标悬浮移动距离
    dragCur.offsetX += endX - dragCur.startX;
    dragCur.offsetY += endY - dragCur.startY;
    // console.log('offset', dragCur.offsetX, dragCur.offsetY)
    let basisX = -imgCurInfo.drawInfo.canvasX + dragCur.offsetX;
    let basisY = -imgCurInfo.drawInfo.canvasY + dragCur.offsetY;
    // console.log('basis', basisX, basisY)
    //限制拖出边界
    const limitXLeft = 0;
    const limitXRight = boxInfo.basis - imgCurInfo.drawInfo.canvasW;
    
    const limitYTop = 0;
    const limitYBottom = 0;
    // console.log('limit', limitXLeft, limitXRight)
    if (basisX > limitXLeft) {
      basisX = limitXLeft;
    }
    if (basisX < limitXRight) {
      basisX = limitXRight;
    }

    if (basisY != 0) {
      basisY = 0;
    }
    dragCur.basisX = basisX
    dragCur.basisy = basisY
    //移动
    canvasTempRef.value.style.transform = `translate(${basisX}px, ${basisY}px)`;
    // 更新裁剪位置
    dragCur.startX = endX;
    dragCur.startY = endY;
  }
};
const handleDragEnd = () => {
  imgCurInfo.drawInfo.canvasX = -dragCur.basisX;
  imgCurInfo.drawInfo.canvasY = -dragCur.basisY;
  
  const { ratio: boxRatio, basis: boxWidth } = boxInfo;
  const boxHeight = boxWidth * boxRatio;
  
  if(dragCur.basisX != 0 || dragCur.basisY != 0){
    imgCurInfo.canvasCurCtx?.drawImage(
    imgCurInfo.canvasTemp,
    imgCurInfo.drawInfo.canvasX,
      0,
      boxWidth,
      boxHeight,
      0,
      0,
      boxWidth,
      boxHeight
  )
  const canvasInfo = {
    canvas: imgCurInfo.canvasCur,
    canvasWidth: boxWidth,
    canvasHeight: boxHeight,
    cordinate:{ //tofix：这里传的有问题，不过现在暂时用不到
      x:imgCurInfo.drawInfo.canvasX,
      y:imgCurInfo.drawInfo.canvasY
    }
  }
  emits('move', canvasInfo, props.position)
}
  Object.assign(dragCur, {
    startX: 0,
    startY: 0,
    offsetY: 0,
    offsetX: 0,
    basisX:0,
    basisY:0,
    isDragging: false,
  })
};

const handleScroll = (e:WheelEvent)=>{
  //tofix:有问题
  const deltay = e.deltaY
  console.log('deltay is', deltay)
  const { width: imgWidth, height: imgHeight } = imgCurInfo.imgInfo;
  if(deltay < 0){
    //放大
    let scale = Math.abs(Math.ceil(deltay / 8))
    console.log('放大', 1 + scale)
    let imgFinalWidth = imgWidth * (1 + scale)
    let imgFinalHeight = imgHeight * (1 + scale)
    imgCurInfo.canvasTempCtx?.clearRect(0, 0, imgCurInfo.canvasTemp?.width as number, imgCurInfo.canvasTemp?.height as number)
    imgCurInfo.canvasTempCtx?.drawImage(
      imgCurInfo.imgEle,
      0,
      0,
      imgWidth,
      imgHeight,
      0,
      0,
      imgFinalWidth,
      imgFinalHeight
    );
  }else{
    //缩小
    let scale = deltay / 100
    console.log('缩小', 1 - scale)
    let imgFinalWidth = imgWidth * (1 - scale)
    let imgFinalHeight = imgHeight * (1 - scale)
    imgCurInfo.canvasTempCtx?.clearRect(0, 0, imgCurInfo.canvasTemp?.width as number, imgCurInfo.canvasTemp?.height as number)
    imgCurInfo.canvasTempCtx?.drawImage(
      imgCurInfo.imgEle,
      0,
      0,
      imgWidth,
      imgHeight,
      0,
      0,
      imgFinalWidth,
      imgFinalHeight
    );
  }
}

const reset = ()=>{
  imgCurInfo.canvasCurCtx?.clearRect(0, 0, imgCurInfo.canvasCur?.width as number, imgCurInfo.canvasCur?.height as number)
  imgCurInfo.canvasTempCtx?.clearRect(0, 0, imgCurInfo.canvasTemp?.width as number, imgCurInfo.canvasTemp?.height as number)
}

defineExpose({
  reset
})

onMounted(() => {
  window.addEventListener("mouseup", handleDragEnd);
});

onBeforeMount(() => {
  window.removeEventListener("mouseup", handleDragEnd);
});
</script>

<style scoped lang="scss">
.canvas-temp {
  // transition: 0.1s transform ease;
}
</style>../algorithm/cut-algorithm
