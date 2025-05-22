import Register from './Register';
import { useEffect, useState } from 'react';
import Login from './Login';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  useEffect(
    () => {

    }, []
  );
  return (
    <div className="auth-wrapper">
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
