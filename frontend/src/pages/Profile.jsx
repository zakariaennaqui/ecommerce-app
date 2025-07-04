import React from 'react';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const Profile = () => {
  const { user } = useContext(ShopContext);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      {user ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add more profile fields as needed */}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
