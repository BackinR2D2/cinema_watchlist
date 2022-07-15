import React from 'react';
import Menu from './Menu';
import { SimpleGrid } from '@chakra-ui/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import {FiXCircle} from 'react-icons/fi';

class CinemaElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            postsPerPage: 10,
            upperPageBound: 3,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            pageBound: 3,
        };
        this.handleClick = this.handleClick.bind(this);
        this.btnDecrementClick = this.btnDecrementClick.bind(this);
        this.btnIncrementClick = this.btnIncrementClick.bind(this);
        this.btnNextClick = this.btnNextClick.bind(this);
        this.btnPrevClick = this.btnPrevClick.bind(this);
        this.setPrevAndNextBtnClass = this.setPrevAndNextBtnClass.bind(this);
    }


    handleStateReset() {
        this.setState({
            currentPage: 1,
            postsPerPage: 10,
            upperPageBound: 3,
            lowerPageBound: 0,
            isPrevBtnActive: 'disabled',
            isNextBtnActive: '',
            pageBound: 3,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.search !== this.props.search){
            this.handleStateReset();
        }
    }

    handleClick(event) {
        let listid = Number(event.target.id);
        this.setState({
            currentPage: listid
        });
        this.setPrevAndNextBtnClass(listid);
    }

    setPrevAndNextBtnClass(listid) {
        let totalPage = Math.ceil(this.props.cinemaElement && this.props.cinemaElement.length / this.state.postsPerPage);
        this.setState({ isNextBtnActive: 'disabled' });
        this.setState({ isPrevBtnActive: 'disabled' });
        if (totalPage === listid && totalPage > 1) {
            this.setState({ isPrevBtnActive: '' });
        }
        else if (listid === 1 && totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
        }
        else if (totalPage > 1) {
            this.setState({ isNextBtnActive: '' });
            this.setState({ isPrevBtnActive: '' });
        }
    }
    btnIncrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        let listid = this.state.upperPageBound + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnDecrementClick() {
        this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
        this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        let listid = this.state.upperPageBound - this.state.pageBound;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnPrevClick() {
        if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
            this.setState({ upperPageBound: this.state.upperPageBound - this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound - this.state.pageBound });
        }
        let listid = this.state.currentPage - 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    btnNextClick() {
        if ((this.state.currentPage + 1) > this.state.upperPageBound) {
            this.setState({ upperPageBound: this.state.upperPageBound + this.state.pageBound });
            this.setState({ lowerPageBound: this.state.lowerPageBound + this.state.pageBound });
        }
        let listid = this.state.currentPage + 1;
        this.setState({ currentPage: listid });
        this.setPrevAndNextBtnClass(listid);
    }
    render() {
        const { currentPage, postsPerPage, upperPageBound, lowerPageBound, isPrevBtnActive, isNextBtnActive } = this.state;
        const indexOfLastTodo = currentPage * postsPerPage;
        const indexOfFirstTodo = indexOfLastTodo - postsPerPage;
        const currentCinemaElements = this.props.cinemaElement && this.props.cinemaElement.slice(indexOfFirstTodo, indexOfLastTodo);

        const replaceExt = (url) => {
            const urlSplit = url.split('V1');
            return `${urlSplit[0]}V1_SX900.jpg`;
        }

        // > 90% = green.
        // 89–80% = yellow/green.
        // 79–70% = yellow.
        // 69–60% = orange.
        // 59–50% = red.

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

        const renderCinemaElements = currentCinemaElements && currentCinemaElements.map((cinemaEl, index) => {
            return (
                <div style={{position: 'relative'}} className="mediaCard" key={index} data-id={cinemaEl.imdbId} >
                    <LazyLoadImage onClick={() => this.props.handlePageChange(cinemaEl.imdbId)} title="More Details" style={{objectFit: 'cover', borderRadius: '24px', width: '100%'}} alt={cinemaEl.title} effect={'blur'} src={replaceExt(cinemaEl.poster)} />
                    <div className="mediaCardInfo">
                        <h2 className="mediaTitle">{cinemaEl.title}</h2>
                        <p className="mediaYear">
                            <span className="mediaRating" style={{backgroundColor: getRatingColor(parseInt(cinemaEl.rating) * 10)}}>
                                {cinemaEl.rating}
                            </span>
                            {cinemaEl.year}
                         </p>
                        <Menu id={cinemaEl.imdbId} />
                    </div>
                </div>
            )
        });

        const pageNumbers = [];

        for (let i = 1; i <= Math.ceil(this.props.cinemaElement && this.props.cinemaElement.length / postsPerPage); i++) {
            pageNumbers.push(i);
        }

        const renderPageNumbers = pageNumbers && pageNumbers.map(number => {
            if (number === 1 && currentPage === 1) {
                return (
                    <li key={number} className='active' id={number}><button className="btn btn-dark" id={number} onClick={this.handleClick}>{number}</button></li>
                )
            }
            else if ((number < upperPageBound + 1) && number > lowerPageBound) {
                return (
                    <li key={number} id={number}><button className="btn btn-dark" id={number} onClick={this.handleClick}>{number}</button></li>
                )
            }
            return null;
        });

        let pageIncrementBtn = null;
        if (pageNumbers.length > upperPageBound) {
            pageIncrementBtn = <li className=''><button className="btn btn-primary" onClick={this.btnIncrementClick}> &hellip; </button></li>
        }
        let pageDecrementBtn = null;
        if (lowerPageBound >= 1) {
            pageDecrementBtn = <li className=''><button className="btn btn-primary" onClick={this.btnDecrementClick}> &hellip; </button></li>
        }
        let renderPrevBtn = null;
        if (isPrevBtnActive === 'disabled') {
            renderPrevBtn = <li className={isPrevBtnActive}><button className="btn btn-primary" id="btnPrev"> Prev </button></li>
        }
        else {
            renderPrevBtn = <li className={isPrevBtnActive}><button className="btn btn-primary" id="btnPrev" onClick={this.btnPrevClick}> Prev </button></li>
        }
        let renderNextBtn = null;
        if (isNextBtnActive === 'disabled') {
            renderNextBtn = <li className={isNextBtnActive}><button className="btn btn-primary" id="btnNext"> Next </button></li>
        }
        else {
            renderNextBtn = <li className={isNextBtnActive}><button className="btn btn-primary" id="btnNext" onClick={this.btnNextClick}> Next </button></li>
        }

        return (
            <div>
                <ul className="padding0">
                    {
                        renderCinemaElements && renderCinemaElements.length !== 0 ?
                            <SimpleGrid minChildWidth='280px' spacing='40px' style={{padding: '2em 1em 4em 1em', justifyItems: 'center'}}>
                                {renderCinemaElements}
                            </SimpleGrid>
                            :
                            <div className="card">
                                <div className="card-body" style={{height: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <h5 className="card-title" style={{textAlign: 'center', fontSize: '2.4rem'}}>
                                        <FiXCircle style={{display: 'block', margin: 'auto', marginBottom: '16px'}} />
                                        No results found
                                    </h5>
                                </div>
                            </div>
                    }
                </ul>
                {
                    this.props.cinemaElement && this.props.cinemaElement.length <= 10 ?
                        <ul id="page-numbers" className="pagination">
                            {renderPageNumbers}
                        </ul>
                        :
                        <ul id="page-numbers" className="pagination">
                            {renderPrevBtn}
                            {pageDecrementBtn}
                            {renderPageNumbers}
                            {pageIncrementBtn}
                            {renderNextBtn}
                        </ul>
                }
            </div>
        );
    }
}

export default CinemaElement;