import { Route, Routes } from "react-router-dom";
import "./App.css";
// import Header from "./components/Header";
import IndexPage from "./pages/IndexPage";
import Login from "./pages/Login";
import Layout from "./Layout";
import Register from "./pages/Register";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Account from "./pages/Account";
axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />} />
            <Route path="/account/:subpage?" element={<Account />} />
            <Route path="/account/:subpage/:action?" element={<Account />} />
          </Route>
        </Routes>
      </>
    </UserContextProvider>
  );
}

export default App;
