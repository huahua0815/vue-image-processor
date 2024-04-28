import { ImageBoxCut, ImgCurInfo } from "./type";

export function fillModeZoom(e: WheelEvent, imgCurInfo: ImgCurInfo) {
  const deltay = e.deltaY;
  const { drawInfo, canvasTemp, canvasTempCtx, imgEle, imgInfo } = imgCurInfo;
  const { width: imgWidth, height: imgHeight } = imgInfo;
  const { canvasW, canvasH } = drawInfo;
  const preEnlargRatio = canvasW / imgWidth;
  let scroll = Math.abs(deltay / 100);
  console.log("滚动", scroll);
  if (deltay < 0) {
    //放大
    let scale = preEnlargRatio * (1 + scroll);
    console.log("放大", scale);
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
    if (canvasTemp) {
      //保证放大后的图片在裁剪框的相对位置与放大前保持一致，就跟scale时设置了transform-origin一样
      let topRatio = e.offsetX / canvasW;
      let leftRatio = e.offsetY / canvasH;
      let transX = topRatio * imgFinalWidth - e.layerX;
      let transY = leftRatio * imgFinalHeight - e.layerY;
      canvasTemp.style.transform = `translateX(${-transX}px) translateY(${-transY}px)`;

      //更新信息
      imgCurInfo.drawInfo.canvasX = transX;
      imgCurInfo.drawInfo.canvasY = transY;
      imgCurInfo.drawInfo.canvasW = imgFinalWidth;
      imgCurInfo.drawInfo.canvasH = imgFinalHeight;
    }
  } else {
    //缩小
  }
}
