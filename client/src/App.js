import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import "./App.css"

const HomePage = lazy(() => import('./components/HomePage'));
const VideoPlay = lazy(() => import('./components/VideoPlay'));
const SignIn = lazy(() => import('./components/SignIn'));
const SignUp = lazy(() => import('./components/SignUp'));
// const Search = lazy(() => import('./components/Search'));
// const Playlist = lazy(() => import('./components/PlaylistSTRC'));
const WatchHistory = lazy(() => import('./components/WatchHistory'));
const YouTubeChannel = lazy(() => import('./components/ChannelPage'));
const AllPlaylists = lazy(() => import('./components/AllPlaylists'));

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
            { path: "/watch/:VideoId/:playlistId/:index", element: <VideoPlay /> },
            { path: "/v3/Signin", element: <SignIn /> },
            { path: "/v3/Signup", element: <SignUp /> },
          ].map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ErrorBoundary>
                    {element}
                  </ErrorBoundary>
                </Suspense>
              }
            />
          ))}
        </Routes>
      </Router>
    </>
  );
}

export default App;
