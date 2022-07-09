import NavBar from './components/static/NavBar';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ProtectedRoute from './components/static/ProtectedRoute';
import Account from './components/Account';
import Homepage from './components/Homepage';
import TopMovies from './components/TopMovies';
import TopTvShows from './components/TopTvShows';
import Login from './components/Login';
import Register from './components/Register';
import Details from './components/Details';
import 'react-lazy-load-image-component/src/effects/blur.css';

function App() {

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route exact path='/' element={<ProtectedRoute/>}>
            <Route exact path='/' element={<Homepage/>}/>
          </Route>
          <Route exact path='/account' element={<ProtectedRoute/>}>
            <Route exact path='/account' element={<Account/>}/>
          </Route>
          <Route exact path='/top-movies' element={<ProtectedRoute/>}>
            <Route exact path='/top-movies' element={<TopMovies/>}/>
          </Route>
          <Route exact path='/top-tvshows' element={<ProtectedRoute/>}>
            <Route exact path='/top-tvshows' element={<TopTvShows/>}/>
          </Route>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/register' element={<Register />} />
          <Route path='/details/:id' element={<Details />} />
        </Routes>
      </Router>
    </>
  );
}


export default App;
