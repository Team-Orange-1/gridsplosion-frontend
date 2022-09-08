import React from "react";
import { Modal, Button } from "react-bootstrap";

class EndgameModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
    }
  }

  render() {

    return (
      <Modal show={this.props.gameOver}>
        <Modal.Header>
          <Modal.Title>Game Stats</Modal.Title>
        </Modal.Header>
        <Modal.Body>We could pass the game states here</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary">
            Play Again
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default EndgameModal;
