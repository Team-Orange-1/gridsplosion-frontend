import Main from './components/Main.js';
import './App.css';
import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      currentUser: {}
    }
  }

  getAllUsers = async () => {
    try {
      const allUsers = await axios.get(`${process.env.REACT_APP_SERVER}/accounts`);
      this.setState({users: allUsers});
    } catch(e) {
      console.log(e);
    }
  }

  handleCreateUser = async () => {
    let newUser = {
      email: this.props.user.email,
      highScore: 0
    }
    try {
      let response = await axios.post(`${process.env.REACT_APP_SERVER}/account`, newUser);
      let createdUser = response.data;
      this.setState({users: [...this.state.users, createdUser], currentUser: createdUser});

    } catch(e) {
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
      this.setState({users: newUsersArr, currentUser: updateUser});
    } catch (e) {
      console.log(e);
    }
  }

  setCurrentUser() {
    let foundUser = this.state.users.find(user => user.email === this.props.user.email);
    if(foundUser) this.setState({currentUser: foundUser});
  }

  componentDidMount() {
    this.getAllUsers();
    console.log(this.state.users);
  }

  render() {
    return (
      <>
          <h1>new</h1>
          {this.props.auth0.isAuthenticated
            ? <LogoutButton/>
            : <LoginButton/>
          }
          {this.props.auth0.isAuthenticated
          ? <>
            <Profile/>
            <Main/>
          </> 
            : <h2>Please log in</h2>
          }
        </>
      )
    }
  }
  
  // useAuth0 — is for functional components
  // withAuth0 — is for class components


export default withAuth0 (App);

// class App extends React.Component {
//   render() {
//     return(
//       <Main/>
//     )
//   }
// }

// export default App;


