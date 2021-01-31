import '../../static/styles/main.css'; 
import React, { useEffect, useState } from 'react';
import { BsThreeDots } from 'react-icons/bs';



const LicenseTable = () => {

    const [users, setUsers] = useState([])

    async function fetchUsers(){
        const res = await fetch('/users');
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
            var date = new Date(user.dateCreated * 1000)
            return (
    
                <tr key={user.uuid}>
                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        {/* <div className="flex items-center"> */}

                            {/* <div className="ml-2"> */}

                                {/* style="font-family: 'Ubuntu Mono', monospace;" */}
                                <div className="text-sm text-gray-700 font-mono dark:text-gray-400" id="key">
                                    {user.key}
                                </div>

                            {/* </div> */}

                        {/* </div> */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        <div className="text-sm text-gray-900 dark:text-gray-500" id="discordName">{user.discordName == "empty" ? "Unbound" : user.discordName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-300" id="discordId">{user.discordId == 123456789 ? "Unbound" : user.discordId}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        <div className="text-sm text-gray-900" id="keyType">{user.keyType}</div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:bg-darkOther-200">
                        {
                        `${date.getDate()} ${['January','February','March','April','May','June','July','August','September','October','November','December'][date.getMonth()]}, ${date.getFullYear()}`
                        }
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap dark:bg-darkOther-200">
                        
                        <button className="ml-2 text-gray-600 hover:text-gray-900" id={`${user.uuid}-dropdown-button-hide`} onClick={() => {
                            document.querySelector(`#dropdown-${user.uuid}`).classList.contains('hidden') ? document.querySelector(`#dropdown-${user.uuid}`).classList.remove('hidden') : document.querySelector(`#dropdown-${user.uuid}`).classList.add('hidden')
                        }}> <BsThreeDots className="h-4 w-4" id={`${user.uuid}-icon-hide`} />
                        </button>

                        <div id={`dropdown-${user.uuid}`} className="dark:bg-darkOther-200 hidden mx-1 ml-24 mt-24 origin-top-right absolute top-2 w-48 mt-1 rounded-md shadow-lg z-2 bg-white ring-1 ring-black ring-opacity-5" aria-orientation="vertical" aria-labelledby="user-menu">

                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300" role="menuitem" id="hide">Unbind from User</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300" role="menuitem" id="hide">Revoke & Delete</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300" role="menuitem" id="hide">Send receipt via email</a>
                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-darkOther-300" role="menuitem" id="hide">Extend license</a>
                    
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
                
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full">
                    {renderTableRows()}
                </tbody>
                
            </table>

    )



}
export default LicenseTable