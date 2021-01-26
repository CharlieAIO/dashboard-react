import '../../static/styles/main.css'; 
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';



const LicenseTable = () => {

    const [users, setUsers] = useState([])

    async function fetchUsers(){
        const res = await fetch('/api/v1/users');
        res.json()
        .then(res => {setUsers(res)})
        .catch(err =>  {});
        
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


    const renderTableRows = () => {
        return users.map(user => {
            return (
                <tr key={user.uuid}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {/* <div className="flex items-center"> */}

                            {/* <div className="ml-2"> */}

                                {/* style="font-family: 'Ubuntu Mono', monospace;" */}
                                <div className="text-sm font-sm text-gray-600 font-mono" id="key">
                                    {user.key}
                                </div>

                            {/* </div> */}

                        {/* </div> */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900" id="discordName">{user.discordName}</div>
                        <div className="text-sm text-gray-500" id="discordId">{user.discordId}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900" id="keyType">{user.keyType}</div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        January 19th 2:45 PM
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                        
                        <button className="ml-2 text-indigo-600 hover:text-indigo-900" id={`${user.uuid}-dropdown-button-hide`} onClick={() => {
                            document.querySelector(`#dropdown-${user.uuid}`).classList.contains('hidden') ? document.querySelector(`#dropdown-${user.uuid}`).classList.remove('hidden') : document.querySelector(`#dropdown-${user.uuid}`).classList.add('hidden')
                        }}> <BsThreeDots className="h-4 w-4" id={`${user.uuid}-icon-hide`} />
                        </button>

                        <div id={`dropdown-${user.uuid}`} className="hidden mx-1 ml-24 mt-24 origin-top-right absolute top-2 w-48 mt-1 rounded-md shadow-lg z-2 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200" aria-orientation="vertical" aria-labelledby="user-menu">

                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id="hide">Unbind from User</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id="hide">Revoke & Delete</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id="hide">Send receipt via email</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" id="hide">Extend license</a>
                    
                        </div>

                    </td>

                </tr>
            )
            
        })
    }



    return (

            <table className="bg-white w-full overflow-y-auto" id="table" id='table'>

                <thead className="bg-gray-200">

                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Key
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                        </th>

                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Options
                        </th>
                    </tr>

                </thead>
                
                <tbody className="bg-white divide-y divide-gray-200 min-h-full">
                    {renderTableRows()}
                </tbody>
                
            </table>

    )



}
export default LicenseTable