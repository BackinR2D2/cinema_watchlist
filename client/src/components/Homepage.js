import { useRef, useState } from "react";
import axios from 'axios';
import url from "../helpers/url";
import { Input, SimpleGrid } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import Menu from './static/Menu';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import img from './static/images/qm.png';
import Loader from './static/Loader';
import {FiXCircle} from 'react-icons/fi';
// https://v2.sg.media-imdb.com/suggestion/{userInput[0]}/{userInput}.json

function Homepage () {

    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState('');
    const [searched, setSearched] = useState(false);
    const [initial, setInitial] = useState(false);
    let typingTimer = useRef(null);

    const getData = async (res) => {
        try {
            const response = await axios.post(`${url}/search`, {res});
            setResults(response.data.results || []);
            setSearched(false);
            setInitial(true);
        } catch (error) {
            setResults([]);
        }
    }

    const handleUserInput = async (e) => {
        clearTimeout(typingTimer.current);
        if(e.target.value !== '') {
            typingTimer.current = setTimeout(async () => {
                let res = (e.target.value).toLowerCase().trim();
                setSearched(true);
                await getData(res);
            }, 500);
        } else {
            setResults([]);
            setSearched(false);
            setInitial(false);
        }
    }

    return (
        <>
            <div className='hpInp'>
                <Input size='lg' style={{width: '50%'}} type={'search'} value={query} onChange={(e) => setQuery(e.target.value)} onKeyUp={handleUserInput} variant='flushed' placeholder='Search for a movie or a tv show' />
            </div>
                {
                    searched ?
                        <Loader />
                    :
                        initial && results.length === 0 ?
                            <div className="card">
                                <div className="card-body" style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <h5 className="card-title" style={{textAlign: 'center', fontSize: '2.4rem'}}>
                                        <FiXCircle style={{display: 'block', margin: 'auto', marginBottom: '16px'}} />
                                        No results found
                                    </h5>
                                </div>
                            </div>
                        :
                            <div className="seachContainer">
                                <SimpleGrid minChildWidth='280px' spacing='40px' style={{justifyItems: 'center'}}>
                                    {
                                        results && results.map((el, i) => (
                                            <div style={{position: 'relative'}} className="mediaCard" key={i} data-id={el.id}>
                                                <LazyLoadImage title="More Details" onClick={() => navigate(`/details/${el.id}`)} style={{height: '40vh', objectFit: 'cover', borderRadius: '24px', width: '100%'}} alt={el.l} effect={'blur'} src={el.i === undefined ? img : el.i.imageUrl} />
                                                <div className="mediaCardInfo">
                                                    <h2 className="mediaTitle">{el.l}</h2>
                                                    <p className="mediaYear">{el.y}</p>
                                                    <Menu mediaInfo={el} id={el.id} />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </SimpleGrid>
                            </div>
                }
        </>
    );
}

export default Homepage;