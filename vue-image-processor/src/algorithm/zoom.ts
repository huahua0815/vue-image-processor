import { ImgTemplateBox, ImgCurInfo } from "./type";

export function fillModeZoom(e: WheelEvent, imgCurInfo: ImgCurInfo, boxInfo: ImgTemplateBox) {
  // console.log('fillModeZoom')
  const deltay = e.deltaY;
  const { drawInfo, canvasTemp, canvasTempCtx, imgEle, imgInfo, canvasCurCtx, canvasCur } = imgCurInfo;
  const { width: imgWidth, height: imgHeight } = imgInfo;
  const { canvasW, canvasH, minScale } = drawInfo;
  const { ratio: boxRatio, basis: boxWidth } = boxInfo;
  const boxHeight = boxWidth * boxRatio;
  const maxScale = 5
  const preEnlargRatio = canvasW / imgWidth;
  let scroll = Math.abs(deltay / 100);
  // console.log("滚动", scroll, preEnlargRatio, e);
  let scale = 1
  if (deltay < 0) {
    //放大
    scale = preEnlargRatio * (1 + scroll);
    scale = scale >= maxScale ? maxScale : scale;
    // console.log("放大", scale);
  } else {
    //缩小
    scroll = scroll / 10
    scale = preEnlargRatio * (1 - scroll);
    scale = scale <= minScale ? minScale : scale;
    // console.log("缩小", scale, minScale);
  }

  let imgFinalWidth = imgWidth * scale;
  let imgFinalHeight = imgHeight * scale;
  canvasTempCtx?.clearRect(
    0,
    0,
    imgCurInfo.canvasTemp?.width as number,
    imgCurInfo.canvasTemp?.height as number
  );
  canvasTemp.width = imgFinalWidth;
  canvasTemp.height = imgFinalHeight;
  canvasTempCtx?.drawImage(
    imgEle,
    0,
    0,
    imgWidth,
    imgHeight,
    0,
    0,
    imgFinalWidth,
    imgFinalHeight
  );
  imgCurInfo.drawInfo.canvasW = imgFinalWidth;
  imgCurInfo.drawInfo.canvasH = imgFinalHeight;
  imgCurInfo.drawInfo.curScale = imgFinalWidth / imgWidth
  if (canvasTemp) {
    //保证放大后的图片在裁剪框的相对位置与放大前保持一致，就跟scale时设置了transform-origin一样
    let topRatio = e.offsetX / canvasW;
    let leftRatio = e.offsetY / canvasH;
    //当到达放大缩小的临界点时，不再移动
    if(scale >= maxScale || scale <= minScale){
      return
    }
    let transX = topRatio * imgFinalWidth - e.layerX;
    let transY = leftRatio * imgFinalHeight - e.layerY;
    canvasTemp.style.transform = `translateX(${-transX}px) translateY(${-transY}px)`;

    //更新信息
    imgCurInfo.drawInfo.canvasX = transX;
    imgCurInfo.drawInfo.canvasY = transY;
    imgCurInfo.drawInfo.canvasW = imgFinalWidth;
    imgCurInfo.drawInfo.canvasH = imgFinalHeight;

    if(transX != 0 || transY != 0){
      canvasCurCtx?.drawImage(
      canvasTemp,
      imgCurInfo.drawInfo.canvasX,
      imgCurInfo.drawInfo.canvasY,
        boxWidth,
        boxHeight,
        0,
        0,
        boxWidth,
        boxHeight
    )
  }
}
}
