// import React from "react";

import axios from "axios";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Login = () => {
  const { setUser } = useContext(UserContext);
  let user;
  const [redirect, setRedirect] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  function formHandler(e) {
    const { name, value } = e.target;
    setForm((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }
  async function submitHandler(e) {
    e.preventDefault();
    try {
      const ans = await axios.post("/login", { form });
      user = ans.data.tuser;
      setUser(user);
      axios
        .post("/login", {
          form,
        })
        .then(() => {
          toast.success("Logged in successfully");

          setRedirect(true);
        })
        .catch((e) => {
          console.log(e);
          toast.error(`Error: ${e.response.data.message}`);
        });
    } catch (e) {
      toast.error(e.response.data.message);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex  items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-2xl mx-auto " onSubmit={submitHandler}>
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            onChange={formHandler}
            value={form.email}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={formHandler}
            value={form.password}
          />
          <button type="submit" className="primary">
            Login
          </button>
          <div className="text-center  py-2 text-gray-500">
            DonT Have an acoount yet?
            <Link to={"/register"}>
              <button className="bg-primary text-white w-100 rounded-xl p-1.5 ml-1 mt-3">
                Register
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
