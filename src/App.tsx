import { useEffect, useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/layout'
import Home from './routes/home'
// import Profile from './routes/profile'
import Login from './routes/login'
import CreateAccount from './routes/create-account'
import styled, { createGlobalStyle } from 'styled-components'
import reset from 'styled-reset'
import LoadingScreen from './components/loading-screen'
import { auth } from './firebase'
import ProtectedRoute from './components/protected-route'
import Notice from './routes/notice'
import Write from './routes/write'
import Content from './routes/content'
import Check from './components/check'
import Make from './components/make'
import Manage from './components/manage'

const router = createBrowserRouter([
  {
    path:"/",
    element: (<ProtectedRoute>
      <Layout />
    </ProtectedRoute>),
    children: [
      {
        path:"",
        element: <Home />,
      },
      {
        path:"profile",
        element: null,
      },
      {
        path:"notice",
        element:<Notice />,
        children: [

        ]
      },
      {
        path:"write",
        element:<Write />,
        children: [ 

        ]
      },
      {
        path:"check",
        element:<Check />,
        children: [

        ]
      },
      {
        path:"make",
        element:<Make />,
        children: [

        ]
      },
      {
        path:"manage",
        element:<Manage />,
        children: [

        ]
      },
      {
        path:"/content/:contentId",
        element: <Content />,
    
      }
    ]
  },
  {
    path:"/login",
    element:<Login />
  },
  {
    path: "/create-account",
    element:<CreateAccount />
  },
])

const GlobalStyles = createGlobalStyle `
  ${reset};
  * {
    box-sizing: border-box;
  }
  body{
    background-color: #BFB5D7;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 
    'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 
    'Helvetica Neue', sans-serif;
  }
`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async() => {
    // wait for firebase
    await auth.authStateReady();

    setIsLoading(false);
  }
  useEffect (() => {
    init();
  }, [])
  return (
    <Wrapper>
    <GlobalStyles />
    {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  )
}

export default App
