import React from 'react';

interface AuthFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default AuthForm;