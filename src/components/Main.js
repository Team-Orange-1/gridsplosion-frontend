import GameCanvas from './GameCanvas';
import React from 'react';
import axios from 'axios';
import EndgameModal from '../EndgameModal';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoordinate: [0, 0],
      enemyCoordinates: [[22, 0], [0, 22], [22, 22], [10, 10]],
      destructibleBlocks: [],
      countdown: 5,
      bombCoordinates: [],
      radius: [],
      gameOver: false,
      gameCounter: 0,
      score: 0,
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
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', (e) => { this.handleKeyPress(e) });
    this.clearAllIntervals();
  }

  clearAllIntervals() {
    let killId = setTimeout(() => {
      for (let i = killId; i > 0; i--) clearInterval(i);
    }, 50);
  }

  startGame() {
    document.location.reload();
  }

  endGame() {
    this.clearAllIntervals();
    this.setState({gameOver: true}, () => {
      if(this.state.score > this.props.highScore) {
        this.props.updateScore(this.state.score);
      }
    });
  }

  // 5 second countdown, game canvas is rendered when countdown equals 0
  startTimer() {
    let interval = setInterval(() => {
      let decrement = this.state.countdown - 1;
      this.setState({ countdown: decrement }, () => {
        if (this.state.countdown <= 0) {
          clearInterval(interval)
          // start AI movement
          setInterval(() => {
            this.setAiState();
          }, 300);
          // start game timer
          this.timer();
        }
      });
    }, 1000)
  }

  timer() {
    let sec = 0;
    setInterval(() => {
      sec++;
      this.setState({
        score: sec
      });
    }, 1000);
  }

  // call the backend server, this calls a dice roll api to generate the number of random destructible blocks
  getRandNum = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER}/dice`);
      return response.data.rolls[0];
    } catch (e) {
      console.log(e);
    }
  }

  // get original destructible blocks
  getBlockCoordinates = async () => {
    let coordArr = [];
    let randNum = await this.getRandNum();
    while (coordArr.length < randNum) {
      // generate two random numbers within the 12 by 12 grid
      let x = Math.floor(Math.random() * 12);
      let y = Math.floor(Math.random() * 12);

      // check if the generated coordinate is the same as any of the permanent blocks
      // checkForPermanentBlocks returns false if there is a permanent block at that coordinate
      let noPermanentBlocks = this.checkBlock(y * 2, x * 2);

      // check if the generated coordinate will trap the player
      // return false if it the coordinate is okay
      let playerNotTrapped = this.determineTrapped(y, x);

      if (noPermanentBlocks && playerNotTrapped) coordArr.push([y, x]);
      this.setState({ destructibleBlocks: coordArr });
    }
  }

  // this function is used to check for permanent blocks when player tries to move
  // also used when generating destructible blocks
  // also used to check if there is blocks in the bomb radius
  checkBlock(x, y) {
    let noBlock = [...this.blockCoordinates, ...this.state.destructibleBlocks, ...this.state.bombCoordinates].every(block => {
      return !(y / 2 === block[0] && x / 2 === block[1]);
    });
    return noBlock;
  }

  // this function is used to determine if any spawned destructible blocks will trap in a player or enemy
  determineTrapped(y, x) {
    const noBlockSpawns = [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0], [0, 11], [0, 10], [0, 9], [1, 11], [2, 11],
    [11, 0], [10, 0], [9, 0], [11, 1], [11, 2], [11, 11], [11, 10], [11, 9], [10, 11], [9, 11]];

    // return true if it is okay to block to spawn at the coordinate passed as argument
    return noBlockSpawns.every(coord => {
      return !(y === coord[0] && x === coord[1]);
    });
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
      this.setState({ radius: radiusArr }, this.explosion);
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
      this.setState({ radius: tempRadius });
    }, 3000);
  }

  // determine the radius of the bomb, filter out indestructible blocks
  getRadius(coord) {
    let fullRadius = [[coord[0] + 1, coord[1]], [coord[0] + 2, coord[1]], [coord[0] - 1, coord[1]], [coord[0] - 2, coord[1]], [coord[0], coord[1] + 1], [coord[0], coord[1] + 2], [coord[0], coord[1] - 1], [coord[0], coord[1] - 2], [[coord[0]], coord[1]]];

    let filteredRadius = fullRadius.filter(coord => {
      return this.blockCoordinates.every(block => {
        return !(coord[0] === block[0] && coord[1] === block[1]);
      });
    });
    return filteredRadius;
  }

  // determines if the player is in the bomb radius
  bombKillsPlayer(radiusArr) {
    let playerCoord = this.state.playerCoordinate;
    // if you find the player coordinate in the radius, set state gameOver to true
    let playerKilled = radiusArr.find(blockCoord => {
      return blockCoord[1] === playerCoord[0] / 2 && blockCoord[0] === playerCoord[1] / 2;
    }) ? true : false;
    console.log(playerKilled);
    if(playerKilled) this.endGame();
  }

  // this function loops through the radius array and finds an enemies in the radius
  // returned array is used in removeKilledEnemy
  bombKillsEnemy(radiusArr) {
    let enemyCoords = this.state.enemyCoordinates;
    let enemiesKilled = [];
    enemyCoords.forEach(enemyCoord => {
      let foundCoord = radiusArr.find(blockCoord => {
        return blockCoord[1] === enemyCoord[0] / 2 && blockCoord[0] === enemyCoord[1] / 2;
      });
      if (foundCoord) enemiesKilled.push(foundCoord);
    });
    return enemiesKilled;
  }

  // takes the enemies to kill array from bombKillsEnemy and removes them from the enemy coordinates array in state
  removeKilledEnemy(enemiesKilled) {
    // enemy kills are worth 5 points
    let newScore = this.state.score + (enemiesKilled.length * 5);
    this.setState({ score: newScore });

    let enemyArr = this.state.enemyCoordinates;
    let filteredArr = enemyArr.filter(coord => {
      return enemiesKilled.every(block => {
        return !(coord[0] === block[1] * 2 && coord[1] === block[0] * 2);
      });
    });

    filteredArr.length === 0 && this.endGame();

    this.setState({ enemyCoordinates: filteredArr});
  }

  // determines if destructible blocks are in radius
  removeBlocksInRadius(radiusArr) {
    // find the destructible blocks in the radius
    let removeArr = radiusArr.filter(coord => {
      return !this.state.destructibleBlocks.every(block => {
        return !(coord[0] === block[0] && coord[1] === block[1]);
      });
    });

    // destroying blocks is worth one point
    let newScore = this.state.score + (removeArr.length * 1);
    this.setState({ score: newScore });

    // remove the blocks in the radius from the destructible blocks array
    let destructibleBlockArr = this.state.destructibleBlocks;
    let filteredArr = destructibleBlockArr.filter(coord => {
      return removeArr.every(block => {
        return !(coord[0] === block[0] && coord[1] === block[1]);
      });
    });
    // remove the blocks by setting state to filtered array 
    this.setState({ destructibleBlocks: filteredArr });
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
  checkBlock2(y, x) {
    let noBlock = [...this.blockCoordinates, ...this.state.destructibleBlocks, ...this.state.bombCoordinates].every(block => {
      return !(y / 2 === block[1] && x / 2 === block[0]);
    });
    return noBlock;
  }

  setAiState() {
    let newEnemyArr = this.state.enemyCoordinates.map(coords => {
      return this.moveAi(coords);
    });
    this.setState({ enemyCoordinates: newEnemyArr });
  }

  moveAi(coords) {
    let moveDirection = Math.floor(Math.random() * 4);
    switch (moveDirection) {
      case 0: return this.moveAiRight(coords);
      case 1: return this.moveAiLeft(coords);
      case 2: return this.moveAiUp(coords);
      case 3: return this.moveAiDown(coords);
      default: return 0;
    }
  }

  moveAiRight(coords) {
    let newCoord = [coords[0] + 2, coords[1]];
    return (newCoord[0] < 24 && this.checkBlock2(newCoord[0], newCoord[1])) ? newCoord : coords;
  }

  moveAiLeft(coords) {
    let newCoord = [coords[0] - 2, coords[1]];
    return (newCoord[0] >= 0 && this.checkBlock2(newCoord[0], newCoord[1])) ? newCoord : coords;
  }

  moveAiUp(coords) {
    let newCoord = [coords[0], coords[1] - 2];
    return (newCoord[1] >= 0 && this.checkBlock2(newCoord[0], newCoord[1])) ? newCoord : coords;
  }

  moveAiDown(coords) {
    let newCoord = [coords[0], coords[1] + 2];
    return (newCoord[1] < 24 && this.checkBlock2(newCoord[0], newCoord[1])) ? newCoord : coords;
  }

  render() {
    return (
      <>
        {this.state.countdown > 0 && <h2>{this.state.countdown}</h2>}
        {(this.state.countdown <= 0 && !this.state.gameOver) &&
          <div>
            <div>{this.state.score}</div>
            <GameCanvas
            playerCoordinate={this.state.playerCoordinate}
            blockCoordinates={this.blockCoordinates}
            destructibleBlocks={this.state.destructibleBlocks}
            bombCoordinates={this.state.bombCoordinates}
            radius={this.state.radius}
            enemyCoordinates={this.state.enemyCoordinates}
          />
          </div>}
          <EndgameModal enemyCoordinates={this.state.enemyCoordinates} gameOver={this.state.gameOver} score={this.state.score} startGame={this.startGame.bind(this)} leaders={this.props.leaders}/>
      </>
    )
  }
}

export default Main;
