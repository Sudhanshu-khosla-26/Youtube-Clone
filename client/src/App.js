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
import Search from './components/Search';
import Playlist from './components/Playlist';
import WatchHistory from './components/WatchHistory';
import YouTubeChannel from './components/ChannelPage';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/playlist/list/:listquery" element={<HomePage />} />
          <Route path="/search/:query" element={<HomePage />} />
          <Route path="/:username" element={<YouTubeChannel />} />
          <Route path="feed/history" element={<WatchHistory />} />
          <Route path="/watch/:VideoId" element={<VideoPlay />} />
          <Route path="/v3/Signin" element={<SignIn />} />
          <Route path="/v3/Signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
