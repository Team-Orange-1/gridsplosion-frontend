import GameCanvas from './GameCanvas';
import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoordinate: [0, 0],
      enemyCoordinates:[[0,22], [22, 0], [22, 22]],
      // 
      // enemy1Coordinate: [0, 22],
      // enemy2Coordinate: [22, 0],
      // enemy3Coordinate: [22, 22],
      destructibleBlocks: [],
      countdown: 5,
      bombCoordinates: [],
      radius: [],
      gameOver: false
    }
  }

  // coordinates for the permanent orange blocks
  blockCoordinates = [
    [1, 1], [1, 2], [2, 1], [2, 2], [0, 5], [0, 6], [1, 9], [1, 10], [2, 4], [2, 7], [2, 9], [2, 10],
    [3, 5], [3, 6], [4, 5], [4, 6], [5, 0], [6, 0], [5, 3], [6, 2], [6, 3], [5, 8], [5, 9], [6, 8],
    [5, 11], [6, 11], [7, 5], [7, 6], [8, 5], [8, 6], [9, 1], [9, 2], [9, 4], [9, 7], [9, 9], [9, 10],
    [10, 1], [10, 2], [10, 9], [10, 10], [11, 5], [11, 6]
  ];

  // when page loads, add the event listener, get block coordinates and start the timer
  componentDidMount() {
    document.addEventListener('keydown', (e) => { this.handleKeyPress(e) });
    this.getBlockCoordinates();
    this.startTimer();
    setInterval( () => this.getMove(), 3000);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', (e) => { this.handleKeyPress(e) });
  }

  // 5 second countdown, game canvas is rendered when countdown equals 0
  startTimer() {
    let interval = setInterval(() => {
      let decrement = this.state.countdown - 1;
      this.setState({ countdown: decrement }, () => { if (this.state.countdown <= 0) clearInterval(interval) });
    }, 1000)
  }

  // get original destructible blocks
  getBlockCoordinates() {
    let coordArr = [];

    while (coordArr.length < 10) {
      // generate two random numbers within the 12 by 12 grid
      let x = Math.floor(Math.random() * 12);
      let y = Math.floor(Math.random() * 12);

      // check if the generated coordinate is the same as any of the permanent blocks
      // checkForPermanentBlocks returns false if there is a permanent block at that coordinate
      let noPermanentBlocks = this.checkBlock(y * 2, x * 2);
      if (noPermanentBlocks) coordArr.push([x, y]);
      this.setState({ destructibleBlocks: coordArr });
    }
  }

  // this function is used to check for permanent blocks when player tries to move
  // also used when generating destructible blocks
  // also used to check if there is blocks in the bomb radius
  checkBlock(x, y) {
    let noBlock = [...this.blockCoordinates, ...this.state.destructibleBlocks, ...this.state.bombCoordinates].every(block => {
      console.log(`(${x}, ${y}) : ${block[1]}, ${block[0]}`);
      return !(y / 2 === block[0] && x / 2 === block[1]);
    });
    return noBlock;
  }

  // NOTE: canvas grid starts with the top left corner as 0,0
  // increment coordinates to go down and right, decrement to go up and left

  // increment the player coordinate one in the x direction if it will not go outside the boundary
  moveRight() {
    let newCoordinate = [this.state.playerCoordinate[0] + 1, this.state.playerCoordinate[1]];
    if (this.state.playerCoordinate[0] < 22 && this.checkBlock(newCoordinate[0] + 1, newCoordinate[1])) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  // decrement the player coordinate one in the x direction if it will not go outside the boundary
  moveLeft() {
    let newCoordinate = [this.state.playerCoordinate[0] - 1, this.state.playerCoordinate[1]];
    if (this.state.playerCoordinate[0] > 0 && this.checkBlock(newCoordinate[0] - 1, newCoordinate[1])) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  // decrement the player coordinate one in the y direction if it will not go outside the boundary
  moveUp() {
    let newCoordinate = [this.state.playerCoordinate[0], this.state.playerCoordinate[1] - 1];
    if (this.state.playerCoordinate[1] > .1 && this.checkBlock(newCoordinate[0], newCoordinate[1] - 1)) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  // increment the player coordinate one in the y direction if it will not go outside the boundary
  moveDown() {
    let newCoordinate = [this.state.playerCoordinate[0], this.state.playerCoordinate[1] + 1];
    if (this.state.playerCoordinate[1] < 22 && this.checkBlock(newCoordinate[0], newCoordinate[1] + 1)) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  /*
  DROP BOMB
  1. remove the bomb coordinates to array
  2. call getRadius to get the bomb radius and add it to array
  3. start the timer for when bomb will explode by calling explosion
  */  
  dropBomb() {
    let bombArr = this.state.bombCoordinates;
    // get the coordinate of the player and see if a bomb has already been dropped there
    let newCoord = ([this.state.playerCoordinate[1] / 2, this.state.playerCoordinate[0] / 2]);
    let duplicate = bombArr.some(coord => newCoord[0] === coord[0] && newCoord[1] === coord[1]);

    // if less than five bombs dropped and not a duplicate, add bomb to coordinate array
    // get bomb radius and then start the timer by calling explosion
    if (this.state.bombCoordinates.length < 5 && !duplicate) {
      let bombArr = this.state.bombCoordinates;
      bombArr.push(newCoord);
      this.setState({ bombCoordinates: bombArr });

      let radiusArr = this.state.radius;
      radiusArr.push(this.getRadius(newCoord));
      this.setState({radius: radiusArr}, this.explosion);
    }
  }

  /*
  BOMB EXPLODES
  1. check for killed player
  2. check for killed enemy
  3. remove any destructible blocks
  4. remove the bomb from array, remove radius from array
  */  
  explosion() {
    let tempBombs = this.state.bombCoordinates;
    let tempRadius = this.state.radius;
    setTimeout(() => {
      this.bombKillsPlayer(tempRadius[0]);

      this.removeKilledEnemy(this.bombKillsEnemy(tempRadius[0]));

      this.removeBlocksInRadius(tempRadius[0]);

      tempBombs.shift();
      this.setState({ bombCoordinates: tempBombs });

      tempRadius.shift();
      this.setState({ radius: tempRadius});
    }, 3000);
  }

  // determine the radius of the bomb, filter out indestructible blocks
  getRadius(coord) {
    let fullRadius = [[coord[0]+1, coord[1]], [coord[0]+2, coord[1]], [coord[0]-1, coord[1]], [coord[0]-2, coord[1]], [coord[0], coord[1]+1], [coord[0], coord[1]+2], [coord[0], coord[1]-1], [coord[0], coord[1]-2], [[coord[0]], coord[1]]];

    let filteredRadius = fullRadius.filter(coord => {
      return this.blockCoordinates.every(block => {
        return !(coord[0]  === block[0] && coord[1] === block[1]);
      });
    });
    return filteredRadius;
  }

  // determines if the player is in the bomb radius
  bombKillsPlayer(radiusArr) {
    let playerCoord = this.state.playerCoordinate;
    // if you find the player coordinate in the radius, set state gameOver to true
    let playerKilled = radiusArr.find(blockCoord => {
      return blockCoord[1] === playerCoord[0]/2 && blockCoord[0] === playerCoord[1]/2;
    }) ? true : false;
    this.setState({gameOver: playerKilled}, () => console.log(this.state.gameOver));
  }

  // this function loops through the radius array and finds an enemies in the radius
  // returned array is used in removeKilledEnemy
  bombKillsEnemy(radiusArr) {
    let enemyCoords = this.state.enemyCoordinates;
    let enemiesKilled = [];
    enemyCoords.forEach(enemyCoord => {
      let foundCoord = radiusArr.find(blockCoord => {
        return blockCoord[1] === enemyCoord[0]/2 && blockCoord[0] === enemyCoord[1]/2;
      });
      if(foundCoord) enemiesKilled.push(foundCoord);
    });
    return enemiesKilled;
  }

  // takes the enemies to kill array from bombKillsEnemy and removes them from the enemy coordinates array in state
  removeKilledEnemy(enemiesKilled) {
    console.log(enemiesKilled);
    let enemyArr = this.state.enemyCoordinates;
    let filteredArr = enemyArr.filter(coord => {
      return enemiesKilled.every(block => {
        console.log(`${coord[0]}, ${coord[1]} : ${block[0]}, ${block[1]}`);
        return !(coord[0]  === block[1]*2 && coord[1] === block[0]*2);
      });
    });
    console.log(filteredArr);
    this.setState({enemyCoordinates: filteredArr});
  }

  // determines if destructible blocks are in radius
  removeBlocksInRadius(radiusArr) {
    // find the destructible blocks in the radius
    let removeArr = radiusArr.filter(coord => {
      return !this.state.destructibleBlocks.every(block => {
        return !(coord[0]  === block[0] && coord[1] === block[1]);
      });
    });

    // remove the blocks in the radius from the destructible blocks array
    let destructibleBlockArr = this.state.destructibleBlocks;
    let filteredArr = destructibleBlockArr.filter(coord => {
      return removeArr.every(block => {
        return !(coord[0]  === block[0] && coord[1] === block[1]);
      });
    });
    // remove the blocks by setting state to filtered array 
    this.setState({destructibleBlocks: filteredArr});
  };

  // event handler, moves player depending on the key pressed
  handleKeyPress(e) {
    let keyPressed = e.key;
    switch (true) {
      case (keyPressed === 'a' || keyPressed === 'ArrowLeft'): this.moveLeft();
        break;
      case (keyPressed === 'w' || keyPressed === 'ArrowUp'): this.moveUp();
        break;
      case (keyPressed === 'd' || keyPressed === 'ArrowRight'): this.moveRight();
        break;
      case (keyPressed === 's' || keyPressed === 'ArrowDown'): this.moveDown();
        break;
      case keyPressed === ' ': this.dropBomb();
        break;
      default: console.log(keyPressed);
    }
  }


  // AI Movement
  moveRightAi(coords) {
    let newCoordinate = [coords[0] + 2, Math.ceil(coords[1])];
    if (coords[0] < 22 && this.checkBlock((newCoordinate[1], newCoordinate[0] + 2))) {
      return newCoordinate;
    } else {
      return coords;
    }
  }

  // decrement the player coordinate one in the x direction if it will not go outside the boundary
  moveLeftAi(coords) {
    let newCoordinate = [coords[0] - 2, coords[1]];
    if (coords[0] > 0 && this.checkBlock((newCoordinate[0] - 1), newCoordinate[1])) {
      return newCoordinate;
    } else {
      return coords;
    }
  }

  // decrement the player coordinate one in the y direction if it will not go outside the boundary
  moveUpAi(coords) {
    let newCoordinate = [coords[0], coords[1] - 2];
    if (coords[1] > .1 && this.checkBlock(newCoordinate[0], newCoordinate[1] - 2)) {
      return newCoordinate;
    } else {
      return coords;
    }
  }

  // increment the player coordinate one in the y direction if it will not go outside the boundary
  moveDownAi(coords) {
    let newCoordinate = [coords[0], coords[1] + 2];
    if (coords[1] < 22 && this.checkBlock(newCoordinate[0], newCoordinate[1] + 2)) {
      return newCoordinate;
    } else {
      return coords;
    }
  }

  moveYourselfAi(coords) {
  
    let move = Math.floor(Math.random() * (4) + 1);
    if (move === 1) {
      return this.moveLeftAi(coords);
    } else if (move === 2) {
      return this.moveUpAi(coords);
    } else if (move === 3) {
      return this.moveDownAi(coords);
    } else {
     return this.moveRightAi(coords);
    };
  }

  getMove() {
    let newCoordArr = this.state.enemyCoordinates.map(enemy => this.moveYourselfAi(enemy));
    this.setState({enemyCoordinates: newCoordArr});
  }

  render() {
    return (
      <>
        {this.state.countdown > 0 && <h2>{this.state.countdown}</h2>}
        {this.state.countdown <= 0 &&
          <GameCanvas
            playerCoordinate={this.state.playerCoordinate}
            blockCoordinates={this.blockCoordinates}
            destructibleBlocks={this.state.destructibleBlocks}
            bombCoordinates={this.state.bombCoordinates}
            radius={this.state.radius}
            enemyCoordinates={this.state.enemyCoordinates}
          />}
      </>
    )
  }
}

export default Main;