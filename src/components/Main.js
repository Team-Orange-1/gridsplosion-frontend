import GameCanvas from './GameCanvas';
import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoordinate: [20, 20],
      countdown: 5,
      blockCoordinates: []
    }
  }

  // when page loads, add the event listener, get block coordinates and start the timer
  componentDidMount() {
    document.addEventListener('keydown', (e) => { this.handleKeyPress(e) });
    this.getBlockCoordinates();
    this.startTimer();
  }

  // 5 second countdown, game canvas is rendered when countdown equals 0
  startTimer() {
    let interval = setInterval(() => {
      let decrement = this.state.countdown - 1;
      this.setState({ countdown: decrement }, () => { if (this.state.countdown <= 0) clearInterval(interval) });
    }, 1000)
  }

  // gets 15 coordinates for the blocks that player can't hit
  getBlockCoordinates() {
    let coordArr = [];
    while (coordArr.length < 30) {
      let x = Math.floor(Math.random() * 20);
      let y = Math.floor(Math.random() * 20);
      if (!(coordArr.some(coord => coord[0] === x && coord[1] === y)) && !(y === 20 && x === 20)) coordArr.push([x, y]);
    }
    this.setState({ blockCoordinates: coordArr });
  }

  checkBlock(x, y) {
    let noBlock = this.state.blockCoordinates.every(block => {
      return !(y/2 === block[0] && x/2 === block[1]);
    });
    return noBlock;
  }

  // NOTE: canvas grid starts with the top left corner as 0,0
  // increment coordinates to go down and right, decrement to go up and left

  // increment the player coordinate one in the x direction if it will not go outside the boundary
  moveRight() {
    let newCoordinate = [this.state.playerCoordinate[0] + 1, Math.ceil(this.state.playerCoordinate[1])];
    if (this.state.playerCoordinate[0] < 38 && this.checkBlock(newCoordinate[0]+1, newCoordinate[1])) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  // decrement the player coordinate one in the x direction if it will not go outside the boundary
  moveLeft() {
    let newCoordinate = [this.state.playerCoordinate[0] - 1, this.state.playerCoordinate[1]];
    if (this.state.playerCoordinate[0] > 0 && this.checkBlock(newCoordinate[0]-1, newCoordinate[1])) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  // decrement the player coordinate one in the y direction if it will not go outside the boundary
  moveUp() {
    let newCoordinate = [this.state.playerCoordinate[0], this.state.playerCoordinate[1] - 1];
    if (this.state.playerCoordinate[1] > .1 && this.checkBlock(newCoordinate[0], newCoordinate[1]-1)) {
      this.setState({ playerCoordinate: newCoordinate });
    }
  }

  // increment the player coordinate one in the y direction if it will not go outside the boundary
  moveDown() {
    let newCoordinate = [this.state.playerCoordinate[0], this.state.playerCoordinate[1] + 1];
    if (this.state.playerCoordinate[1] < 38 && this.checkBlock(newCoordinate[0], newCoordinate[1]+1)) {
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
            blockCoordinates={this.state.blockCoordinates}
          />}
      </>
    )
  }
}

export default Main;