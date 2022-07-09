import axios from 'axios';
import {useState, useEffect} from 'react';
import url from '../helpers/url';
import CinemaElement from './static/CinemaElement';
import { Input, useToast } from '@chakra-ui/react';
import Loader from './static/Loader';
import {useNavigate} from 'react-router-dom';

function TopMovies () {

    const toast = useToast();
    const [topMovies, setTopMovies] = useState([]);
    const [copiedTopMovies, setCopiedTopMovies] = useState([]);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('topMovies')) {
            setTopMovies(JSON.parse(localStorage.getItem('topMovies')));
            copiedTopMovies.current = JSON.parse(localStorage.getItem('topMovies'));
            setLoading(false);
        } else {
            let active = true;
            load();
            return () => {active = false}

            async function load () {
                try {
                    const res = await axios.get(`${url}/top-movies`);
                    if(!active) {return}
                    setTopMovies(res.data.data);
                    setLoading(false);
                    setCopiedTopMovies(res.data.data);
                    localStorage.setItem('topMovies', JSON.stringify(res.data.data));   
                } catch (error) {
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
    }, []);

    const handleSearch = (e) => {
        const searchInput = e.target.value;
        if(searchInput.length === 0) {
            setTopMovies(copiedTopMovies);
            setSearch(false);
        } else {
            const searchedMovies = copiedTopMovies.map(movie => {
                const movieConfigured = (movie.title).toLowerCase().trim();
                if(movieConfigured.indexOf(searchInput) !== -1 || movie.imdbId.indexOf(searchInput) !== -1) {
                    return movie;
                }
            }).filter(movie => movie !== undefined);
            setTopMovies(searchedMovies);
            setSearch(true);
        }
    }

    const handlePageChange = (id) => {
        navigate(`/details/${id}`);
    }

    return (
        <div>
            <div className='header'>
                <h1>Top Rated Movies</h1>
            </div>
            {
                loading ?
                    <Loader />
                    :
                    <div>
                        <div className='searchInp'>
                            <Input size='lg' style={{width: '50%'}} type={'search'} onChange={handleSearch} variant='outline' placeholder='Search for a Movie' />
                        </div>
                        <CinemaElement handlePageChange={handlePageChange} search={search} cinemaElement={topMovies} cinemaElementType={'movie'} />
                    </div>
            }
        </div>
    );
}

export default TopMovies;