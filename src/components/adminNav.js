import '../static/styles/main.css'; 
import { NavLink, Link } from 'react-router-dom'
import { React, useEffect, useState } from 'react';
import { Switch } from '@headlessui/react'
import { AiOutlineHome, AiOutlineCloseCircle } from 'react-icons/ai';
import { BiExport, BiSun, BiMoon } from 'react-icons/bi';
import { FiUsers, FiSettings } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';
import  { useHistory  } from 'react-router-dom'

const AdminNavigation = () =>  {
    let history = useHistory()
    const [appName, setAppName] = useState("")
    const [appImage, setAppImage] = useState("")
    const [darkMode, setDarkMode] = useState(false)
    const [loaded, setLoaded] = useState(false)

    useEffect( async () => {
        var response = await fetch('/accounts/user/data')
        if(response.ok) {
            var responseBody = await response.json()
            setAppName(responseBody.name)
            setAppImage(responseBody.serverImage)
            setLoaded(true)
        }
        if(response.status == 403) history.push('/')
    })

    const changeDarkMode = (e) => {
        if(e == true) {
            // dark mode on
            console.log(document.documentElement)
            document.documentElement.classList.add('dark');
            localStorage.setItem("mode","#0e1c2f")
        }else{
            // dark mode off
            document.documentElement.classList.remove('dark');
            localStorage.setItem("mode","white")
        }
    }


    // render() {
        return (
            
            <div className="h-screen flex">
                

                <div className="md:hidden">
                    
                    <div className="fixed inset-0 flex z-40" id="mob-screen">
    
                    <div className="fixed inset-0" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                    </div>
    
                    <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-other-100 dark:bg-darkOther-100 transition-transform ease-in-out duration-200" id="mob-nav">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => {
                            document.querySelector('#mob-nav').classList.contains('hidden') ? document.querySelector('#mob-nav').classList.remove('hidden') : document.querySelector('#mob-nav').classList.add('hidden')
                            document.querySelector('#mob-screen').classList.contains('hidden') ? document.querySelector('#mob-screen').classList.remove('hidden') : document.querySelector('#mob-screen').classList.add('hidden')
                        }}>
                            <span className="sr-only">Close sidebar</span>
                            <AiOutlineCloseCircle className="h-6 w-6 text-white" id='hide'/>
                        </button>
                        </div>
                        
                        <div className="flex-shrink-0 flex items-center px-4">
                        <img alt={appName} className="h-16 w-auto rounded-full select-none" src={appImage} alt={appName} /> <span className="text-2xl font-medium text-other-200 ml-2 text-20 dark:text-other-100 select-none">{appName}</span>
                        </div>
    
                        <div className="mt-5 flex-1 h-0 overflow-y-auto " >
                        <nav className="px-2 space-y-1 ">
                            <NavLink to='/home' activeClassName="text-green-500 dark:text-green-500" className="dark:text-white">
                                <span className="hover:text-green-400 dark:hover:text-green-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <AiOutlineHome className="hover:text-green-400 dark:hover:text-green-400 mr-3 h-6 w-6" id='hide'/>
                                Home
                                </span>
                            </NavLink>
                
                            <NavLink to='/licenses' activeClassName="dark:text-yellow-500 text-yellow-500" className="dark:text-white">
                                <span className="hover:text-yellow-400 dark:hover:text-yellow-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <IoKeyOutline className="hover:text-yellow-400 dark:hover:text-yellow-400 mr-3 h-6 w-6"/>
                                Licenses
                                </span>
                            </NavLink>
                
                            <NavLink to='/users' activeClassName="dark:text-blue-500 text-blue-500" className="dark:text-white">
                                <span className="hover:text-blue-400 dark:hover:text-blue-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiUsers className="hover:text-blue-400 dark:hover:text-blue-400 mr-3 h-6 w-6" />
                                Users
                                </span>
                            </NavLink>
                
                            <NavLink to='/settings' activeClassName="dark:text-purple-500 text-purple-500" className="dark:text-white">
                                <span className="hover:text-purple-400 dark:hover:text-purple-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiSettings className="hover:text-purple-400 dark:hover:text-purple-400 mr-3 h-6 w-6" />
                                Settings
                                </span>
                            </NavLink>
                
                            <span className="text-orange-500 dark:text-white hover:text-orange-400 dark:hover:text-orange-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <BiExport className="hover:text-orange-500 dark:hover:text-orange-400 mr-3 h-6 w-6" />
                            Export
                            </span>

                            <div className="grid border-t w-1/2">
                                <div className="">
                                    <Switch 
                                    checked={darkMode}
                                    onChange={e => {
                                        setDarkMode(e)
                                        changeDarkMode(e)
                                    }}
                                    as="button" 
                                    className={`${darkMode ? "bg-darkOther-100" : "bg-other-100"} shadow-md border-gray-300 border-1 mt-2 inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}>

                                        {darkMode ?
                                         
                                        <BiMoon aria-hidden="true" className="pointer-events-none translate-x-0 inline-block h-4 w-auto rounded-full text-other-100 shadow transform ring-0 transition ease-in-out duration-200 " />: 
                                        <BiSun aria-hidden="true" className="pointer-events-none translate-x-5 inline-block h-4 w-auto rounded-full text-yellow-500 shadow transform ring-0 transition ease-in-out duration-200" />
                                        }

                                    </Switch>
                                </div>
                    
                          
                            </div>
                        </nav>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-14" aria-hidden="true">
                    </div>
                    </div>
                </div>
    
                <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                <div className="flex flex-col flex-grow pt-5 pb-4 bg-other-100 dark:bg-darkOther-100 overflow-y-auto">
                    {loaded ? <div className="flex items-center flex-shrink-0 px-4">
                        <img alt={appName} className="h-16 w-auto rounded-full select-none" src={appImage} alt={appName} /> <span className="text-2xl font-medium text-other-200 ml-2 text-20 dark:text-other-100 select-none">{appName}</span>
                    </div> : <div></div>}
                    <div className="mt-5 flex-grow flex flex-col">
                    <nav className="flex-1 px-2 bg-other-100 dark:bg-darkOther-100 space-y-1">
                        
                            <NavLink to='/home' activeClassName="text-green-500 dark:text-green-500" className="dark:text-white">
                                <span className="hover:text-green-400 dark:hover:text-green-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <AiOutlineHome className="hover:text-green-400 dark:hover:text-green-400 mr-3 h-6 w-6" id='hide'/>
                                Home
                                </span>
                            </NavLink>
                
                            <NavLink to='/licenses' activeClassName="dark:text-yellow-500 text-yellow-500" className="dark:text-white">
                                <span className="hover:text-yellow-400 dark:hover:text-yellow-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <IoKeyOutline className="hover:text-yellow-400 dark:hover:text-yellow-400 mr-3 h-6 w-6"/>
                                Licenses
                                </span>
                            </NavLink>
                
                            <NavLink to='/users' activeClassName="dark:text-blue-500 text-blue-500" className="dark:text-white">
                                <span className="hover:text-blue-400 dark:hover:text-blue-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiUsers className="hover:text-blue-400 dark:hover:text-blue-400 mr-3 h-6 w-6" />
                                Users
                                </span>
                            </NavLink>
                
                            <NavLink to='/settings' activeClassName="dark:text-purple-500 text-purple-500" className="dark:text-white">
                                <span className="hover:text-purple-400 dark:hover:text-purple-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiSettings className="hover:text-purple-400 dark:hover:text-purple-400 mr-3 h-6 w-6" />
                                Settings
                                </span>
                            </NavLink>
                
                            <span className="text-orange-500 dark:text-white hover:text-orange-400 dark:hover:text-orange-400 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <BiExport className="hover:text-orange-500 dark:hover:text-orange-400 mr-3 h-6 w-6" />
                            Export
                            </span>

                            <div className="grid border-t w-1/2">
                                <div className="">
                                    <Switch 
                                    checked={darkMode}
                                    onChange={e => {
                                        setDarkMode(e)
                                        changeDarkMode(e)
                                    }}
                                    as="button" 
                                    className={`${darkMode ? "bg-darkOther-100" : "bg-other-100"} shadow-md border-gray-300 border-1 mt-2 inline-flex flex-shrink-0 h-5 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}>

                                        {darkMode ?
                                         
                                        <BiMoon aria-hidden="true" className="pointer-events-none translate-x-0 inline-block h-4 w-auto rounded-full text-other-100 shadow transform ring-0 transition ease-in-out duration-200 " />: 
                                        <BiSun aria-hidden="true" className="pointer-events-none translate-x-5 inline-block h-4 w-auto rounded-full text-yellow-500 shadow transform ring-0 transition ease-in-out duration-200" />
                                        }

                                    </Switch>
                                </div>
                    
                          
                            </div>

                    
                    </nav>
                    </div>
                </div>
                </div>
                </div>



            </div>
        );
    // }
}

export default AdminNavigation;
