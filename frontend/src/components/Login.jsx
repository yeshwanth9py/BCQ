import React, { useState } from 'react'
import { Input } from '@mui/base/Input';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import Loader from './Loader';
import axios from 'axios';



const Login = () => {
    const [isloading, setisloading] = useState(false);
    const [formdetails, setFormdetails] = useState({
        username: "",
        password: "",

    })

    const navigate = useNavigate();

    const typing = (e) => {
        setFormdetails({ ...formdetails, [e.target.name]: e.target.value });
    }

    const submitdetails = (e) => {
        e.preventDefault();
        console.log(formdetails);
        axios.post("http://localhost:3000/app/user/login", formdetails, { withCredentials: true }).then((res) => {
            console.log("res", res.data);

            setisloading(true);

            localStorage.setItem("ccuid", res.data.uid);
            localStorage.setItem("ccusername", res.data.username);
            localStorage.setItem("ccavatar", res.data.profilePic);
            localStorage.setItem("ccpid", res.data.pid);

            sessionStorage.setItem("token", res.data.token);
            
            
        }).then((res) => {
            setTimeout(() => {
                navigate("/home");
            }, 1000)
        }).catch((err) => {
            console.log(err);
            if(err?.response?.status == 400){
                if(err.response.data.name == "ZodError"){
                    toast.error(err.response.data.issues[0].message);
                }else{
                    toast.error(err.response.data.message);
                }
            }else{
                console.log(err);
                toast.error('Server error!');
            }   
        
        });

    }

    return (
        <div className='h-screen flex justify-center align-middle'>
            <Toaster />
            {isloading ? (<Loader />) :
                (
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 ">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h1 className='text-6xl font-bold italic text-amber-800'>Code Combat</h1>
                            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Sign in to your account
                            </h2>
                        </div>

                        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form className="space-y-6" onSubmit={submitdetails}>
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
                                            required
                                            value={formdetails.email}
                                            onChange={typing}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2"
                                        />
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
                                <div className="text-sm">
                                    <a href="/forgotpassword" className="font-semibold text-indigo-600 hover:text-indigo-500 text-lg">
                                        Forgot password?
                                    </a>
                                </div>



                                <div>
                                    <button
                                        type="submit"
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <p className="mt-10 text-center text-sm text-gray-500">
                                Not a member?{' '}
                                <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 text-lg">
                                    Signup
                                </Link>
                            </p>
                        </div>
                    </div >
                )}
        </div >

    )
}

export default Login




