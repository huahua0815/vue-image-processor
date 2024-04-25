export interface ImageBoxCut{
  src: string
  boxInfo:ImgTemplateBox
  scaleStep?: number
  mode?: 'fill' | 'contain' | 'cover' | 'none'
  position: {row:number, column:number}
}

export interface DrawInfo{
  imgX:number
  imgY:number
  imgW:number
  imgH:number
  canvasX:number //截取的画布的x坐标
  canvasY:number //截取的画布的Y坐标
  canvasW:number //截取的画布的宽度
  canvasH:number  //截取的画布的高度
} 

export interface ImgInfo{
  width: number
  height: number
}

export interface ImgCurInfo {
  imgEle: HTMLImageElement
  drawInfo:DrawInfo
  imgInfo:ImgInfo
  canvasTemp?:HTMLCanvasElement
  canvasTempCtx?:CanvasRenderingContext2D
  canvasCur?:HTMLCanvasElement
  canvasCurCtx?:CanvasRenderingContext2D
}

export interface ImgTemplateBox{
  row:number
  column:number
  basis: number
  ratio: number
}
interface ImgResItem{
  
}
export interface ImgRes{

}