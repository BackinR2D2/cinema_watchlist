import {Link} from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';
import {Stack} from '@chakra-ui/react';
import AuthContainer from './AuthContainer';

function NavBar () {

    return (
        <>
            <Navbar collapseOnSelect={true} expand="lg" bg="dark" variant="dark">
                <Navbar.Brand style={{fontSize: '20px', padding: '12px', fontWeight: 100}}>
                    <Link to="/">Cinema Watchlist</Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" style={{fontSize: '16px', fontWeight: 400, padding: '12px'}}>
                        <Stack direction='row' spacing={6} align='center'>
                            <Link to='/top-movies'>Top Rated Movies</Link>
                            <Link to='/top-tvshows'>Top Rated TV Shows</Link>
                            <Link to='/account'>Account</Link>
                        </Stack>    
                    </Nav>
                    <AuthContainer />
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}

export default NavBar;