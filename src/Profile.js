import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import './Profile.css';
import LogoutButton from "./LogoutButton";
import Button from 'react-bootstrap/Button';

const Profile = (props) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div id="profile">
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <LogoutButton />
        <Button onClick={() => {
          props.handleDeleteUser();
          logout({ returnTo: window.location.origin });
        }}>
          Delete
        </Button>
      </div>
    )
  );
};

export default Profile;
