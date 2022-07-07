import * as React from 'react';
import { NavLink } from "react-router-dom";
import { Button } from '../components/button';
import './main.css';

export interface IMainTemplateProps {
  children?: React.ReactNode
}

export default function MainTemplate({ children }: IMainTemplateProps) {
  const navActiveStyle: React.CSSProperties = {
    textDecoration: "underline"
  }

  return (
    <>
      <nav className='nav'>

        <div className="left">
          <div className="link">
            <NavLink to='/' style={({ isActive }) => {
              return isActive ? navActiveStyle : {}
            }}>
              Home
            </NavLink>
          </div>
        </div>

        <div className="middle">
          <div className="link">
            hello
          </div>
        </div>

        <div className="right">
          <Button styleType='primary' as='link' to='/login'>Login</Button>
          <Button styleType='secondary' as='link' to='/register'>Register</Button>
        </div>
      
      </nav>
      <div>
        {children}
      </div>
    </>
  );
}
