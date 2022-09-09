import React from "react";
import { Modal, Card } from "react-bootstrap";

class EndgameModal extends React.Component {


  render() {
   
      let newArr = this.props.leaders.map((data, idx) => {
        return (<p>Score: {data.highScore} <br/> Name: {data.email}</p>
        )
      });
    
    return (
      <Modal show={this.props.gameOver}>
        <Modal.Header>
          <Modal.Title>About Us</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>

          </Card>
          <Card>
            
          </Card>
          <Card>
            
          </Card>
        </Modal.Body>
        <br></br>
      </Modal>
    );
  }
}

export default EndgameModal;
