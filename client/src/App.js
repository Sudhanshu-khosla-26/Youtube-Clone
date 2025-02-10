import './App.css';
import HomePage from './components/HomePage';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import Navbar from './components/Navbar';
import VideoPlay from './components/VideoPlay';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
// import Search from './components/Search';
// import Playlist from './components/PlaylistSTRC';
import WatchHistory from './components/WatchHistory';
import YouTubeChannel from './components/ChannelPage';
import AllPlaylists from './components/AllPlaylists';
import ErrorBoundary from './components/ErrorBoundary';
// import { useEffect } from 'react';
// import AuthService from './services/auth.service';
// import api from './services/api.service';


function App() {

  // const user = JSON.parse(localStorage.getItem('USER'));

  // const validateToken = async () => {
  //   if (!user) {
  //     return;
  //   }
  //   if (AuthService.isTokenExpired(user.accessToken)) {
  //     try {
  //       // Try to refresh the token
  //       const response = await api.post('/users/refresh-token', {
  //         refreshToken: user.refreshToken
  //       });
  //       const { accessToken, refreshToken } = response.data.data;
  //       AuthService.updateTokens(accessToken, refreshToken);
  //       // setUser(AuthService.getUser());
  //     } catch (error) {
  //       // If refresh fails, log out
  //       AuthService.removeUser();
  //       // setUser(null);
  //     }
  //   }
  // }
  
  // useEffect(() => {
  //   validateToken();
  //   const interval = setInterval(() => {
  //     validateToken();
  //   }, 10000);
  //   return () => clearInterval(interval);
  // }, []);
  
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          {[
            { path: "/", element: <HomePage /> },
            { path: "/playlist/list/:listquery", element: <HomePage /> },
            { path: "/search/:query", element: <HomePage /> },
            { path: "/feed/playlists", element: <AllPlaylists /> },
            { path: "/:username", element: <YouTubeChannel /> },
            { path: "feed/history", element: <WatchHistory /> },
            { path: "/watch/:VideoId", element: <VideoPlay /> },
            { path: "/watch/:VideoId/:playlistId/:index", element: <VideoPlay /> },
            { path: "/v3/Signin", element: <SignIn /> },
            { path: "/v3/Signup", element: <SignUp /> },
          ].map(({ path, element }) => (
            <Route key={path} path={path} element={<ErrorBoundary>{element}</ErrorBoundary>} />
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;
