import React from 'react';

interface RoleSelectorProps {
  onRoleChange: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleChange }) => {
  const roles = ['patient', 'doctor', 'admin'];

  return (
    <select onChange={(event) => onRoleChange(event.currentTarget.value)}>
      {roles.map((role) => (
        <option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default RoleSelector;