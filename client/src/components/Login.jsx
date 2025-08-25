'use client'
import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Login() {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "login") {
        // normal login flow
        const { data } = await axios.post(`/api/user/login`, { email, password });

        if (data.success) {
          navigate('/');
          setToken(data.token);
          localStorage.setItem('token', data.token);
          setShowLogin(false);
          toast.success(data.message || 'Login Success !!');
        } else {
          toast.error(data.message);
        }

      } else if (state === "register") {
        // subscription mail flow
        const { data } = await axios.post(`/api/user/login`, { email, password , name});
        if (data.success) {
          const res = await axios.post(`/api/mail/send`, { email });


          toast.success("🎉 Subscription successful! Check your inbox.");
          setEmail("");
          setName("");
          setPassword("");
          setState("login"); // switch back to login after success
        } else {
          toast.error("❌ Failed to subscribe. Try again.");
        }
      }
    } catch (error) {
      toast.error(error.message || "⚠️ Something went wrong.");
      console.error(error);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className='fixed bottom-0 top-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="email"
            required
          />
        </div>

        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
            type="password"
            required={state === "login"} // password not required in newsletter
          // disabled={state === "register"} // disable password field for register/newsletter
          />
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-primary cursor-pointer"
            >
              click here
            </span>
          </p>
        )}

        <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Subscribe" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
