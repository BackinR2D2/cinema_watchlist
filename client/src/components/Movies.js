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
    Input,
} from '@chakra-ui/react'
import {Link, useNavigate} from 'react-router-dom';
import Note from './static/Note';
import {FiXCircle, FiStar} from 'react-icons/fi';
import { Select, Button } from '@chakra-ui/react';
import { Pagination } from 'semantic-ui-react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useToast } from '@chakra-ui/react';

function Movies () {

    // types -> default, search, filter

    const toast = useToast();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [moviesCount, setMoviesCount] = useState(0);
    const [type, setType] = useState('');

    const [isToggled, setIsToggled] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [confirmDeleteMedia, setConfirmDeleteMedia] = useState(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [defaultMovies, setDefaultMovies] = useState([]);
    const [defaultMoviesCount, setDefaultMoviesCount] = useState(0);

    const [query, setQuery] = useState('');
    const [filterChoice, setFilterChoice] = useState('');

    let typingTimer = useRef(null);
    let movieId = useRef(null);
    let formedQuery = useRef(null);
    let currentPage = useRef(1);

    const getMoviesSearch = async (res) => {
        try {
            formedQuery.current = res;
            const response = await axios.get(`${url}/user/movies/search/?searchInp=${res}&page=1`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            response.data.countList = parseInt(response.data.countList);
            setIsToggled(true);
            setType('search');
            setMovies(response.data.list);
            setMoviesCount(response.data.countList);
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the searched movie(s)',
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
                await getMoviesSearch(res);
            }, 500);
        } else {
            setIsToggled(false);
            setType('default');
            setMovies(defaultMovies);
            setMoviesCount(defaultMoviesCount);
        }
    }

    const getMovies = async () => {
        try {
            const response = await axios.get(`${url}/user/movies/?page=${currentPage.current}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            setMovies(response.data.movies);
            setType('default');
            setDefaultMovies(response.data.movies);
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the movies',
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

    const getMoviesCount = async () => {
        try {
            const count = await axios.get(`${url}/user/movies/count`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            setMoviesCount(parseInt((count.data.total[0].count)));
            setDefaultMoviesCount(parseInt((count.data.total[0].count)));
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the movies count',
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
            getMoviesCount();
        }
    }, [type]);

    useEffect(() => {
        getMoviesCount();
        getMovies();
    }, []);

    const deleteMedia = async () => {
        try {
            await axios.delete(`${url}/user/watchlist/${movieId.current}`,  {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            onClose();
            removeFadeOut(document.querySelector(`tr[data-movie-id='${movieId.current}']`), 1000);
        } catch (error) {   
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to delete the movie',
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
        movieId.current = id;
        onOpen();
    }

    const handleStatusChange = async (e, id) => {
        const movieOptions = {
            status: e.target.value,
            id
        };
        try {
            const response = await axios.put(`${url}/user/watchlist`, movieOptions, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            if(response.data.status) {
                toast({
                    title: `Movie status successfully changed.`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
                currentPage.current = 1;
                getMovies();
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to change the movie status',
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
                    formedUrl = `${url}/user/movies/?page=${page}`;
                    break;
                case 'search':
                    formedUrl = `${url}/user/movies/search/?searchInp=${query}&page=${page}`;
                    break;
                case 'filter':
                    formedUrl = `${url}/user/movies/filter/?filter=${filterChoice}&page=${page}`;
                    break;
                default:
                    formedUrl = `${url}/user/movies/?page=${page}`;
                    break;
            }
            const response = await axios.get(formedUrl, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            if(type === 'default') {
                setMovies(response.data.movies);
            } else if(type === 'search') {
                setMovies(response.data.list);
            } else if(type === 'filter') {
                setMovies(response.data.filteredMovies);
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the movies',
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
            setMovies(defaultMovies);
            setMoviesCount(defaultMoviesCount);
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
        const movieOptions = {
            favorite: status === 'no' ? 'yes' : 'no',
            id
        };
        try {
            await axios.put(`${url}/user/watchlist/favorite`, movieOptions, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            currentPage.current = 1;
            getMovies();
        }
        catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to add the movie to favorites',
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
            setMovies(defaultMovies);
            setMoviesCount(defaultMoviesCount);
            currentPage.current = 1;
            getMovies();
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
                const response = await axios.get(`${url}/user/movies/filter/?filter=${filterValue}&page=1`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('auth')
                    }
                });
                setMovies(response.data.filteredMovies);
                setMoviesCount(response.data.filteredMoviesCount);
            } catch (error) {
                if(error.response.status === 403) {
                    toast({
                        title: 'Please login to get filtered movie(s)',
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
                setMovies(defaultMovies);
                setMoviesCount(defaultMoviesCount);
            }
        }
    }

    const removeFadeOut = ( el, speed ) => {
        const seconds = speed/1000;
        el.style.transition = "opacity "+seconds+"s ease"
        el.style.opacity = 0;

        try {
            if(type === 'filter') {
                setTimeout(async () => {
                    const response = await axios.get(`${url}/user/movies/filter/?filter=${filterChoice}&page=${currentPage.current}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('auth')
                        }
                    });
                    setMovies(response.data.filteredMovies);
                    setMoviesCount(response.data.filteredMoviesCount);
                }, speed);
            } else if(type === 'search') {
                setTimeout(async () => {
                    const response = await axios.get(`${url}/user/movies/search/?searchInp=${formedQuery.current}&page=${currentPage.current}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('auth')
                        }
                    });
                    setMovies(response.data.list);
                    setMoviesCount(parseInt(response.data.countList));
                }, speed);
            } else {
                setTimeout(() => {
                    getMovies();
                    getMoviesCount();
                }, speed);
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the movies',
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
                <div className='movies'>
                    <div className='moviesOptions'>
                        <Input style={{width: '30%'}} disabled={isSelected} type={'search'} value={query} onChange={(e) => setQuery(e.target.value)} onKeyUp={handleUserInput} variant='flushed' placeholder='Search for a movie' />
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
                        defaultMoviesCount === 0 ?
                            <div className="card">
                                <div className="card-body" style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <h5 className="card-title" style={{textAlign: 'center', fontSize: '2.4rem'}}>
                                        <FiXCircle style={{display: 'block', margin: 'auto', marginBottom: '16px'}} />
                                        No Movies Stored
                                    </h5>
                                </div>
                            </div>
                            :
                            <div style={{paddingBottom: '4em'}}>
                                {
                                    moviesCount === 0 ?
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
                                                    movies.map(movie => (
                                                        <Tr key={movie.id} data-movie-id={movie.id}>
                                                            <Td style={{width: '100px'}}>
                                                                <Link to={{
                                                                    pathname: `/details/${movie.info.imdbId}`,
                                                                    query: {
                                                                        type: 'movie'
                                                                    }
                                                                }}>
                                                                    <LazyLoadImage title="More Details" style={{width: '60px'}}  alt={movie.info.title} effect={'blur'} src={movie.info.poster} />
                                                                </Link>
                                                            </Td>
                                                            <Td>{movie.info.title}</Td>
                                                            <Td>{movie.info.year === '' || movie.info.year === undefined ? 'N/A' : movie.info.year}</Td>
                                                            <Td>{movie.info.rating === '' || movie.info.rating === undefined ? 'N/A' : movie.info.rating}</Td>
                                                            <Td>{new Date(movie.created_at).toLocaleDateString('en-GB')}</Td>
                                                            <Td>
                                                            {/* watching || completed || on hold || dropped || plan to watch */}
                                                                <Select placeholder={movie.status} onChange={(e) => handleStatusChange(e, movie.id)}>
                                                                    <option value='watching'>Watching</option>
                                                                    <option value='completed'>Completed</option>
                                                                    <option value='onHold'>On Hold</option>
                                                                    <option value='dropped'>Dropped</option>
                                                                    <option value='planToWatch'>Plan To Watch</option>
                                                                </Select>
                                                            </Td>
                                                            <Td><Note mediaTitle={movie.info.title} mediaId={movie.id} /></Td>
                                                            <Td>
                                                                <IconButton size={'md'} colorScheme={'red'} icon={<FiXCircle/>} onClick={() => handleDeleteMedia(movie.id)} />
                                                                {
                                                                    confirmDeleteMedia ?
                                                                    <Modal isCentered isOpen={isOpen} onClose={onClose}>
                                                                        <ModalContent>
                                                                        <ModalHeader>Modal Title</ModalHeader>
                                                                        <ModalCloseButton />
                                                                        <ModalBody>
                                                                            Are you sure you want to delete this movie?
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
                                                                <IconButton size={'md'} id={'mediaBtn'} icon={<FiStar />} active={movie.favorite} onClick={(e) => handleFavoriteChange(e, movie.id)} />
                                                            </Td>
                                                        </Tr>
                                                    ))
                                                }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                }
                            {
                                moviesCount === 0 ?
                                    <></>
                                    :
                                    <div style={{textAlign: 'center', position: 'fixed', bottom: 0, right: 0, left: 0}}>
                                        <Pagination firstItem={Math.ceil(moviesCount / 10) === 1 ? null : undefined} lastItem={Math.ceil(moviesCount / 10) === 1 ? null : undefined} prevItem={Math.ceil(moviesCount / 10) === 1 ? null : undefined} nextItem={Math.ceil(moviesCount / 10) === 1 ? null : undefined} ellipsisItem={null} defaultActivePage={currentPage.current} totalPages={Math.ceil(moviesCount / 10)} onPageChange={(e) => handlePageChange(e, type)} />
                                    </div>
                            }
                            </div>
                    }
                </div>
    );
}

export default Movies;