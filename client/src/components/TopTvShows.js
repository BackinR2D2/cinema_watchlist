import axios from 'axios';
import {useState, useEffect, useRef} from 'react';
import url from '../helpers/url';
import CinemaElement from './static/CinemaElement';
import { Input, useToast } from '@chakra-ui/react';
import Loader from './static/Loader';
import {useNavigate} from 'react-router-dom';

function TopTvShows () {

    const toast = useToast();
    const [topTvShows, setTopTvShows] = useState([]);
    const [copiedTopTvShows, setCopiedTopTvShows] = useState([]);
    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('topTvShows')) {
            setTopTvShows(JSON.parse(localStorage.getItem('topTvShows')));
            copiedTopTvShows.current = JSON.parse(localStorage.getItem('topTvShows'));
            setLoading(false);
        } else {
            let active = true;
            load();
            return () => {active = false}

            async function load () {
                try {
                    const res = await axios.get(`${url}/top-tvshows`);
                    if(!active) {return}
                    console.log(res.data.data);
                    setTopTvShows(res.data.data);
                    setLoading(false);
                    setCopiedTopTvShows(res.data.data);
                    localStorage.setItem('topTvShows', JSON.stringify(res.data.data));   
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
            setTopTvShows(copiedTopTvShows);
            setSearch(false);
        } else {
            const searchedTvShows = copiedTopTvShows.map(tvshow => {
                const tvShowConfigured = (tvshow.title).toLowerCase().trim();
                if(tvShowConfigured.indexOf(searchInput) !== -1 || tvshow.imdbId.indexOf(searchInput) !== -1) {
                    return tvshow;
                }
            }).filter(tvshow => tvshow !== undefined);
            setTopTvShows(searchedTvShows);
            setSearch(true);
        }
    }

    const handlePageChange = (id) => {
        navigate(`/details/${id}`);
    }

    return (
        <div>
            <div className='header'>
                <h1>Top Rated TV Shows</h1>
            </div>
            {
                loading ?
                    <Loader />
                    :
                    <div>
                        <div className='searchInp'>
                            <Input size='lg' style={{width: '50%'}} type={'search'} onChange={handleSearch} variant='outline' placeholder='Search for a TV Show' />
                        </div>
                        <CinemaElement handlePageChange={handlePageChange} search={search} cinemaElement={topTvShows} cinemaElementType={'tvshow'} />
                    </div>
            }
        </div>
    );
}

export default TopTvShows;