import '../../static/styles/main.css'; 
import React, { Component, useEffect } from 'react';
import UserTable from './table';
import AdminNavigation from '../adminNav';
import AdminSearchbar from '../adminSearch';

import { AiOutlineSearch } from 'react-icons/ai';


class Users extends Component {
    constructor() {
        super()
        this.state = {}

    }

    

    render() {
        function filter() {
            var input, filter, table, tr, td, i, txtValue;
            input = document.getElementById("searchInput");
            filter = input.value.toUpperCase();
            table = document.getElementById("table");
            tr = table.getElementsByTagName("tr");
            
            // Loop through all table rows, and hide those who don't match the search query
            for (i = 0; i < tr.length; i++) {
                try{
                    var td1 = tr[i].getElementsByTagName("td")[2];

                    txtValue = td1.textContent || td1.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }

                }catch(e){
                    console.log(e)
                }
            }
        }
        return (
            <>
                <AdminNavigation />
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <AdminSearchbar />
                <main className="flex-1 relative overflow-y-auto focus:outline-none" id="main" tabIndex='0'>

                    {/* style="min-height: 650px;max-height: 650px;" */}
                    <div className="bg-white overflow-hidden shadow rounded-lg divide-y mr-12 mt-5 dark:bg-darkOther-200">

                        <div className="px-4 py-5 sm:px-6">

                            <dl className="sm:grid sm:grid-cols-2">

                                <div className="flex flex-col p-2  bg-white mr-5 dark:bg-darkOther-200">

                                    <h1  className="dark:text-white">Users</h1>

                                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">

                                        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                            <AiOutlineSearch className="h-5 w-5 text-gray-900 dark:text-other-100"/>
                                        </div>   
                                                                               
                                        <input id="searchInput" onKeyUp={filter} autoComplete="off" className="dark:text-white dark:bg-darkOther-200 bg-white block w-full h-full pl-8 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search by Key" type="search" name="search" />
                                    
                                    </div>
        
                                </div>


                            </dl>

                        </div>

                        <div className="px-4 py-5 sm:p-6">
    

                            <div className="flex flex-col ">

                                <div className="-my-2 overflow-y-auto sm:-mx-6 lg: mr-12 dark:bg-darkOther-200" style={{'min-height': '400px', 'max-height': '800px'}}>
                                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8" >
                                        
                                        <div className="shadow overflow-hidden border-gray-200">

                                            {/* Table */}
                                            <UserTable />

                                        </div>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <footer>
                        <p className="text-sm font-small text-gray-600">Invincible Services | 2021 | Thank you for using our services</p>
                    </footer>
   
                </main>
                </div>
            
            </>
        )
    }

}

export default Users