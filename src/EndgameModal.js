import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

class EndgameModal extends React.Component {

  winOrLose() {
    if (this.props.enemyCoordinates.length === 0) {
      console.log(this.props.enemyCoordinates);
      return 'You Win!'
    } else {
      return "Game Over! Try again?!"
    }
  }

  render() {
    return (
      <Modal show={this.props.gameOver}>
        <Modal.Header>
          <Modal.Title>{this.winOrLose()}</Modal.Title>
        </Modal.Header>
        <h2>Your score: </h2>
        <Modal.Body>Seconds:{this.props.score}</Modal.Body>
        <br></br>
        <Modal.Title>Leaderboards</Modal.Title>
        <ListGroup as="ol" numbered>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
          <ListGroup.Item as="li">empty</ListGroup.Item>
        </ListGroup>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.startGame}>
            Play Again
          </Button>
        </Modal.Footer>
        <Modal.Footer>
          <Button variant="secondary" disabled>Leaderboards</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EndgameModal;
