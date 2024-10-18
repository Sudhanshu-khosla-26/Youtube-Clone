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

function App() {
  return (
    <>
      <Router>
        <Navbar/>
         <Routes>
           <Route path="/" element={<HomePage/>} />
           <Route path="/watch/:VideoId" element={<VideoPlay />} />
           <Route path="/v3/Signin" element={<SignIn />} />
           <Route path="/v3/Signup" element={<SignUp />} />
         </Routes>
      </Router>
    </>
  );
}

export default App;
