import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";

import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

// Login and Signup Logic both..
const Login = () => {
  const [state, setState] = useState("Login");

  const { setShowLogin, backendUrl, setToken, setUser } =
    useContext(AppContext); // for Login page..

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem("token", data.token);
           toast.success("🎉 Logged in successfully!",{closeOnClick:true});
            setShowLogin(false);

        } else {
          toast.error(data.message);
        }
      } else {
        const { data } =await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
    
        if(data.success){
          setToken(data.token)
          setUser(data.user)
          localStorage.setItem('token',data.token)
           toast.success("✅ Account created successfully!",{closeOnClick:true});
            setShowLogin(false);
        }else{
           toast.error(data.message)
        }
      }
    } catch (error) {
       toast.error(error.message)
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed flex justify-center items-center bg-black/30 backdrop-blur-sm  top-0 bottom-0 left-0 right-0 z-10">
      <motion.form
        onSubmit={onSubmitHandler}
        initial={{ opacity: 0.2, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative bg-white border border-violet-600 rounded-xl p-10 text-slate-500"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium ">
          {state}
        </h1>

        {state === "Login" ? (
          <p className="text-sm mt-2">
            Welcome back! Please log in to continue...
          </p>
        ) : (
          <p className="text-sm mt-2 px-10">
            {" "}
            Create an account to continue...
          </p>
        )}

        {state !== "Login" && (
          <div className=" border flex items-center px-6 py-3 mt-5 gap-2 rounded-full ">
            <img width={30} src={assets.profile_icon} alt="" />
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              className="outline-none text-sm"
              placeholder="Full name"
              required
            ></input>
          </div>
        )}
        <div className=" border flex items-center px-6 py-4 mt-5 gap-2 rounded-full ">
          <img width={20} src={assets.email_icon} alt="" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            className="outline-none text-sm"
            placeholder="EmailId"
            required
          ></input>
        </div>

        <div className=" border flex items-center px-6 py-4 mt-5 gap-2 rounded-full ">
          <img width={15} src={assets.lock_icon} alt="" />
          <input
            type="password"
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            className="outline-none text-sm"
            placeholder="Password"
            required
          ></input>
        </div>

        {state === "Login" ? (
          <p className="text-sm text-blue-600 my-4 px-2 hover:underline cursor-pointer">
            Forget Password?
          </p>
        ) : (
          ""
        )}

        <button className="bg-blue-600 w-full text-white py-3 rounded-full mt-4">
          {state === "Login" ? "Login" : "Create account"}
        </button>

        {state === "Login" ? (
          <p className="text-center mt-2">
            Don't have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => setState("Signup")}
            >
              Signup
            </span>
          </p>
        ) : (
          <p className="text-center mt-2">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => setState("Login")}
            >
              Login
            </span>
          </p>
        )}
        <img
          onClick={() => setShowLogin(false)}
          src={assets.cross_icon}
          alt=""
          className="absolute top-5 right-5 cursor-pointer"
        />
      </motion.form>
    </div>
  );
};

export default Login;
