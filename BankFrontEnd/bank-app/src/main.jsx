import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Pages/Home/Home'
import "./utils/i18n/i18n"
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from './Pages/Login/Login'
import AuthHeader from "./Components/AuthHeader/AuthHeader"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    element: <AuthHeader/>,
    children : [
      {
        path : "/login", element: <Login/>
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
