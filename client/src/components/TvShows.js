import {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import url from '../helpers/url';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    IconButton,
    Modal,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalContent,
    ModalHeader,
    useDisclosure,
    Input
} from '@chakra-ui/react'
import {Link, useNavigate} from 'react-router-dom';
import Note from './static/Note';
import {FiXCircle, FiStar} from 'react-icons/fi';
import { Select, Button } from '@chakra-ui/react';
import { Pagination } from 'semantic-ui-react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useToast } from '@chakra-ui/react';

function TvShows () {

    const toast = useToast();
    const navigate = useNavigate();
    const [tvShows, setTvShows] = useState([]);
    const [tvShowsCount, setTvShowsCount] = useState(0);
    const [type, setType] = useState('');

    const [isToggled, setIsToggled] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [confirmDeleteMedia, setConfirmDeleteMedia] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [defaultTvShows, setDefaultTvShows] = useState([]);
    const [defaultTvShowsCount, setDefaultTvShowsCount] = useState(0);

    const [query, setQuery] = useState('');
    const [filterChoice, setFilterChoice] = useState('');

    let typingTimer = useRef(null);
    let tvShowId = useRef(null);
    let formedQuery = useRef(null);
    let currentPage = useRef(1);

    const getTvShowsSearch = async (res) => {
        try {
            formedQuery.current = res;
            const response = await axios.get(`${url}/user/tvshows/search/?searchInp=${res}&page=1`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            response.data.countList = parseInt(response.data.countList);
            setIsToggled(true);
            setType('search');
            setTvShows(response.data.list);
            setTvShowsCount(response.data.countList);
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the searched tv show(s)',
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
    
    const handleUserInput = async (e) => {
        clearTimeout(typingTimer.current);
        if(e.target.value !== '') {
            typingTimer.current = setTimeout(async () => {
                let res = (e.target.value) && (e.target.value).toLowerCase().trim();
                await getTvShowsSearch(res);
            }, 500);
        } else {
            setIsToggled(false);
            setType('default');
            setTvShows(defaultTvShows);
            setTvShowsCount(defaultTvShowsCount);
        }
    }

    const getTvShows = async () => {
        try {
            const response = await axios.get(`${url}/user/tvshows/?page=${currentPage.current}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            setTvShows(response.data.tvshows);
            setType('default');
            setDefaultTvShows(response.data.tvshows);
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the tv shows',
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

    const getTvShowsCount = async () => {
        try {
            const count = await axios.get(`${url}/user/tvshows/count`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            setTvShowsCount(parseInt((count.data.total[0].count)));
            setDefaultTvShowsCount(parseInt((count.data.total[0].count)));
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the tv shows count',
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
        if(type === 'default') {
            getTvShowsCount();
        }
    }, [type]);

    useEffect(() => {
        getTvShowsCount();
        getTvShows();
    }, []);


    const deleteMedia = async () => {
        try {
            await axios.delete(`${url}/user/watchlist/${tvShowId.current}`,  {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            onClose();
            removeFadeOut(document.querySelector(`tr[data-tvshow-id='${tvShowId.current}']`), 1000);
        } catch (error) {   
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to delete the tv show',
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

    const handleDeleteMedia = async (id) => {
        setConfirmDeleteMedia(true);
        tvShowId.current = id;
        onOpen();
    }


    const handleStatusChange = async (e, id) => {
        const tvShowsOptions = {
            status: e.target.value,
            id
        };
        try {
            const response = await axios.put(`${url}/user/watchlist`, tvShowsOptions, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            if(response.data.status) {
                toast({
                    title: `Tv Show status successfully changed.`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to change the tv show status',
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

    const handlePageChange = async (e, type) => {
        try {
            let formedUrl = '';
            const page = (e.target).getAttribute('value');
            currentPage.current = parseInt(page);
            switch(type) {
                case 'default':
                    formedUrl = `${url}/user/tvshows/?page=${page}`;
                    break;
                case 'search':
                    formedUrl = `${url}/user/tvshows/search/?searchInp=${query}&page=${page}`;
                    break;
                case 'filter':
                    formedUrl = `${url}/user/tvshows/filter/?filter=${filterChoice}&page=${page}`;
                    break;
                default:
                    formedUrl = `${url}/user/tvshows/?page=${page}`;
                    break;
            }
            const response = await axios.get(formedUrl, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            if(type === 'default') {
                setTvShows(response.data.tvshows);
            } else if(type === 'search') {
                setTvShows(response.data.list);
            } else if(type === 'filter') {
                setTvShows(response.data.filteredTvShows);
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the tv shows',
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
            setType('default');
            setTvShows(defaultTvShows);
            setTvShowsCount(defaultTvShowsCount);
        }
    }

    const handleFavoriteChange = async (e, id) => {
        let element;
        if(e.target.tagName === 'svg') {
            element = e.target.parentElement;
        } else if(e.target.tagName === 'BUTTON'){
            element = e.target;
        } else if(e.target.tagName === 'polygon') {
            element = (e.target.parentElement).parentElement;
        }
        const status = (element.getAttribute('active'));
        element.setAttribute('active', status === 'no' ? 'yes' : 'no');
        const tvShowOptions = {
            favorite: status === 'no' ? 'yes' : 'no',
            id
        };
        try {
           await axios.put(`${url}/user/watchlist/favorite`, tvShowOptions, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
        }
        catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to add the tv show to favorites',
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

    const handleFilterChange = async (e) => {
        let filterValue;
        setIsSelected(true);
        if(e.target.value === '') {
            setIsSelected(false);
            setType('default');
            setTvShows(defaultTvShows.current);
            setTvShowsCount(defaultTvShowsCount.current);
        } else {
            setType('filter');
            switch(e.target.value) {
                case 'watching':
                    filterValue = 'Watching';
                    break;
                case 'completed':
                    filterValue = 'Completed';
                    break;
                case 'onHold':
                    filterValue = 'On Hold';
                    break;
                case 'dropped':
                    filterValue = 'Dropped';
                    break;
                case 'planToWatch':
                    filterValue = 'Plan To Watch';
                    break;
                case 'favorites':
                    filterValue = 'Favorites';
                    break;
                default:
                    filterValue = 'Plan To Watch';
                    break;
            }
            try {
                setFilterChoice(filterValue);
                currentPage.current = 1;
                const response = await axios.get(`${url}/user/tvshows/filter/?filter=${filterValue}&page=1`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('auth')
                    }
                });
                setTvShows(response.data.filteredTvShows);
                setTvShowsCount(response.data.filteredTvShowsCount);
            } catch (error) {
                if(error.response.status === 403) {
                    toast({
                        title: 'Please login to get the filtered tv show(s)',
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
                setType('default');
                setTvShows(defaultTvShows);
                setTvShowsCount(defaultTvShowsCount);
            }
        }
    }

    const removeFadeOut = ( el, speed ) => {
        const seconds = speed/1000;
        el.style.transition = "opacity "+seconds+"s ease";
        el.style.opacity = 0;
        try {
            if(type === 'filter') {
                setTimeout(async () => {
                    const response = await axios.get(`${url}/user/tvshows/filter/?filter=${filterChoice}&page=${currentPage.current}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('auth')
                        }
                    });
                    setTvShows(response.data.filteredTvShows);
                    setTvShowsCount(response.data.filteredTvShowsCount);
                }, speed);
            } else if(type === 'search') {
                setTimeout(async () => {
                    const response = await axios.get(`${url}/user/tvshows/search/?searchInp=${formedQuery.current}&page=${currentPage.current}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('auth')
                        }
                    });
                    setTvShows(response.data.list);
                    setTvShowsCount(parseInt(response.data.countList));
                }, speed);
            } else {
                setTimeout(() => {
                    getTvShows();
                    getTvShowsCount();
                }, speed);
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the tv shows',
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
        <div className='tvshows'>
            <div className='tvShowsOptions'>
                <Input style={{width: '30%'}} disabled={isSelected} type={'search'} value={query} onChange={(e) => setQuery(e.target.value)} onKeyUp={handleUserInput} variant='flushed' placeholder='Search for a tv show' />
                <div className='filter'>
                    <Select disabled={isToggled} placeholder={'Filter by'} onChange={handleFilterChange}>
                        <option value='watching'>Watching</option>
                        <option value='completed'>Completed</option>
                        <option value='onHold'>On Hold</option>
                        <option value='dropped'>Dropped</option>
                        <option value='planToWatch'>Plan To Watch</option>
                        <option value='favorites'>Favorites</option>
                    </Select>
                </div>
            </div>
            {
                defaultTvShowsCount === 0 ?
                    <div className="card">
                        <div className="card-body" style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <h5 className="card-title" style={{textAlign: 'center', fontSize: '2.4rem'}}>
                                <FiXCircle style={{display: 'block', margin: 'auto', marginBottom: '16px'}} />
                                No Tv Shows Stored
                            </h5>
                        </div>
                    </div>
                    :
                    <div style={{paddingBottom: '4em'}}>
                        {
                            tvShowsCount === 0 ?
                            <div className="card">
                                <div className="card-body" style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <h5 className="card-title" style={{textAlign: 'center', fontSize: '2.4rem'}}>
                                        <FiXCircle style={{display: 'block', margin: 'auto', marginBottom: '16px'}} />
                                        No results found
                                    </h5>
                                </div>
                            </div>
                            :
                            <TableContainer>
                                <Table variant='simple'>
                                    <Thead>
                                    <Tr>
                                        <Th>Poster</Th>
                                        <Th>Title</Th>
                                        <Th>Year</Th>
                                        <Th>Rating</Th>
                                        <Th>Added at</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                    </Thead>
                                    <Tbody>
                                        {
                                            tvShows.map(tvshow => (
                                                <Tr key={tvshow.id} data-tvshow-id={tvshow.id}>
                                                    <Td style={{width: '100px'}}>
                                                        <Link to={{
                                                            pathname: `/details/${tvshow.info.imdbId}`,
                                                            query: {
                                                                type: 'tvshow'
                                                            }
                                                        }}>
                                                            <LazyLoadImage title="More Details" style={{width: '60px'}}  alt={tvshow.info.title} effect={'blur'} src={tvshow.info.poster} />
                                                        </Link>
                                                    </Td>
                                                    <Td>{tvshow.info.title}</Td>
                                                    <Td>{tvshow.info.year === '' || tvshow.info.year === undefined ? 'N/A' : tvshow.info.year}</Td>
                                                    <Td>{tvshow.info.rating === '' || tvshow.info.rating === undefined ? 'N/A' : tvshow.info.rating}</Td>
                                                    <Td>{new Date(tvshow.created_at).toLocaleDateString('en-GB')}</Td>
                                                    <Td>
                                                    {/* watching || completed || on hold || dropped || plan to watch */}
                                                        <Select placeholder={tvshow.status} onChange={(e) => handleStatusChange(e, tvshow.id)}>
                                                            <option value='watching'>Watching</option>
                                                            <option value='completed'>Completed</option>
                                                            <option value='onHold'>On Hold</option>
                                                            <option value='dropped'>Dropped</option>
                                                            <option value='planToWatch'>Plan To Watch</option>
                                                        </Select>
                                                    </Td>
                                                    <Td><Note mediaTitle={tvshow.info.title} mediaId={tvshow.id} /></Td>
                                                    <Td>
                                                        <IconButton size={'md'} colorScheme={'red'} icon={<FiXCircle/>} onClick={() => handleDeleteMedia(tvshow.id)} />
                                                        {
                                                            confirmDeleteMedia ?
                                                            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                                                                <ModalContent>
                                                                <ModalHeader>Modal Title</ModalHeader>
                                                                <ModalCloseButton />
                                                                <ModalBody>
                                                                    Are you sure you want to delete this tvshow?
                                                                </ModalBody>

                                                                <ModalFooter>
                                                                    <Button colorScheme='red' mr={3} onClick={deleteMedia}>
                                                                        Confirm
                                                                    </Button>
                                                                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                                                                        Close
                                                                    </Button>
                                                                </ModalFooter>
                                                                </ModalContent>
                                                            </Modal>
                                                            :
                                                            <></>
                                                        }
                                                    </Td>
                                                    <Td>
                                                        <IconButton size={'md'} id={'mediaBtn'} icon={<FiStar />} active={tvshow.favorite} onClick={(e) => handleFavoriteChange(e, tvshow.id)} />
                                                    </Td>
                                                </Tr>
                                            ))
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        }
                    {
                        tvShowsCount === 0 ?
                            <></>
                            :
                            <div style={{textAlign: 'center', position: 'fixed', bottom: 0, right: 0, left: 0}}>
                                <Pagination firstItem={Math.ceil(tvShowsCount / 10) === 1 ? null : undefined} lastItem={Math.ceil(tvShowsCount / 10) === 1 ? null : undefined} prevItem={Math.ceil(tvShowsCount / 10) === 1 ? null : undefined} nextItem={Math.ceil(tvShowsCount / 10) === 1 ? null : undefined} ellipsisItem={null} defaultActivePage={currentPage.current} totalPages={Math.ceil(tvShowsCount / 10)} onPageChange={(e) => handlePageChange(e, type)} />
                            </div>
                    }
                    </div>
            }
        </div>
    );
}

export default TvShows;