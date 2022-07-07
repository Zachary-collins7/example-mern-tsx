import './form.css';
import { Button } from '../components/button';
import MainTemplate from '../templates/main';

export interface IRegisterProps {
}

export default function Register(props: IRegisterProps) {
  const handelSubmit = () => {
    console.log("submit");
  }

  return (
    <MainTemplate>
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <form onSubmit={handelSubmit}>

          <h1>Register for AppName</h1>

          <div className='label-wrapper'>
            <label>
              Name: <br />
              <input type="text" />
            </label>
          </div>

          <div className='label-wrapper'>
            <label>
              Email: <br />
              <input type="text" />
            </label>
          </div>

          <div className='label-wrapper'>
            <label>
              Password: <br />
              <input type="text" />
            </label>
          </div>

          {/* <Button styleType='tertiary' as='link' to='/'> 
          Forgot Password?
        </Button> */}

          <Button
            style={{ float: 'right', marginBottom: '0.75rem', fontSize: '0.8rem' }}
            styleType='tertiary'
            as='externalLink'>
            Forgot Passord?
          </Button>

          <div className="btn-wrapper">
            <Button
              type='submit'
              styleType='primary'
              as='button'>
              Login
            </Button>
          </div>

        </form>
      </div>
    </MainTemplate>
  );
}
