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
  minScale:number
  curScale:number //当前显示图片的放大倍数
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
  enlargeRatio: number
  originRatio: number
}
interface ImgResItem{
  
}
export interface ImgRes{

}

export interface PuzzleUnitInfo { 
  //当前拼接区显示的部分，相对于原图的左上角的横向距离x、纵向距离y
  //拼接可视区域相对原图的宽width,高height
  x:number
  y:number
  width:number
  height: number
}