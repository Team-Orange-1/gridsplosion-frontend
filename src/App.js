import Main from './components/Main.js';
import './App.css';
import React from 'react';
import { useAuth0, withAuth0 } from '@auth0/auth0-react';
import Profile from './Profile';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Content from './Content';

// function App() {
//   return (
//     <>
//       <Main/>
//     </>
//   );
// }
// export default App;

class App extends React.Component {
  render() {
    return (
      <>
          <h1>new</h1>
          {this.props.auth0.isAuthenticated
            ? <LogoutButton/>
            : <LoginButton/>
          }
          {this.props.auth0.isAuthenticated
            ? <Main/>
            : <h2>Please log in</h2>
          }
        </>
      )
    }
  }
  
  // useAuth0 — is for functional components
  // withAuth0 — is for class components
  
  let SERVER = process.env.REACT_APP_SERVER; 


export default withAuth0 (App);


