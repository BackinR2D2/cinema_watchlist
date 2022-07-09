import {Form, Container} from 'react-bootstrap';
import {Button} from '@chakra-ui/react'
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import url from '../helpers/url';
import * as yup from 'yup';
import { useToast } from '@chakra-ui/react';

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
}) 

function Login () {

    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if(email === '' || password === '') {
                toast({
                    title: 'Please fill all the fields.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
            } else if (password.length < 6) {
                toast({
                    title: 'Password must have at least 6 characters.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                await schema.isValid({ email, password });
                const response = await axios.post(`${url}/login`, {email, password});
                localStorage.setItem('auth', response.data.token);
                navigate('/');
            }
        } catch (error) {
            if(error.response.status === 400) {
                toast({
                    title: 'Invalid email or password.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Some error occured, try again.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }
    }

    return (
        <div className='registerForm'>
            <Container>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button type='submit' colorScheme='teal' size='md' onClick={handleSubmit} >
                        Login
                    </Button>
                    <div className='formFooter'>
                        <p>If you do not have an account, go <Link to='/register'>here</Link></p>
                    </div>
                </Form>
            </Container>
        </div>
    );
}

export default Login;