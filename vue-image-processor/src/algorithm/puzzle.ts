export function fillModePuzzle(tableData:any,canvasRes:HTMLCanvasElement){
  const lastCord = {x:0, y:0, w:0, h:0}
  const curCord = {x:0, y:0, w:0, h:0}
  const canvasObj = { w:0, h:0, canvas: null as unknown as HTMLCanvasElement}
  const canvasResCtx = canvasRes.getContext('2d')
  //必须要初始化最终宽高，而不是每次遍历更新宽高，因为如果每次遍历都重新更新宽高，上次绘制的图片就没保存了
  for(let i = 0;i < tableData.length; i++){
    for(let j = 0; j < tableData[i].length; j++){
      const { canvasWidth, canvasHeight } = tableData[i][j].canvasInfo
      // console.log('in puzzle', canvasWidth, canvasHeight)
      if(i==0){
        canvasObj.w += Number(canvasWidth)
      }
      if(j==0){
        canvasObj.h += Number(canvasHeight)
      }
    }
  }
  canvasRes.width = canvasObj.w
  canvasRes.height = canvasObj.h
  for(let i = 0;i < tableData.length; i++){
    curCord.y = i == 0 ? 0 : lastCord.y + lastCord.h
    for(let j = 0; j < tableData[i].length; j++){
      curCord.x = j == 0 ? 0 : lastCord.x + lastCord.w
      const { canvas, canvasWidth, canvasHeight } = tableData[i][j].canvasInfo
      // console.log(' canvasRes.width',  canvasRes.width, ' canvasRes.height',  canvasRes.height)
      // console.log('curCord.x, curCord.y', curCord.x, curCord.y,canvas)
      canvasResCtx?.drawImage(canvas, 0, 0, canvasWidth, canvasHeight, curCord.x, curCord.y,canvasWidth, canvasHeight)
      lastCord.x = curCord.x
      lastCord.w = canvasWidth
      lastCord.h = canvasHeight
    }
    lastCord.y = curCord.y
  }
  canvasObj.canvas = canvasRes
 return canvasObj
}


export function fillModePuzzleSync(tableData:any,canvasRes:HTMLCanvasElement, enlargeRatio: number){
  const lastCord = {x:0, y:0, w:0, h:0}
  const curCord = {x:0, y:0, w:0, h:0}
  const canvasObj = { w:0, h:0, canvas: null as unknown as HTMLCanvasElement}
  const canvasResCtx = canvasRes.getContext('2d')
  //必须要初始化最终宽高，而不是每次遍历更新宽高，因为如果每次遍历都重新更新宽高，上次绘制的图片就没保存了
  for(let i = 0;i < tableData.length; i++){
    for(let j = 0; j < tableData[i].length; j++){
      const { canvasWidth, canvasHeight } = tableData[0][0].canvasInfo
      // console.log('in puzzle', canvasWidth, canvasHeight)
      if(i==0){
        canvasObj.w += Number(canvasWidth)
      }
      if(j==0){
        canvasObj.h += Number(canvasHeight)
      }
    }
  }
  canvasRes.width = canvasObj.w * enlargeRatio
  canvasRes.height = canvasObj.h  * enlargeRatio
  for(let i = 0;i < tableData.length; i++){
    curCord.y = i == 0 ? 0 : lastCord.y + lastCord.h
    for(let j = 0; j < tableData[i].length; j++){
      curCord.x = j == 0 ? 0 : lastCord.x + lastCord.w
      const { canvas, canvasWidth, canvasHeight, cordinate, imgEle } = tableData[0][0].canvasInfo
      let  { x, y, width, height} = cordinate
      // console.log('i', i, 'j', j, 'cordinate', cordinate)
      // console.log('curCord:x y ',  curCord.x ,curCord.y, canvasWidth * enlargeRatio, canvasHeight * enlargeRatio)
      x = x + 0
      y = y + 0
      width = Math.ceil(width)
      height = Math.ceil(height)
      // console.log('x y width height', x, y, width, height)
      canvasResCtx?.drawImage(imgEle, x + 0, y+ 0, Math.ceil(width), Math.ceil(height), curCord.x, curCord.y,canvasWidth * enlargeRatio, canvasHeight * enlargeRatio)
      lastCord.x = curCord.x
      lastCord.w = canvasWidth * enlargeRatio
      lastCord.h = canvasHeight * enlargeRatio
    }
    lastCord.y = curCord.y
  }
   //显示比例还原到实际比例
  canvasObj.canvas = canvasRes
  canvasObj.w = canvasObj.w * enlargeRatio
  canvasObj.h = canvasObj.h * enlargeRatio
 return canvasObj
}