import React from "react";
import { Modal, Form, Card, Container, Button } from "react-bootstrap";
import { Component } from "react";

class EndgameModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
    }
  }

  handleStartInput = (e) => {
    console.log(e);
    this.setState({
      title: e.target.value,
    });
  }

  handleStartSubmit = (e) => {
    e.preventDefault();
    const startGame = {
      title: e.target.title.value,
      description: e.target.description.value,
      status: e.target.status.value
    };
    this.props.onHide();
    this.props.handleCreateStartGame(startGame);
  } 

  render() {

    return (
      // <Modal
      //   show={this.props.show}
      //   onHide={this.props.onHide}
      // >

      //   <Container>
      //     <Card className="Start Game!">
      //       <Form onSubmit={this.handlestartSubmit}>
      //         <Form.Group controlId="title">
      //           <Form.Label>Gridsplosion</Form.Label>
      //           <Form.Control placeholder="test1"
      //             type="text"
      //             required
      //             input="title"
      //             onInput={this.handleTitleInput}
      //           />
      //         </Form.Group>
      //         <Button
      //           disabled={this.state.title.length < 1 || this.state.description.length < 1 || this.state.status.length < 1}
      //           type="Play Game!">
      //           Test to see what this button does. 
      //         </Button>
      //       </Form>
      //     </Card>
      //   </Container>
      // </Modal>

      <Modal show={this.props.gameOver}>
        <Modal.Header>
          <Modal.Title>Game Stats</Modal.Title>
        </Modal.Header>
        <Modal.Body>We could pass the game states here</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.startNewGame}>
            Play Again
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}




export default EndgameModal;