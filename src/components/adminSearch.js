import '../static/styles/main.css'; 
import React, {useState, useEffect} from 'react';


import { AiOutlineSearch, AiOutlineMenu } from 'react-icons/ai';
import { IoNotificationsOutline } from 'react-icons/io5';
import {FaUserCircle} from 'react-icons/fa'


const AdminSearch = () =>  {

    const [userImage, setUserImage] = useState("")

    async function fetchData(){
        const res = await fetch('/discord/data');
        res.json()
        .then(res => {setUserImage(res.discordImage)})
        .catch(err =>  {});
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchData()

        return () => {
            abortController.abort();
        };

    }, [])

    // render() {
        return (

            <div className="relative z-10 flex h-16 shadow-sm">
                        <button className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden" onClick={() => {
                                    document.querySelector('#mob-nav').classList.contains('hidden') ? document.querySelector('#mob-nav').classList.remove('hidden') : document.querySelector('#mob-nav').classList.add('hidden')
                                    document.querySelector('#mob-screen').classList.contains('hidden') ? document.querySelector('#mob-screen').classList.remove('hidden') : document.querySelector('#mob-screen').classList.add('hidden')
                            }}>
                            <AiOutlineMenu className="h-6 w-6"/>
                        </button>
                        
                        <div className="flex-1 px-4 flex justify-between bg-other-100 dark:bg-darkOther-100 mr-2">
                            <div className="flex-1 flex">
                                <form className="w-full flex md:ml-0" action="#" method="GET">
                                    <label className="sr-only">Search</label>
                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                                    <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                        <AiOutlineSearch className="h-5 w-5 text-gray-900 dark:text-other-100"/>
                                    </div>
                                    <input id="search_field" disabled="disabled" autoComplete="off" className="bg-other-100 dark:bg-darkOther-100 block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search" />
                                    </div>
                                </form>
                            </div>
            
                            <div className="ml-4 flex items-center md:ml-6 ">
                                <button className="p-1 rounded-full bg-darkOther-200 text-other-100 dark:bg-other-200 dark:text-other-100 focus:outline-none" onClick={() => {
                                    document.querySelector('#notif-dropdown').classList.contains('hidden') ? document.querySelector('#notif-dropdown').classList.remove('hidden') : document.querySelector('#notif-dropdown').classList.add('hidden')
                                }}>
                                    <span className="sr-only">View notifications</span>
                                    <IoNotificationsOutline className="h-7 w-7" id='hide'/>
                                </button>

                                <div className="dark:bg-darkOther-200 hidden absolute right-0 mt-24 mr-24 w-48 rounded-md shadow-lg py-1 bg-white focus:outline-none" role="menu" id="notif-dropdown" aria-orientation="vertical">
                                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-darkOther-300 dark:text-white" role="menuitem" id='hide'>No notifications</span>
                                </div>
                        
                                <div className="ml-3 relative">
                                    <div>  
                                        <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none" id="profile-button-hide" name="profile-dropdown" aria-haspopup="true"  onClick={() => {
                                            document.querySelector('#profile-dropdown').classList.contains('hidden') ? document.querySelector('#profile-dropdown').classList.remove('hidden') : document.querySelector('#profile-dropdown').classList.add('hidden')
                                        }}>
                                            <span className="sr-only">Open user menu</span>
                                            {userImage == "" ? <FaUserCircle className="h-10 w-10 rounded-full bg-darkOther-200 text-other-100 dark:bg-other-200 dark:text-other-100 " id="profile-button-hide" name="profile-dropdown" /> : <img className="h-8 w-8 rounded-full text-other-100 dark:text-darkOther-300" src={userImage} id="profile-button-hide" name="profile-dropdown" />}
                                        </button>
                                    </div>
            
                                    <div className="dark:bg-darkOther-200 hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white" role="menu" id="profile-dropdown" aria-orientation="vertical" aria-labelledby="user-menu">
                                        <span href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-darkOther-300 dark:text-white" role="menuitem" id='hide'>Sign out</span>
                                    </div>
                                </div>
            
                            </div>
                        </div>
            </div>
        )
}

export default AdminSearch;