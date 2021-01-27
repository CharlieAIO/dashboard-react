import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';

import { AiOutlineMail } from 'react-icons/ai';
import {BiKey, BiCalendar} from 'react-icons/bi'
import {FaUserCircle} from 'react-icons/fa'

const Dashboard = () => {
    const [name, setName] = useState("")
    const [discrim, setDiscrim] = useState("")
    const [email, setEmail] = useState("")
    const [key, setKey] = useState("")
    const [joinDate, setJoinDate] = useState("")
    const [discordImage, setDiscordImage] = useState("")

    async function fetchData(){
        const res = await fetch('/discord/data');
        res.json()
        .then(res => {
            setEmail(res.email)
            setKey(res.key)
            var date = new Date(res.dateJoined)
            var day = date.getDate();
            var month = ['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()]
            var year = date.getFullYear()
            setJoinDate(`${month} ${day}, ${year}`)
            setDiscordImage(res.discordImage)
            setName(res.name)
            setDiscrim(res.discrim)
        })
        .catch(err =>  {console.log(err)});
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchData()


        return () => {
            abortController.abort();
        };

    }, [])

        return (
            <>

                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <div className="m-auto">

                        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                            <div class="px-4 py-5 sm:px-6">
                                <h1 className="text-lg font-medium text-gray-700">Dashboard</h1>
                            </div>
                            <div class="px-4 py-5 sm:p-6">

                                <div className="mt-1 relative">

                                <div className="pl-3 flex items-center">

                                    {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                    <h1 className="font-medium text-gray-900 text-2xl ml-3">{name}</h1>#<p className="font-normal text-other-200 text-md">{discrim}</p>

                                </div>


                                </div>
                                
                                <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                                        <AiOutlineMail className="h-8 w-auto text-other-200 font-medium"/>

                                    </div>

                                    <p  name="email" id="email" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">{email}</p>

                                </div>

                                <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        
                                        <BiKey className="h-8 w-auto text-other-200 font-medium"/>

                                    </div>

                                    <p  name="key" id="key" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">{key}</p>

                                </div>

                                <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        
                                        <BiCalendar className="h-8 w-auto text-other-200 font-medium"/>

                                    </div>

                                    <p  name="joined" id="joined" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg"><span className="text-other-200">Joined</span> {joinDate}</p>

                                </div>


                                
                            </div>
                        </div>

                    </div>

                </div>


            </>
        );

}

export default Dashboard;
