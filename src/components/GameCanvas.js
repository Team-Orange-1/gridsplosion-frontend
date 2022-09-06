import React, { useRef, useEffect } from 'react'

const GameCanvas = props => {
  
  const canvasRef = useRef(null);
  
  const numberRowsAndCol = 20;
  const blockSize = 30;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // create grid, you can change numberRowsAndCol and blockSize above to experiment with grid sizes
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < numberRowsAndCol; y++) {
      for (let x = 0; x < numberRowsAndCol; x++) {
        context.strokeStyle = 'black';
        context.strokeRect(y * blockSize, x * blockSize, blockSize, blockSize);
      }
    }

    props.blockCoordinates.forEach(coord => {
      context.fillStyle = 'red';
      context.fillRect(coord[1] * blockSize, coord[0] * blockSize, blockSize, blockSize);
    });

    context.fillStyle = 'blue';
    context.fillRect(props.playerCoordinate[0] * blockSize/2, props.playerCoordinate[1] * blockSize/2, blockSize, blockSize);
  }, [props.playerCoordinate, props.blockCoordinates]);
  
  return <canvas ref={canvasRef} width='600px' height='600px'/>
}

export default GameCanvas;
