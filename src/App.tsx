import { createContext, useEffect, useState } from 'react'
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
// import ProtectedRoute from './components/protected-route'
import Notice from './routes/notice'
import Write from './routes/write'
import Content from './routes/content'
import Check from './components/check'
import Make from './components/make'
import Manage from './components/manage'
import { onAuthStateChanged, User } from 'firebase/auth'

const router = createBrowserRouter([
  {
    path:"/",
    // element: (<ProtectedRoute>
    //   <Layout />
    // </ProtectedRoute>),
    element: <Layout />,
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

interface AuthContextType {
  user: User | null;
}


export const myContext = createContext<AuthContextType>({user: null});

function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [])

  const init = async() => {
    // wait for firebase
    await auth.authStateReady();

    setIsLoading(false);
  }
  useEffect (() => {
    init();
  }, [])
  return (
    <myContext.Provider value={{user}}>
    <Wrapper>
    <GlobalStyles />
    {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
    </myContext.Provider>
  )
}

export default App
