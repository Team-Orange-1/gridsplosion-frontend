import './App.css';
import React from 'react';
import { withAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import Player from './components/Player'

class App extends React.Component {
  render() {
    const { user } = this.props.auth0;

    return (
      <>
        {!this.props.auth0.isAuthenticated && <LoginButton />}

        {this.props.auth0.isAuthenticated && <Player user={user} />}
      </>
    )
  }
}

// useAuth0 — is for functional components
// withAuth0 — is for class components



export default withAuth0(App);

