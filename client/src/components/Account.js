import { Tabs, TabList, TabPanels, Tab, TabPanel, Button } from '@chakra-ui/react'
import Movies from './Movies';
import TvShows from './TvShows';
import axios from 'axios';
import {useState, useEffect} from 'react';
import url from '../helpers/url';
import Loader from './static/Loader';
import {FaRegTrashAlt} from 'react-icons/fa';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    useToast
  } from '@chakra-ui/react';
import {useNavigate} from 'react-router-dom';

function Account () {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${url}/user/account`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            setUserData(response.data.userData[0]);
            setLoading(false);
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the user data',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
                localStorage.removeItem('auth');
                navigate('/login');
            } else {
                toast({
                    title: 'Error',
                    description: 'Some error occured, try again later.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleDeleteModal = () => {
        onOpen();
    }

    const handleAccountDelete = async () => {
        try {
            await axios.delete(`${url}/user/account`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            onClose();
            localStorage.removeItem('auth');
            navigate('/login');
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to delete the account',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
                localStorage.removeItem('auth');
                navigate('/login');
            } else {
                toast({
                    title: 'Error',
                    description: 'Some error occured, try again later.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
    }

    return (
        <>
            <div className='header'>
                <h1>Account</h1>
            </div>
            
            {
                loading ?
                <Loader />
                :
                <div className='userAccount'>
                    <div className='userData'>
                        <p className='userMail'>
                            {userData.email}
                        </p>
                        <p className='userCreatedAt'>
                            Created at: {new Date(userData.created_at).toLocaleDateString('en-GB')}
                        </p>
                        <p className='userLastLogin'>
                            Last login: {userData.last_login}
                        </p>
                        <Button style={{marginTop: '8px'}} size={'md'} onClick={handleDeleteModal} leftIcon={<FaRegTrashAlt />} colorScheme='red' variant='solid'>
                            Delete Account
                        </Button>
                        <AlertDialog
                            isOpen={isOpen}
                            onClose={onClose}
                        >
                            <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    Delete Account
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                Are you sure? You can't undo this action afterwards.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                <Button colorScheme='red' onClick={handleAccountDelete}>
                                    Delete
                                </Button>
                                <Button ml={3} onClick={onClose}>
                                    Cancel
                                </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </div>
                    <Tabs style={{paddingTop: '12px'}} variant={'enclosed'}>
                        <TabList>
                            <Tab>Movies</Tab>
                            <Tab>TV Shows</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <Movies />
                            </TabPanel>
                            <TabPanel>
                                <TvShows />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            }
        </>
    );
}

export default Account;