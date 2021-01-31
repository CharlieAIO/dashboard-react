import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';

import UserNav from '../userNav'
import { IoKeyOutline } from 'react-icons/io5'
import { BiLogInCircle } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'

const BindPage = () => {
    const [name, setName] = useState("")
    const [discrim, setDiscrim] = useState("")
    const [key, setKey] = useState("")
    const [discordImage, setDiscordImage] = useState("")

    async function fetchData(){
        const res = await fetch('/discord/data');
        res.json()
        .then(res => {
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

    
    const submitHandler = async (e) => {
        e.preventDefault()

        if(key.length > 0) {
            var response = await fetch('/users/bind', {
                method:'post',
                body:JSON.stringify({
                    key:key
                }),
                "headers": {
                    "Content-Type": "application/json"
                }
            })
            if(response.ok) {
                setKey("")

                return
            }else{
                return
            }
        }
        else{
            return;
        }
    }

        return (
            <>
                {/* <UserNav /> */}
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <div className="m-auto">

                        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                            <div class="px-4 py-5 sm:px-6">
                                <h1 className="text-lg font-medium text-gray-700">Bind License</h1>
                            </div>
                            <div class="px-4 py-5 sm:p-6">

                                <div className="mt-1 relative">

                                    <div className="pl-3 flex items-center">

                                        {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                        <h1 className="font-medium text-gray-900 text-2xl ml-3">{name}</h1>#<p className="font-normal text-other-200 text-md">{discrim}</p>

                                    </div>


                                </div>
                                

                                <div>
                                    {/* <label for="email" class="block text-sm font-medium text-gray-700">Search candidates</label> */}
                                    <form onSubmit={submitHandler}>
                                    <div class="mt-1 flex rounded-md shadow-sm">

                                        <div class="relative flex items-stretch flex-grow focus-within:z-10">
                                            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <IoKeyOutline className="h-5 w-5 text-gray-400"/>
                                            </div>

                                        
                                            <input value={key} onChange={e => setKey(e.target.value)} type="text" name="key" id="key" autoComplete="off" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300" placeholder="XXX-XXX-XXX-XXX-XXX" />
                                        </div>

                                        <button type="submit" class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                
                                        <BiLogInCircle className="h-5 w-5 text-gray-400"/>

                                        <span>Bind Key</span>

                                        </button>

                                    </div>
                                    </form>
                                </div>



                                
                            </div>
                        </div>

                    </div>

                </div>


            </>
        );

}

export default BindPage;
