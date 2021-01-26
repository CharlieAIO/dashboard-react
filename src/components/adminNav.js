import '../static/styles/main.css'; 
import { NavLink, Link } from 'react-router-dom'
import { React, useEffect, useState } from 'react';

import { AiOutlineHome, AiOutlineCloseCircle } from 'react-icons/ai';
import { BiExport } from 'react-icons/bi';
import { FiUsers, FiSettings } from 'react-icons/fi';
import { IoKeyOutline } from 'react-icons/io5';

const AdminNavigation = () =>  {
    const [appName, setAppName] = useState("")
    const [appImage, setAppImage] = useState("")

    useEffect( async () => {
        var response = await fetch('/api/v1/accounts/data')
        if(response.ok) {
            var responseBody = await response.json()
            console.log(responseBody)

            setAppName(responseBody.name)
            setAppImage(responseBody.serverImage)
        }
    })


    // render() {
        return (
            
            <div className="h-screen flex">
                

                <div className="md:hidden">
                    
                    <div className="fixed inset-0 flex z-40">
    
                    <div className="fixed inset-0" aria-hidden="true" id="mob-screen">
                        <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
                    </div>
    
                    <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-other_light-100" id="mob-nav">
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
                        <img alt={appName} className="h-12 w-auto rounded-lg" src={appImage} alt={appName} /> <span className="text-2xl font-medium text-indigo-600 ml-2 text-20">{appName}</span>
                        </div>
    
                        <div className="mt-5 flex-1 h-0 overflow-y-auto" >
                        <nav className="px-2 space-y-1">
                            <NavLink to='/home' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <AiOutlineHome className="group-hover:text-gray-500 mr-3 h-6 w-6" id='hide'/>
                                Home
                                </span>
                            </NavLink>
                
                            <NavLink to='/licenses' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <IoKeyOutline className="group-hover:text-gray-500 mr-3 h-6 w-6"/>
                            Licenses
                            </span>
                            </NavLink>
                
                            <NavLink to='/users' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiUsers className="group-hover:text-gray-500 mr-3 h-6 w-6" />
                                Users
                                </span>
                            </NavLink>
                
                            <NavLink to='/settings' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiSettings className="group-hover:text-gray-500 mr-3 h-6 w-6" />
                                Settings
                                </span>
                            </NavLink>
                
                            <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <BiExport className="group-hover:text-gray-500 mr-3 h-6 w-6" />
                            Export
                            </span>
                        </nav>
                        </div>
                    </div>
                    <div className="flex-shrink-0 w-14" aria-hidden="true">
                    </div>
                    </div>
                </div>
    
                <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64">
                <div className="flex flex-col flex-grow pt-5 pb-4 bg-other_light-100 overflow-y-auto">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <img alt={appName} className="h-12 w-auto rounded-lg" src={appImage} alt={appName} /> <span className="text-2xl font-medium text-indigo-600 ml-2 text-20">{appName}</span>
                    </div>
                    <div className="mt-5 flex-grow flex flex-col">
                    <nav className="flex-1 px-2 bg-other_light-100 space-y-1">
                        
                            <NavLink to='/home' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <AiOutlineHome className="group-hover:text-gray-500 mr-3 h-6 w-6" id='hide'/>
                                Home
                                </span>
                            </NavLink>
                
                            <NavLink to='/licenses' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <IoKeyOutline className="group-hover:text-gray-500 mr-3 h-6 w-6"/>
                            Licenses
                            </span>
                            </NavLink>
                
                            <NavLink to='/users' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiUsers className="group-hover:text-gray-500 mr-3 h-6 w-6" />
                                Users
                                </span>
                            </NavLink>
                
                            <NavLink to='/settings' activeClassName="text-indigo-600">
                                <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                                <FiSettings className="group-hover:text-gray-500 mr-3 h-6 w-6" />
                                Settings
                                </span>
                            </NavLink>
                
                            <span className="hover:bg-indigo-100 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                            <BiExport className="group-hover:text-gray-500 mr-3 h-6 w-6" />
                            Export
                            </span>
                
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
