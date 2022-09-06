import GameCanvas from './GameCanvas';
import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoordinate: [0, 0],
      destructibleBlocks: [],
      countdown: 5,
    }
  }

  blockCoordinates = [
    [1, 1], [1, 2], [2, 1], [2, 2], [0, 5], [0, 6], [1, 9], [1, 10], [2, 4], [2, 7], [2, 9], [2, 10],
    [3, 5], [3, 6], [4, 5], [4, 6], [5, 0], [6, 0], [5, 3], [6, 2], [6, 3], [5, 8], [5, 9], [6, 8],
    [5, 11], [6, 11], [7, 5], [7, 6], [8, 5], [8, 6], [9, 1], [9, 2], [9, 4], [9, 7], [9, 9], [9,10],
    [10,1], [10, 2], [10, 9], [10, 10], [11, 5], [11, 6]
  ];

  // when page loads, add the event listener, get block coordinates and start the timer
  componentDidMount() {
    document.addEventListener('keydown', (e) => { this.handleKeyPress(e) });
    this.getBlockCoordinates();
    this.startTimer();
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

  // loop through permanent blocks and make sure the coordinate does not land on a permanent block
  checkForPermanentBlocks(x, y) {
    return this.state.blockCoordinates.every(coord => {
      return !(y / 2 === coord[0] && x / 2 === coord[1]);
    });
  }

  // make sure the the destructible block doesn't land on a player, also make sure the player isn't trapped by destructible blocks
  checkIfPlayer(x, y) {
    let checkPlayer = (y === 0) && (x === 0);
    let trappedXDirection = (y === 0 && x === 1) || (y === 0 && x === 2) || (y === 0 && x === 3);
    let trappedYDirection = (y === 1 && x === 0) || (y === 2 && x === 0) || (y === 3 && x === 0); 
    return (checkPlayer || trappedXDirection || trappedYDirection);
  }

  // get original destructible blocks
  getBlockCoordinates() {
    let coordArr = [1, 2, 3, 4, 5];
    
    while (coordArr.length < 5) {
      // generate two random numbers within the 12 by 12 grid
      let x = Math.floor(Math.random() * 12);
      let y = Math.floor(Math.random() * 12);

      // check if player is where destructible block might be
      // true means player is there, false means player is not there and will not be trapped by block

      // check if the generated coordinate is the same as any of the permanent blocks
    }
  }

  checkBlock(x, y) {
    let noBlock = this.blockCoordinates.every(block => {
      return !(y / 2 === block[0] && x / 2 === block[1]);
    });
    return noBlock;
  }

  // NOTE: canvas grid starts with the top left corner as 0,0
  // increment coordinates to go down and right, decrement to go up and left

  // increment the player coordinate one in the x direction if it will not go outside the boundary
  moveRight() {
    let newCoordinate = [this.state.playerCoordinate[0] + 1, Math.ceil(this.state.playerCoordinate[1])];
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
      default: console.log(keyPressed);
    }
  }


  render() {
    return (
      <>
        {this.state.countdown > 0 && <h2>{this.state.countdown}</h2>}
        {this.state.countdown <= 0 &&
          <GameCanvas
            playerCoordinate={this.state.playerCoordinate}
            blockCoordinates={this.blockCoordinates}
          />}
      </>
    )
  }
}

export default Main;