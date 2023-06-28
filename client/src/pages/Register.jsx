import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
const Register = () => {
  const [form, setForm] = useState({
    name: "",
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
    console.log(form);
    try {
      await axios.post("/register", {
        form,
      });
      toast.success("Registration Completed");
    } catch (err) {
      toast.error("User already registered");
    }
  }
  return (
    <div className="mt-4 grow flex  items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-2xl mx-auto " onSubmit={submitHandler}>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={formHandler}
            placeholder="John doe"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={formHandler}
            placeholder="your@email.com"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={formHandler}
            placeholder="password"
          />
          <button type="submit" className="primary">
            Register
          </button>
          <div className="text-center  py-2 text-gray-500">
            Already have an account?
            <Link to={"/login"}>
              <button className="bg-primary text-white w-100 rounded-xl p-1.5 ml-1 mt-3">
                Login
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
