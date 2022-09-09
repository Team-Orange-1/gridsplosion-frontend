import React from 'react';
import Main from './Main.js';
import axios from 'axios';
import Profile from './../Profile';

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentUser: {},
      leaders: []
    }
  }

  getAllUsers = async () => {
    try {
      const allUsers = await axios.get(`${process.env.REACT_APP_SERVER}/accounts`);
      this.setState({ users: allUsers.data }, () => {
        this.sortByScore();
        this.setCurrentUser();
      });
    } catch (e) {
      console.log(e);
    }
  }

  sortByScore() {
    let leaders = this.state.users.sort((previous, current) => previous.highScore - current.highScore);
    if (leaders.length < 10) leaders = leaders.slice(0, 10);
    this.setState({ leaders: leaders });
  }

  handleCreateUser = async () => {
    let newUser = {
      email: this.props.user.email,
      highScore: 0
    }
    try {
      let response = await axios.post(`${process.env.REACT_APP_SERVER}/account`, newUser);
      let createdUser = response.data;
      this.setState({ users: [...this.state.users, createdUser], currentUser: createdUser });

    } catch (e) {
      console.log(e);
    }
  }

  upDateScore = async (highScore) => {
    let updateUser = this.state.users.find(user => user.email === this.props.user.email);
    updateUser.highScore = highScore;
    try {
      let url = `${process.env.REACT_APP_SERVER}/account/${updateUser._id}`;
      let returnedUser = await axios.put(url, updateUser);
      let newUsersArr = this.state.users.map(user => {
        return user._id === returnedUser._id ? returnedUser.data : user;
      });
      this.setState({ users: newUsersArr, currentUser: updateUser });
    } catch (e) {
      console.log(e);
    }
  }

  setCurrentUser() {
    let foundUser = this.state.users.find(user => user.email === this.props.user.email);
    foundUser ? this.setState({ currentUser: foundUser }) : this.handleCreateUser();
  }

  componentDidMount() {
    this.getAllUsers();
  }

  handleDeleteUser = async() => {
    try{
      let url = `${process.env.REACT_APP_SERVER}/account/${this.state.currentUser._id}`;
      await axios.delete(url);
      let newArr = this.state.users.filter(user => user._id !== this.state.currentUser.id);
      this.setState({users: newArr});
    } catch(err) {
      console.log(err);
    }
   
  }

  render() {
    return (
      <>
        <Profile handleDeleteUser={this.handleDeleteUser}/>
        <Main
          highScore={this.state.currentUser.highScore}
          updateScore={this.upDateScore}
          leaders={this.state.leaders}
        />
      </>
    );
  }
}

export default Player;
