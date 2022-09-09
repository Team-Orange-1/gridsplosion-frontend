import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

class EndgameModal extends React.Component {

  winOrLose() {
    if (this.props.enemyCoordinates.length === 0) {
      return 'You Win!'
    } else {
      this.noScore();
      return "Game Over! Try again?!"
    }
  }

  noScore() {
    if (this.props.enemyCoordinates.length === 0) {
      return this.props.score + " seconds!";
    } else {
      return 'Win a game to see your score!';
    }
  }

  render() {
   
      let newArr = this.props.leaders.map((data, idx) => {
        return (<p>Score: {data.highScore} <br/> Name: {data.email}</p>
        )
      });
    
    return (
      <Modal show={this.props.gameOver}>
        <Modal.Header>
          <Modal.Title>{this.winOrLose()}</Modal.Title>
        </Modal.Header>
        <h3>Score</h3>
        <Modal.Body>{this.noScore()}</Modal.Body>
        <br></br>
        <Modal.Title>Leaderboards</Modal.Title>
        <ListGroup as="ol" numbered>
          <ListGroup.Item as="li">{newArr[0]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[1]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[2]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[3]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[4]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[5]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[6]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[7]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[8]}</ListGroup.Item>
          <ListGroup.Item as="li">{newArr[9]}</ListGroup.Item>
        </ListGroup>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.startGame}>
            Play Again
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EndgameModal;
