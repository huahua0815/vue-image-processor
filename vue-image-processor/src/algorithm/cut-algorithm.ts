import { ImgInfo, DrawInfo, ImgTemplateBox, ImgCurInfo } from "../components/type";

function isPrecisionEqual(num1: number, num2: number, precision: number) {
  const diff = Math.abs(num1 - num2);
  return diff <= precision;
}
export function fillModeInit(imgCurInfo: ImgCurInfo, boxInfo: ImgTemplateBox) {
  let drawInfo: DrawInfo = {
    imgX: 0,
    imgY: 0,
    imgW: 0,
    imgH: 0,
    canvasX: 0,
    canvasY: 0,
    canvasW: 0,
    canvasH: 0,
  };
  const { width: imgWidth, height: imgHeight } = imgCurInfo.imgInfo;
  const { ratio: boxRatio, basis: boxWidth } = boxInfo;
  const imgRatio = imgHeight / imgWidth;
  const boxHeight = boxWidth * boxRatio;
  if (isPrecisionEqual(imgRatio, boxRatio, 0.05)) {
    //比例相同，图片只需要缩放，图片内容可以全部填充
    drawInfo = {
      imgX: 0,
      imgY: 0,
      imgW: imgWidth,
      imgH: imgHeight,
      canvasX: 0,
      canvasY: 0,
      canvasW: boxWidth,
      canvasH: boxHeight,
    };
    imgCurInfo.canvasCurCtx?.drawImage(
      imgCurInfo.imgEle,
      drawInfo.imgX,
      drawInfo.imgY,
      drawInfo.imgW,
      drawInfo.imgH,
      drawInfo.canvasX,
      drawInfo.canvasY,
      drawInfo.canvasW,
      drawInfo.canvasH
    );
    imgCurInfo.canvasTempCtx?.drawImage(
      imgCurInfo.imgEle,
      drawInfo.imgX,
      drawInfo.imgY,
      drawInfo.imgW,
      drawInfo.imgH,
      drawInfo.canvasX,
      drawInfo.canvasY,
      drawInfo.canvasW,
      drawInfo.canvasH
    );
    console.log('比例相同，图片只需要缩放，图片内容可以全部填充')
    imgCurInfo.drawInfo = drawInfo;
  } else {
    //比例不同，填充局部图片，图片一部分不在裁剪框内，先将图片放大再裁剪某个区域(默认裁剪中间的位置)
    console.log('比例不同，填充局部图片，图片一部分不在裁剪框内，先将图片放大再裁剪某个区域(默认裁剪中间的位置)')
    let scaleX = boxWidth / imgWidth;
    let scaleY = boxHeight / imgHeight;
    let scale = Math.max(scaleX, scaleY);
    let imgFinalWidth = imgWidth * scale;
    let imgFinalHeight = imgHeight * scale;

    drawInfo = {
      imgX: 0,
      imgY: 0,
      imgW: imgWidth,
      imgH: imgHeight,
      canvasX: 0,
      canvasY: 0,
      canvasW: imgFinalWidth,
      canvasH: imgFinalHeight,
    };
    if (imgCurInfo.canvasTemp) {
      imgCurInfo.canvasTemp.width = imgFinalWidth;
      imgCurInfo.canvasTemp.height = imgFinalHeight;
    }
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
    drawInfo.canvasX = Math.ceil(imgFinalWidth / 2 - boxWidth / 2)
    if(imgCurInfo.canvasTemp)
      imgCurInfo.canvasTemp.style.transform = `translateX(${-drawInfo.canvasX}px)`
    // canvasCurCtx 赋值
    if (imgCurInfo.canvasCur) {
      imgCurInfo.canvasCur.width = boxWidth;
      imgCurInfo.canvasCur.height = boxHeight;
    }
    // 默认裁剪中间的位置
    imgCurInfo.canvasCurCtx?.drawImage(
      imgCurInfo.canvasTemp,
      drawInfo.canvasX,
      0,
      boxWidth,
      boxHeight,
      0,
      0,
      boxWidth,
      boxHeight
    );
   
    Object.assign(imgCurInfo.drawInfo, drawInfo)
  }
}

const fillModeZoom = (zoomNum: number, imgCurInfo: ImgCurInfo)=>{
  
}