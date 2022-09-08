import React from "react";
import { Modal, Button } from "react-bootstrap";

class EndgameModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.gameOver}>
        <Modal.Header>
          <Modal.Title>Game Stats</Modal.Title>
        </Modal.Header>
        <Modal.Body>We could pass the game states here</Modal.Body>
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
