import React, { useState } from 'react'
import Loader from './Loader';
import FileUpload from './FileInput';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import { Link } from 'react-router-dom';


const Signup = () => {
  const [isloading, setisloading] = useState(false);
  const [formdetails, setFormdetails] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
  });

  const [img, setImg] = useState(null);
  const navigate = useNavigate();


  async function uploadDetails(e) {
    e.preventDefault();
    if(formdetails.profilePic === ""){
      toast.error("Pls upload a profile picture!", {
        position: "bottom-right"
      });
      return
    }
    console.log(formdetails);
    if (formdetails.password !== formdetails.confirmPassword) {
      console.log("not ame")
      toast.error("Passwords do not match!", {
        position: "bottom-right"
      });
    }
    try{
      const details = await axios.post("http://localhost:3000/app/user/signup", formdetails);
      if(details.status === 200){
        toast.success("Account created successfully!", {
          position: "bottom-right"
        })
        console.log("details", details);
        
            localStorage.setItem("ccuid", details.data.uid);
            localStorage.setItem("ccusername", details.data.username);
            localStorage.setItem("ccavatar", details.data.profilePic);
            localStorage.setItem("ccpid", details.data.pid);
    

        setisloading(true);
        setTimeout(() => {
          navigate("/home");
        }, 3000);
      }
      
    } catch(err){
      console.log(err);
    }
    
  }

  return (
    <div className='h-screen flex justify-center align-middle'>
      {isloading ? (<Loader />) :
        (
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h1 className='text-6xl font-bold italic text-amber-800'>Code Combat</h1>
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Signup to your account
              </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={uploadDetails}>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formdetails.email}
                      onChange={(e) => setFormdetails({ ...formdetails, email: e.target.value })}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-lg font-medium leading-6 text-gray-900">
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="string"
                      autoComplete="username"
                      value={formdetails.username}
                      onChange={(e) => setFormdetails({ ...formdetails, username: e.target.value })}
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                      Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={formdetails.password}
                      onChange={(e) => setFormdetails({ ...formdetails, password: e.target.value })}
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-lg font-medium leading-6 text-gray-900">
                      Confirm Password
                    </label>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={formdetails.confirmPassword}
                      onChange={(e) => setFormdetails({ ...formdetails, confirmPassword: e.target.value })}
                      required
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <FileUpload setFormdetails={setFormdetails} />
                <div>
                  <button 
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" onClick={uploadDetails}
                  >
                    Sign in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-center text-sm text-gray-500">
                Already a member?{' '}
                <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 text-lg">
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}
        <ToastContainer/> 
    </div>
  );
}

export default Signup