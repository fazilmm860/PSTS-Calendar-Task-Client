import Header from "./components/LoginPage/Header";
import Login from "./components/LoginPage/Login";
import Register from "./components/LoginPage/Register";
import Dashboard from "./components/LoginPage/Dashboard";
import Error from "./components/LoginPage/Error";
import PasswordReset from "./components/LoginPage/PasswordReset";
import ForgotPassword from "./components/LoginPage/ForgotPassword";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect, useContext, useState } from "react";
import { LoginContext } from "./components/LoginPage/ContextProvider/Context";
import { ThemeProvider } from '@mui/material/styles';
import Schedule from "./components/Calender/Schedule";




function App() {

  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);


  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("http://localhost:4001/api/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      console.log("user not valid");
    } else {
      console.log("user verify");
      setLoginData(data)
      history("/dash");
    }
  }

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true)
    }, 2000)

  }, [])

  return (
    <>
      {
        data ? (
          <>
          
           <Header />

            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dash" element={<Dashboard />} />
               <Route path="/password-reset" element={<PasswordReset />} />
               <Route path="/forgotpassword/:id/:token" element={<ForgotPassword />} />
               <Route path="/schedule" element={<Schedule/>}/>
              <Route path="*" element={<Error />} />
            </Routes>
           
           
          </>

        ) : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      }


    </>
  );
}

export default App;
