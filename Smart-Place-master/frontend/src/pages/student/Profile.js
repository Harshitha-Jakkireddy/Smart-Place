import React from "react";

function Profile() {

  const email = localStorage.getItem("email");

  return (
    <div style={{ padding: "30px" }}>
      <h2>My Profile</h2>

      <p>Email: {email}</p>

      <p>More profile features coming soon...</p>
    </div>
  );
}

export default Profile;