import { useEffect, useState } from "react";
import { Box, useToast } from '@chakra-ui/react'
import axios from 'axios';
import Menu from './static/Menu';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Loader from "./static/Loader";
import {FiXCircle} from 'react-icons/fi';
import img from './static/images/qm.png';

function Details (props) {

    const omdb_API_KEY = process.env.REACT_APP_API_KEY;
    const id = window.location.pathname.split("/")[2];

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [imageLoad, setImageLoad] = useState(true);
    const toast = useToast();

    const fetchDetails = async (id) => {
        try {
            const url = `https://www.omdbapi.com/?i=${id}&apikey=${omdb_API_KEY}`;
            const response = await axios.get(url);
            setData(response.data);
            setLoading(false);
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

    useEffect(() => {
        fetchDetails(id);
    }, []);

    const getRatingColor = (rating) => {
        if (rating >= 80) {
            return 'green';
        } else if (rating >= 70) {
            return 'yellow';
        } else if (rating >= 50) {
            return 'orange';
        } else {
            return 'red'
        }
    };

    const replaceExt = (url) => {
        const urlSplit = url && url.split('V1');
        if(urlSplit) return `${urlSplit[0]}V1_SX900.jpg`;
        return null;
    }

    return (
        loading ?
            <Loader /> 
            :
            <div>
                {
                    data.Response === 'False' ?
                        <div className="card" style={{marginTop: '24vh'}}>
                                <div className="card-body" style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <h5 className="card-title" style={{textAlign: 'center', fontSize: '2.4rem'}}>
                                        <FiXCircle style={{display: 'block', margin: 'auto', marginBottom: '16px'}} />
                                        Data not available
                                    </h5>
                                </div>
                        </div>
                    :
                    <div className="detailsContainer">
                        <Box>
                            <LazyLoadImage afterLoad={() => setImageLoad(false)} alt={data.Title} style={{cursor: 'default', width: '320px'}} effect={'blur'} src={data.Poster === 'N/A' ? img : replaceExt(data.Poster)} />
                        </Box>
                        {
                            imageLoad ?
                                <Loader />
                                :
                                <Box className="details">
                                    <h2 className="detailsTitle">
                                        {data.Title}
                                        <span className="detailsYear">{`(${data.Year})`}</span>
                                        <span className="detailsRating" style={{backgroundColor: getRatingColor(parseInt(data.imdbRating) * 10)}}>
                                            {data.imdbRating}
                                        </span>
                                    </h2>
                                        <p className="detailsGenre">
                                            {data.Genre}
                                            <span className="detailsRunTime">
                                                {data.Runtime}    
                                            </span>
                                            <span className="detailsRated">
                                                {data.Rated}    
                                            </span>    
                                        </p>
                                        <p className="detailsType">
                                            {
                                                data.Type === 'movie' ?
                                                    'Movie'
                                                    :
                                                    'Tv Series'
                                            }
                                        </p>
                                        <p className="detailsLanguage">{data.Language}</p>
                                        <p className="detailsCountry">{data.Country}</p>
                                        <p className="detailsDirector">Director: {data.Director}</p>
                                        <p className="detailsWriter">Writer: {data.Writer}</p>
                                        <p className="detailsActors">Actors: {data.Actors}</p>
                                        <p className="detailsPlot">{data.Plot}</p>
                                        <p className="detailsAwards">{data.Awards}</p>
                                        <div className="detailsAdd">
                                            <Menu showDetails={true} id={id} />
                                        </div>
                                </Box>
                        }    
                    </div>
                }
            </div>
    );
}

export default Details;