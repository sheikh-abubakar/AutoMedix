import React from 'react';

interface RoleSelectorProps {
  onRoleChange: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps & { value?: string }> = ({ onRoleChange, value }) => {
  const roles = ['patient', 'doctor'];
  return (
    <select
      onChange={(event) => onRoleChange(event.currentTarget.value)}
      value={value || ''}
      required
    >
      <option value="" disabled>Select role</option>
      {roles.map((role) => (
        <option key={role} value={role}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </option>
      ))}
    </select>
  );
};

export default RoleSelector;