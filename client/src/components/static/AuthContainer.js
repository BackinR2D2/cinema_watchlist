import { Nav } from 'react-bootstrap';
import {Button} from '@chakra-ui/react/';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AuthContainer () {

    const auth = window.localStorage.getItem('auth');
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState('');

    useEffect(() => {
        if(auth) {
            setIsAuth(true);
        } else {
            setIsAuth(false);
        }
    }, [auth]);

    return (
        <>
            {
                isAuth ?
                <Nav style={{flexDirection: 'initial', padding: '12px', justifyContent: 'end'}}>
                    <Button colorScheme='blue' onClick={() => {
                        localStorage.removeItem('auth');
                        navigate('/login');
                    }}>Logout</Button>
                </Nav>
                :
                <Nav className='btnsGroup' style={{flexDirection: 'initial', padding: '12px', justifyContent: 'end'}}>
                    <Button style={{marginRight: '20px'}} size={'md'} colorScheme='blue' onClick={() => navigate('/login')}>Login</Button>
                    <Button colorScheme='blue' size={'md'} onClick={() => navigate('/register')}>Register</Button>
                </Nav>
            }
        </>
    )
}

export default AuthContainer;