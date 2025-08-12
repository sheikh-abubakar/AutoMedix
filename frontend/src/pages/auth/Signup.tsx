import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import RoleSelector from './RoleSelector';

const Signup = () => {
  const { signup } = useAuth();
  const [role, setRole] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    const name = event.currentTarget.name.value;
    signup(email, password, name, role);
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input type="email" name="email" />
        <br />
        <label>Password:</label>
        <input type="password" name="password" />
        <br />
        <label>Name:</label>
        <input type="text" name="name" />
        <br />
        <RoleSelector onRoleChange={(role) => setRole(role)} />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;