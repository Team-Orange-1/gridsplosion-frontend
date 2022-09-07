import React from "react";
import { Modal, Form, Card, Container, Button } from "react-bootstrap";
import { Component } from "react";
import ReactDOM from "react-dom";
import Main from "./Main";

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);

class StartFormModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
    }
  }

  handleEndInput = (e) => {
    console.log(e);
    this.setState({
      title: e.target.value,
    });
  }

  handleEndSubmit = (e) => {
    e.preventDefault();
    const endGame = {
      title: e.target.title.value,
      description: e.target.description.value,
      status: e.target.status.value
    };
    this.props.onHide();
    this.props.handleCreateStartGame(endGame);
  } 

  render() {

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onHide}
      >

        <Container>
          <Card className="Game Over!">
            <Form onSubmit={this.handlestartSubmit}>
              <Form.Group controlId="title">
                <Form.Label>Gridsplosion</Form.Label>
                <Form.Control placeholder="test1"
                  type="text"
                  required
                  input="title"
                  onInput={this.handleTitleInput}
                />
              </Form.Group>
              <Button
                disabled={this.state.title.length < 1 || this.state.description.length < 1 || this.state.status.length < 1}
                type="Play Again!">
                Test to see what this button does. 
              </Button>
            </Form>
          </Card>
        </Container>
      </Modal>
    )
  }
}


export default StartFormModal;
