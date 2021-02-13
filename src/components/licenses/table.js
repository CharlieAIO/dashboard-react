import '../../static/styles/main.css'; 
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import SquareLoader from "react-spinners/SquareLoader";


const LicenseTable = () => {

    const [users, setUsers] = useState([])
    const [loaded, setLoaded] = useState(false)

    async function fetchUsers(){
        const res = await fetch('/users');
        res.json()
        .then(res => {
            setUsers(res)
            setLoaded(true)
        })
        .catch(err =>  fetchUsers());
        
    }


    useEffect(() =>{
        var abortController = new AbortController();
        fetchUsers()


        setInterval(() => {
            abortController = new AbortController();
            fetchUsers()

        }, 5000);


        return () => {
            abortController.abort();
        };

    }, [])

    const submitEmailHandler = async (e, key,email) => {
        e.preventDefault()

        try{

            await fetch('/users/email', {
                method:'POST',
                body:JSON.stringify({
                    email:email,
                    key:key
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then(response => {
            }).catch(err => console.log(err))
        }catch(err){
            console.log(err)
            return;
        }

    }
    const submitUnbindHandler = async (e, id) => {
        e.preventDefault()
        
        try{

            await fetch('/users/force/unbind/' +id, {
                method:'get'
            })
            .then(response => {
                {}
            }).catch(err => console.log(err))
        }catch(err){
            console.log(err)
            return;
        }

    }
    const submitRevokeHandler = async (e, id) => {
        e.preventDefault()
        
        try{

            await fetch('/users/revoke/' + id, {
                method:'get'
            })
            .then(response => {
                // setPlan("")
                // setEmail("")
            }).catch(err => console.log(err))
        }catch(err){
            console.log(err)
            return;
        }

    }


    const renderTableRows = () => {
        return users.map(user => {
            var date = new Date(user.dateCreated * 1000)
            return (
    
                <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        {/* <div className="flex items-center"> */}

                            {/* <div className="ml-2"> */}

                                {/* style="font-family: 'Ubuntu Mono', monospace;" */}
                                <div className="text-gray-500 dark:text-gray-300 font-mono" id="key">
                                    {user.key}
                                </div>
                                <div className="text-xs gray-900 dark:text-gray-500" id="discordId">{user.plan}</div>

                            {/* </div> */}

                        {/* </div> */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        <div className="text-sm text-gray-900 dark:text-gray-500" id="discordName">{user.discordName == "empty" ? "Unbound" : user.discordName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300" id="discordId">{user.discordId == 123456789 ? "Unbound" : user.discordId}</div>
                    </td>

                    {/* <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        <div className="text-sm text-gray-900" id="keyType">{user.keyType}</div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </td> */}

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:bg-darkOther-200">
                        {
                        `${date.getDate()} ${['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()]}, ${date.getFullYear()}`
                        }
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        
                        <button className="ml-2 text-gray-600 hover:text-gray-900" id={`${user.id}-dropdown-button-hide`} onClick={() => {
                            document.querySelector(`#dropdown-${user.id}`).classList.contains('hidden') ? document.querySelector(`#dropdown-${user.id}`).classList.remove('hidden') : document.querySelector(`#dropdown-${user.id}`).classList.add('hidden')
                        }}> <BsThreeDots className="h-4 w-4" id={`${user.id}-icon-hide`} />
                        </button>

                        <div id={`dropdown-${user.id}`} className="dark:bg-darkOther-200 hidden mx-3 mr-10 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5">

                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300 w-full" role="menuitem" id={`hide-${user.id}`} onClick={(e) => submitUnbindHandler(e, user.id)}>Unbind from User</button>
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300 w-full" role="menuitem" id={`hide-${user.id}`} onClick={(e) => submitRevokeHandler(e, user.id)}>Revoke & Delete</button>
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300 w-full" role="menuitem" id={`hide-${user.id}`} onClick={(e) => submitEmailHandler(e, user.key, user.email)}>Send receipt via email</button>
                            <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300 w-full" role="menuitem" id={`hide-${user.id}`} onClick={(e) => {}}>Extend license</button>
                    
                        </div>

                    </td>

                </tr>
            )
            
            
        })
    }



    return (

        <table className="w-full overflow-y-auto" id="table" id='table'>

                <thead className="bg-gray-200 dark:bg-darkOther-100">

                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                        Key
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                        User
                        </th>

                        {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                        Plan
                        </th> */}

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                        Created
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none">
                            Options
                        </th>
                    </tr>

                </thead>
                
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full">
                    {
                        loaded ? renderTableRows() : 
                        <tr>
                        <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                            {/* <div className="flex items-center"> */}
    
                                {/* <div className="ml-2"> */}
    
                                    {/* style="font-family: 'Ubuntu Mono', monospace;" */}
                                    <div className="text-sm text-gray-700 font-mono dark:text-gray-400" id="key">
                                    <SquareLoader color={'#302f2f'} loading={true} size={25} />
                                    </div>
    
                                {/* </div> */}
    
                            {/* </div> */}
                        </td>
    
                        <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                            <div className="text-sm text-gray-900 dark:text-gray-500" id="discordName"><SquareLoader color={'#302f2f'} loading={true} size={25} /></div>
                            <div className="text-sm text-gray-500 dark:text-gray-300" id="discordId"><SquareLoader color={'#302f2f'} loading={true} size={25} /></div>
                        </td>
    
                        {/* <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                            <div className="text-sm text-gray-900" id="keyType">{user.keyType}</div>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                            </span>
                        </td> */}
    
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:bg-darkOther-200">
                        <SquareLoader color={'#302f2f'} loading={true} size={25} />
                        </td>
    
                        <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                            
                        <SquareLoader color={'#302f2f'} loading={true} size={25} />

    
                        </td>
    
                    </tr>
                    }
                </tbody>
                
        </table>

            


    )



}
export default LicenseTable