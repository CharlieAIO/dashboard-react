import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import  { useHistory  } from 'react-router-dom'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { AiOutlineMail } from 'react-icons/ai';
import { BiCalendar, BiExit } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { IoKeyOutline, IoCardOutline } from 'react-icons/io5'
import Background from '../../static/styles/background.svg'

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
    const [background, setBackground] = useState("")

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
            if(res.bg == "" || res.bg == "empty" || res.bg == undefined || res.bg == null) {
                document.querySelector('#baseBackground').style = `background-repeat: no-repeat; background-image: url('${res.bg}'); background-attachment: fixed; background-size: cover; background-size: 100% 100%;`
            } else {
                document.querySelector('#baseBackground').classList.add('bg-darkOther-300')
                document.querySelector('#baseBackground').style = `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");`
            }

            //setBackground(res.bg)
            setLoaded(true)
            
        })
        .catch(err =>  { 
            if(res.status == 403) history.push('/bind')
        });
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchData()
        //document.querySelector('#baseBackground').classList.remove('bg-other-100')



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

                        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 opacity-95">
                            <div class="px-4 py-5 sm:px-6">
                                <h1 className="text-lg font-medium text-gray-700 select-none">Dashboard</h1>
                            </div>
                            
                            {loaded ? <div class="px-4 py-5 sm:p-6">

                            <div className="grid grid-cols-1 rows-2">
                                <div className="">

                                    <div className="pl-3 flex items-center select-none">

                                        {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                        <h1 className="font-medium text-gray-900 text-2xl ml-3 select-none">{name}</h1>#<p className="font-normal text-other-200 text-md select-none">{discrim}</p>

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

                                        <CopyToClipboard text={key} onCopy={(e) => {
                                            document.querySelector('#key').classList.add(['text-green-500'])
                                            setTimeout(() => {
                                                document.querySelector('#key').classList.remove(['text-green-500'])
                                            }, 1500);
                                        }}><p  name="key" id="key" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg">{key}</p></CopyToClipboard>
                                      

                                    </div>

                                    <div className="mt-1 relative rounded-md shadow-sm rounded-lg p-5">

                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            
                                            <BiCalendar className="h-6 w-auto text-other-200 font-medium"/>

                                        </div>

                                        <p  name="joined" id="joined" autoComplete="off" className="focus:ring-other-200 focus:border-other-200 block w-full pl-10 sm:text-sm text-gray-900 rounded-md font-normal lg:text-lg select-none"><span className="text-other-200 select-none">Joined</span> {joinDate}</p>

                                    </div>



                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="mt-2 relative rounded-md shadow-sm rounded-lg ">

                                        <button  name="joined" id="joined" className="bg-other-900 p-3 block w-full sm:text-sm text-white rounded-md font-medium lg:text-lg" onClick={() => unbind()}>
                                            <div className="absolute inset-y-0 flex items-center pointer-events-none">
                                                
                                                <BiExit className="h-4 w-auto text-white font-medium"/>

                                            </div>

                                       Unbind</button>

                                    </div>
                                    <div className="mt-2 relative rounded-md shadow-sm rounded-lg">

                                        <form method="POST" action='/stripe/customer-portal-sess'>

                                            <button type="submit" name="joined" id="joined" className="bg-other-900 p-3 block w-full sm:text-sm text-white rounded-md font-medium lg:text-lg">
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
