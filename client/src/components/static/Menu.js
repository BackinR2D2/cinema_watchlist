import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import url from '../../helpers/url';
import {BiPlus} from 'react-icons/bi';
import { useToast } from '@chakra-ui/react';

function Menu ({showDetails, mediaInfo, id}) {

    const omdb_API_KEY = process.env.REACT_APP_API_KEY;
    const navigate = useNavigate();
    const toast = useToast();

    const handleAddToWatchlist = async () => {
        let type = '';
        let data = {};
        try {
            const URL = `https://www.omdbapi.com/?i=${id}&apikey=${omdb_API_KEY}`;
            const mediaData = await axios.get(URL);

            if(mediaData.data.Response === 'False' && mediaInfo !== undefined) {
                let poster;
                if(mediaInfo.i === undefined) {
                    poster = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png';
                } else {
                    poster = mediaInfo.i.imageUrl;
                }
                data = {
                    imdbId: mediaInfo.id,
                    poster,
                    rating: '',
                    title: mediaInfo.l,
                    year: mediaInfo.yr
                };
                type = mediaInfo.q === 'TV series' ? 'tvshow' : 'movie';
            } else {
                const poster = mediaData.data.Poster === undefined ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Question_Mark.svg/2560px-Question_Mark.svg.png' : mediaData.data.Poster;
                data = {
                    imdbId: mediaData.data.imdbID,
                    poster: poster,
                    rating: mediaData.data.imdbRating,
                    title: mediaData.data.Title,
                    year: mediaData.data.Year,
                };
                type = mediaData.data.Type === 'series' ? 'tvshow' : 'movie';    
            } 

            const info = [data, type];
            await axios.post(`${url}/watchlist`, {info, status: 'Plan To Watch'} , {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            toast({
                title: `${type === 'tvshow' ? 'TV Show' : 'Movie'} added to watchlist`,
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            if(error.response.status === 400) {
                toast({
                    title: `${type === 'tvshow' ? 'TV Show' : 'Movie'} already in watchlist`,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            } else if(error.response.status === 403) {
                toast({
                    title: `Please login to add to watchlist.`,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
                localStorage.removeItem('auth');
                navigate('/login');
            } else {
                toast({
                    title: `Some error occured, try again later.`,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
    }

    return (
        <div>
            <Button leftIcon={<BiPlus/>} variant='outline' style={{width: '100%', borderRadius: '18px'}} colorScheme='gray' onClick={handleAddToWatchlist}>Add to watchlist</Button>
        </div>
    );
}

export default Menu;