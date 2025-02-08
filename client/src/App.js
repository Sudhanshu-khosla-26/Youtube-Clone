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

function App() {
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
