export function fillModePuzzle(tableData:any,canvasRes:HTMLCanvasElement){
  console.log('execute fillMode')
  const lastCord = {x:0, y:0, w:0, h:0}
  const curCord = {x:0, y:0, w:0, h:0}
  const canvasObj = { w:0, h:0, canvas: null as unknown as HTMLCanvasElement}
  const canvasResCtx = canvasRes.getContext('2d')
  for(let i = 0;i < tableData.length; i++){
    for(let j = 0; j < tableData[i].length; j++){
      curCord.x = j == 0 ? 0 : lastCord.x + lastCord.w
      curCord.y = i == 0 ? 0 : lastCord.y + lastCord.h
      const { canvas, canvasWidth, canvasHeight } = tableData[i][j].canvasInfo
      if(i==0){
        canvasObj.w += canvasWidth
      }
      if(j==0){
        canvasObj.h += canvasHeight
      }
      canvasRes.width = canvasObj.w
      canvasRes.height = canvasObj.h
      canvasResCtx?.drawImage(canvas, 0, 0, canvasWidth, canvasHeight, curCord.x,curCord.y,canvasWidth, canvasHeight)
      lastCord.x = curCord.x
      lastCord.y = curCord.y
      lastCord.w = canvasWidth
      lastCord.h = canvasHeight
    }
  }
  canvasObj.canvas = canvasRes
 return canvasObj
}