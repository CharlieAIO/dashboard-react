import '../static/styles/main.css'; 
import React from 'react';


import { AiOutlineSearch, AiOutlineMenu } from 'react-icons/ai';
import { IoNotificationsOutline } from 'react-icons/io5';



const adminSearch = () =>  {

    // render() {
        return (

            <div className="relative z-10 flex h-16 shadow-sm">
                        <button className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden" onClick={() => {
                                    document.querySelector('#mob-nav').classList.contains('hidden') ? document.querySelector('#mob-nav').classList.remove('hidden') : document.querySelector('#mob-nav').classList.add('hidden')
                                    document.querySelector('#mob-screen').classList.contains('hidden') ? document.querySelector('#mob-screen').classList.remove('hidden') : document.querySelector('#mob-screen').classList.add('hidden')
                            }}>
                            <AiOutlineMenu className="h-6 w-6"/>
                        </button>
                        
                        <div className="flex-1 px-4 flex justify-between bg-other_light-100 mr-2">
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#" method="GET">
                                    <label className="sr-only">Search</label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                        <AiOutlineSearch className="h-5 w-5 text-gray-900"/>
                                    </div>
                                    <input id="search_field" disabled="disabled" autoComplete="off" className="bg-other_light-100 block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search" />
                                    </div>
                                </form>
                            </div>
            
                            <div className="ml-4 flex items-center md:ml-6">
                                <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => {
                                    document.querySelector('#notif-dropdown').classList.contains('hidden') ? document.querySelector('#notif-dropdown').classList.remove('hidden') : document.querySelector('#notif-dropdown').classList.add('hidden')
                                }}>
                                    <span className="sr-only">View notifications</span>
                                    <IoNotificationsOutline className="h-6 w-6" id='hide'/>
                                </button>

                                <div className="hidden absolute right-0 mt-24 mr-24 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" id="notif-dropdown" aria-orientation="vertical">
                                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id='hide'>No notifications</span>
                                </div>
                        
                                <div className="ml-3 relative">
                                    <div>  
                                        <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="profile-button-hide" name="profile-dropdown" aria-haspopup="true"  onClick={() => {
                                            document.querySelector('#profile-dropdown').classList.contains('hidden') ? document.querySelector('#profile-dropdown').classList.remove('hidden') : document.querySelector('#profile-dropdown').classList.add('hidden')
                                        }}>
                                            <span className="sr-only">Open user menu</span>
                                            <img alt="" className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" id="profile-button-hide" name="profile-dropdown" />
                                        </button>
                                    </div>
            
                                    <div className="hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5" role="menu" id="profile-dropdown" aria-orientation="vertical" aria-labelledby="user-menu">
                                        <span href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id='hide'>Sign out</span>
                                    </div>
                                </div>
            
                            </div>
                        </div>
            </div>
        )
}

export default adminSearch;