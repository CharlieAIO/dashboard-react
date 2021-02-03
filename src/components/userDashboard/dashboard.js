import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import  { useHistory  } from 'react-router-dom'

import { AiOutlineMail } from 'react-icons/ai';
import { BiCalendar, BiExit } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { IoKeyOutline, IoCardOutline } from 'react-icons/io5'
import { GiCancel } from 'react-icons/gi'

import UserNav from '../userNav'

const Dashboard = () => {
    let history = useHistory()

    const [loaded, setLoaded] = useState(false)
    const [name, setName] = useState("")
    const [discrim, setDiscrim] = useState("")
    const [email, setEmail] = useState("")
    const [key, setKey] = useState("")
    const [joinDate, setJoinDate] = useState("")
    const [discordImage, setDiscordImage] = useState("")
    const [customerId, setCustomerId] = useState("")

    async function fetchData(){
        const res = await fetch('/discord/data');
        res.json()
        .then(res => {
            if(res.key == 'n/a') {
                history.push('/bind')
            }
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
            setCustomerId(res.customerId)
            setLoaded(true)
            
        })
        .catch(err =>  { 
            if(res.status == 403) history.push('/bind')
        });
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchData()


        return () => {
            abortController.abort();
        };

    }, [])

    const unbind = async () => {
        var response = await fetch('/users/unbind/' + key)
        console.log(response)
        if(response.ok) {
            history.push('/bind')
        }else{
            {}
        }
    }

        return (
            <>
                <div className="flex flex-col w-0 flex-1 overflow-y-auto">
                <UserNav />
                    <div className="m-auto">

                        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                            <div class="px-4 py-5 sm:px-6">
                                <h1 className="text-lg font-medium text-gray-700">Dashboard</h1>
                            </div>
                            
                            {loaded ? <div class="px-4 py-5 sm:p-6">

                            <div className="grid grid-cols-1 rows-2">
                                <div className="">

                                    <div className="pl-3 flex items-center">

                                        {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                        <h1 className="font-medium text-gray-900 text-2xl ml-3">{name}</h1>#<p className="font-normal text-other-200 text-md">{discrim}</p>

                                    </div>


                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                                            <AiOutlineMail className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="email" id="email" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">{email}</p>

                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            
                                            <IoKeyOutline className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="key" id="key" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">{key}</p>

                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            
                                            <BiCalendar className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="joined" id="joined" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg"><span className="text-other-200">Joined</span> {joinDate}</p>

                                    </div>



                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="mt-2 relative rounded-md shadow-sm rounded-lg ">

                                        <button  name="joined" id="joined" className="bg-blue-400 p-3 block w-full sm:text-sm text-white rounded-md font-medium lg:text-lg" onClick={() => unbind()}>
                                            <div className="absolute inset-y-0 flex items-center pointer-events-none">
                                                
                                                <BiExit className="h-4 w-auto text-white font-medium"/>

                                            </div>

                                       Unbind</button>

                                    </div>
                                    <div className="mt-2 relative rounded-md shadow-sm rounded-lg">

                                        <form method="POST" action='/stripe/customer-portal-sess'>

                                            <button type="submit" name="joined" id="joined" className="bg-blue-400 p-3 block w-full sm:text-sm text-white rounded-md font-medium lg:text-lg">
                                                <input type="text" name="customerId" hidden value={customerId}/>
                                            <div className="absolute inset-y-0 flex items-center pointer-events-none">
                                                
                                                <IoCardOutline className="h-4 w-auto text-white font-medium" />

                                            </div>

                                            Subscription</button>

                                        </form>

                                    </div>
                                </div>

                            </div> 
                    
                                
                                : <div class="px-4 py-5 sm:p-6">

                                    <div className="mt-1 relative">

                                    <div className="pl-3 flex items-center">

                                        {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                        <h1 className="font-medium text-gray-900 text-2xl ml-3">Loading...</h1>

                                    </div>


                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                                            <AiOutlineMail className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="email" id="email" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">loading...</p>

                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            
                                            <IoKeyOutline className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="key" id="key" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">loading...</p>

                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            
                                            <BiCalendar className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="joined" id="joined" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">Loading....</p>

                                    </div>



                                    </div>}

                        </div>

                    </div>

                </div>


            </>
        );

}

export default Dashboard;
