import React from "react";
import WebLayout from "./layouts/WebLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Vault from "./components/Vault";
import { createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <WebLayout />,
      children: [
        {
          path:'/',
          element:<Vault/>
        }
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,  
    }
  ]
)

function App() {
  return <RouterProvider router = {router} />
}

export default App;
