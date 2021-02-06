import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import UserNav from '../userNav'
import { IoKeyOutline } from 'react-icons/io5'
import { BiLogInCircle } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import  { useHistory  } from 'react-router-dom'

const BindPage = () => {
    let history = useHistory()
    const [name, setName] = useState("")
    const [discrim, setDiscrim] = useState("")
    const [key, setKey] = useState("")
    const [discordImage, setDiscordImage] = useState("")
    const [loaded, setLoaded] = useState(false)

    async function fetchData(){
        const res = await fetch('/discord/data');
        res.json()
        .then(res => {
            setDiscordImage(res.discordImage)
            setName(res.name)
            setDiscrim(res.discrim)
            if(res.bg == "" || res.bg == "empty" || res.bg == undefined || res.bg == null) {
                document.querySelector('#baseBackground').style = `background-repeat: no-repeat; background-image: url('${res.bg}'); background-attachment: fixed; background-size: cover; background-size: 100% 100%;`
            } else {
                document.querySelector('#baseBackground').classList.add('bg-darkOther-300')
                document.querySelector('#baseBackground').style = `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E");`
            }
            setLoaded(true)
        })
        .catch(err =>  {
            if(res.status == 403) history.push('/discord/oauth')
        });
        
        
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
                history.push('/dashboard')

            
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
                <div className="flex flex-col w-0 flex-1 overflow-y-auto">
                    <UserNav />
                    <div className="m-auto">

                        <div class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                            <div class="px-4 py-5 sm:px-6">
                                <h1 className="text-lg font-medium text-gray-700">Bind License</h1>
                            </div>
                            <div class="px-4 py-5 sm:p-6">

                                {loaded ? <div className="mt-1 relative">

                                <div className="pl-3 flex items-center">

                                    {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                    <h1 className="font-medium text-gray-900 text-2xl ml-3">{name}</h1>#<p className="font-normal text-other-200 text-md">{discrim}</p>

                                </div>


                                </div> : <div className="pl-3 flex items-center">

                                {discordImage ? <img src={discordImage} className="rounded-full h-16 w-auto text-other-200 font-medium" alt=""/> : <FaUserCircle className="h-14 w-auto text-other-200 font-medium"/>}

                                <h1 className="font-medium text-gray-900 text-2xl ml-3">Loading...</h1>

                                </div>

                                }
                                                                

                                <div>
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
