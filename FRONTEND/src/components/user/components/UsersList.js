//third party librarty imporrts
import React from 'react';

//own file imports/
import './UsersList.css';
import UserItem from './UserItem';
import Card from '../../shared/UIElements/Card';

const UsersList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='center'>
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul>
      {props.items.map((user) => (
        // places will contain the num of places the user created.
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
