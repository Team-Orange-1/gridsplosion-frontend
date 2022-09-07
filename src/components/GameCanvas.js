import React, { useRef, useEffect } from 'react'

const GameCanvas = props => {
  
  const canvasRef = useRef(null);
  const blockSize = 50;
  const numberRowsAndCol = 12;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // create grid, you can change numberRowsAndCol and blockSize above to experiment with grid sizes
    context.fillStyle = '#e8e8e8';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // numberRowsAndCol can be changed above, this number will change the grid size
    for (let y = 0; y < numberRowsAndCol; y++) {
      for (let x = 0; x < numberRowsAndCol; x++) {
        context.strokeStyle = 'black';
        context.strokeRect(y * blockSize, x * blockSize, blockSize, blockSize);
      }
    }

    // fills the canvas in orange wherever the permanent blocks are
    props.blockCoordinates.forEach(coord => {
      context.fillStyle = 'orange';
      context.fillRect(coord[1] * blockSize, coord[0] * blockSize, blockSize, blockSize);
    });

    // fills the canvas in to show radius
    props.radius.forEach(coordArr => {
      coordArr.forEach(coord => {
        context.fillStyle = '#ffbebe';
        context.fillRect(coord[1] * blockSize, coord[0] * blockSize, blockSize, blockSize);
      });
    });

    // fills the canvas in purple wherever the destructible blocks are
    props.destructibleBlocks.forEach(coord => {
      context.fillStyle = 'purple';
      context.fillRect(coord[1] * blockSize, coord[0] * blockSize, blockSize, blockSize);
    });


    // fills the canvas red wherever a bomb is dropped
    props.bombCoordinates.forEach(coord => {
      context.fillStyle = 'red';
      context.fillRect(coord[1] * blockSize, coord[0] * blockSize, blockSize, blockSize);
    });

    // fills the canvas in where the player is
    context.fillStyle = 'blue';
    context.fillRect(props.playerCoordinate[0]/2 * blockSize, props.playerCoordinate[1]/2 * blockSize, blockSize, blockSize);

    // fills the canvas in with all the enemies
    props.enemyCoordinates.forEach(enemy => {
    context.fillStyle = 'black';
    context.fillRect(enemy[0]/2 * blockSize, enemy[1]/2 * blockSize, blockSize, blockSize);
    })

  }, [props.playerCoordinate, props.blockCoordinates, props.destructibleBlocks, props.bombCoordinates, props.radius, props.enemyCoordinates]);

  return <canvas ref={canvasRef} width='600px' height='600px'/>
}

export default GameCanvas;
