import { useState } from 'react';
import Login from './Login';
import Register from './Register';

interface AuthProps {
  onClose?: () => void;
}

const Auth = ({ onClose }: AuthProps) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-wrapper">
      <button 
        className="auth-close-button"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div className="auth-toggle">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      {isLogin ? <Login /> : <Register />}
    </div>
  );
};

export default Auth; 