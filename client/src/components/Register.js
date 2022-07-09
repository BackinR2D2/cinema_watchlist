import {Form, Container} from 'react-bootstrap';
import {Button} from '@chakra-ui/react'
import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios';
import url from '../helpers/url';
import * as yup from 'yup';
import { useToast } from '@chakra-ui/react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
}) 

function Register () {

    const toast = useToast();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const handleRegister = async () => {
        try {
            await schema.isValid({ email, password });
            const response = await axios.post(`${url}/verify`, {email, password});
            if(response.data.status === 1) {
                setIsOpen(true);
            }
        } catch(error) {
            console.log(error.response);
            if(error.response.status === 400) {
                toast({
                    title: 'Invalid email or password.',
                    status: 'warning',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(email === '' || password === '' || confirmPassword === '') {
                toast({
                    title: 'Please fill all the fields.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
            } else if(password !== confirmPassword) {
                toast({
                    title: 'Passwords do not match.',
                    status: 'warning',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
               await handleRegister();
            }
        } catch (error) {
            toast({
                title: 'Some error occured, try again.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    }

    const handleSubmitCode = async (e) => {
        e.preventDefault();
        if(code === '') {
            toast({
                title: 'Enter the code.',
                status: 'warning',
                duration: 2000,
                isClosable: true,
            });
        } else {
            const {data} = await axios.post(`${url}/register`, {email, password, code});
            if(data.message === 'User created') {
                navigate('/login');
                setIsOpen(false);
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
                    <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </Form.Group>
                    <Button type='submit' colorScheme='teal' size='md' onClick={handleSubmit} >
                        Register
                    </Button>
                    <div className='formFooter'>
                        <p>If you already have an account, go <Link to='/login'>here</Link></p>
                    </div>
                </Form>
                <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Enter the code</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Code</Form.Label>
                                <Form.Control type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                            </Form.Group>
                            <Button type='submit' colorScheme='teal' size='sm' onClick={handleSubmitCode} >
                                Submit
                            </Button>
                        </Form>
                    </ModalBody>
                    </ModalContent>
                </Modal>
            </Container>
        </div>
    );
}

export default Register;