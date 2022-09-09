import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from 'react-bootstrap/Button';
import './LoginButton.css';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div id="loginPage">
      <h2>Please log in</h2>
      <Button onClick={() => loginWithRedirect()}>Log In</Button>
    </div>
  )
};

export default LoginButton;
