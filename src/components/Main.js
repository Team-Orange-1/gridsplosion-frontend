import GameCanvas from './GameCanvas';
import React from 'react';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerCoordinate: [0, 0],
      destructibleBlocks: [],
      countdown: 5,
      bombCoordinates: [],
      radius: []
    }
  }

  // coordinates for the 
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

    while (coordArr.length < 9) {
      // generate two random numbers within the 12 by 12 grid
      let x = Math.floor(Math.random() * 12);
      let y = Math.floor(Math.random() * 12);

      // check if the generated coordinate is the same as any of the permanent blocks
      // checkForPermanentBlocks returns false if there is a permanent block at that coordinate
      let noPermanentBlocks = this.checkBlock(x * 2, y * 2);
      if (noPermanentBlocks) coordArr.push([x, y]);
      this.setState({ destructibleBlocks: coordArr });
    }
  }

  // this function is used to check for permanent blocks when player tries to move
  // also used when generating destructible blocks
  // also used to check if there is blocks in the bomb radius
  checkBlock(x, y) {
    let noBlock = [...this.blockCoordinates, ...this.state.destructibleBlocks].every(block => {
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

  // should drop a bomb at players current interval and start a timer for when it goes off
  dropBomb() {
    let bombArr = this.state.bombCoordinates;
    // get the coordinate of the player and see if a bomb has already been dropped there
    let newCoord = ([this.state.playerCoordinate[1] / 2, this.state.playerCoordinate[0] / 2]);
    let duplicate = bombArr.some(coord => newCoord[0] === coord[0] && newCoord[1] === coord[1]);
    // if less than five bombs dropped and not a duplicate, add bomb to coordinate array
    if (this.state.bombCoordinates.length < 5 && !duplicate) {
      let bombArr = this.state.bombCoordinates;
      bombArr.push(newCoord);
      this.setState({ bombCoordinates: bombArr }, this.explosion);

      let radiusArr = this.state.radius;
      radiusArr.push(this.getRadius(newCoord));
      this.setState({radius: radiusArr});
    }
  }

  // when timer goes off, check for destructible blocks, enemies, and player in bomb radius 
  explosion() {
    let temp = this.state.bombCoordinates;
    setTimeout(() => {
      temp.shift();
      this.setState({ bombCoordinates: temp });
    }, 5000);
  }

  // determine the radius of the bomb, and check what is in that radius
  getRadius(coord) {
    return [[coord[1]+1, coord[0]], [coord[1]+2, coord[0]], [coord[1]-1, coord[0]], [coord[1]-2, coord[0]], [coord[1], coord[0]+1], [coord[1], coord[0]+2], [coord[1], coord[0]-1], [coord[1], coord[0]-2]];
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
      case keyPressed === ' ': this.dropBomb();
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
            destructibleBlocks={this.state.destructibleBlocks}
            bombCoordinates={this.state.bombCoordinates}
            radius={this.state.radius}
          />}
      </>
    )
  }
}

export default Main;