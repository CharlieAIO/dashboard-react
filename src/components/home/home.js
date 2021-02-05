import '../../static/styles/main.css'; 
import React, { useState, useEffect } from 'react';
import PlanModal from './planModal';
import RestockModal from './restockModal';
import PlanTable from './planTable';
import RestockTable from './restockTable';

import AdminNavigation from '../adminNav';
import AdminSearchbar from '../adminSearch';

import { FaPlus } from 'react-icons/fa';
import BounceLoader from "react-spinners/BounceLoader";

const Home = () => {
    const [totalLicense, setTotalLicense] = useState(0)
    const [monthlyRev, setMonthlyRev] = useState("$0")
    const [newCustomers, setNewCustomers] = useState(0)
    const [loaded, setLoaded] = useState(false)

    async function fetchPlans(){
        const res = await fetch('/accounts/stats');
        res.json()
        .then(res => {
            setTotalLicense(res.totalCustomers)
            setMonthlyRev(res.revenue)
            setNewCustomers(res.customersMonth)
            setLoaded(true)
            
        })
        .catch(err =>  {
            fetchPlans()
        });
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchPlans()



        return () => {
            abortController.abort();
        };

    }, [])

        return (
            <>
                <AdminNavigation />
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                    <AdminSearchbar />
                {
                    loaded ?
                    <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        


                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"></div>
                                    

                        <div className="mx-auto px-4 sm:px-6 md:px-8 w-full ">
                            <div className="relative w-full">
                                <div className="overflow-hidden shadow divide-y mb-5 rounded-lg">
                                    <dl className="shadow-lg md:grid md:grid-cols-3">
                                        <div className="flex flex-col border-b border-gray-200 p-6 text-center sm:border-0 dark:bg-darkOther-200 bg-white">
                                          <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-900 dark:text-white select-none">
                                            Total Licenses
                                          </dt>
                                          <dd className="order-1 text-5xl font-extrabold text-yellow-500 select-none">
                                            {totalLicense}
                                          </dd>
                                        </div>
                                        <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 dark:bg-darkOther-200 bg-white">
                                          <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-900 dark:text-white select-none">
                                            Monthly Revenue
                                          </dt>
                                          <dd className="order-1 text-5xl font-extrabold text-green-500 select-none">
                                            {monthlyRev}
                                          </dd>
                                        </div>
                                        <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 white dark:bg-darkOther-200 bg-white">
                                          <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-900 dark:text-white select-none">
                                            New Customers 
                                          </dt>
                                          <dd className="order-1 text-5xl font-extrabold text-blue-500 select-none">
                                            {newCustomers}
                                          </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        

                            <dl className="lg:grid md:grid-cols-2 sm:grid-cols-1 gap-4 sm:rounded-lg">
    
                                <div className="flex flex-col p-6 text-center bg-white mt-5 dark:bg-darkOther-200 rounded-lg" style={{'min-height': '400px', 'max-height': '800px'}}>
                                    <div className="sm:grid sm:grid-cols-2">
                                        <div className="text-left">
                                        <h1 className="text-md font-medium text-other-200 dark:text-white select-none">Plans</h1>
                                        </div>
                                        <div className="text-right">
                                            <button name="plan-modal" id="plan-button-hide" type="button" className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md dark:text-white bg-other-100 dark:bg-other-200 text-other-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-other-200 dark:focus:ring-darkOther-200" onClick={() => {
                                                document.querySelector('#plan-modal').classList.contains('hidden') ? document.querySelector('#plan-modal').classList.remove('hidden') : document.querySelector('#plan-modal').classList.add('hidden')
                                            }}>
                                                <FaPlus className="-ml-0.5 mr-2 h-4 w-4 dark:text-white text-other-500" id='hide' />
                                                New Plan
                                            </button>
                                        </div>
                                    </div>
                                
    
                                    <PlanTable />
                                    
                                </div>

                                {/* PLAN CREATE MODAL */}
                                <PlanModal />

    


                                <div className="flex flex-col p-6 text-center bg-white mt-5 dark:bg-darkOther-200 rounded-lg" style={{'min-height': '400px', 'max-height': '800px'}}>
                                    <div className="grid-cols-2 sm:grid sm:grid-cols-2">
                                        <div className="text-left">
                                            <h1 className="text-md font-medium text-other-200 dark:text-white select-none">Restocks</h1>
                                        </div>
                                        <div className="text-right">
                                            <button name="restock-modal" id="restock-button-hide" type="button" className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md dark:text-white bg-other-100 dark:bg-other-200 text-other-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-other-200 dark:focus:ring-darkOther-200" onClick={() => {
                                                document.querySelector('#restock-modal').classList.contains('hidden') ? document.querySelector('#restock-modal').classList.remove('hidden') : document.querySelector('#restock-modal').classList.add('hidden')
                                            }}>
                                            <FaPlus className="-ml-0.5 mr-2 h-4 w-4 dark:text-white text-other-500" id='hide' />
                                            New Restock
                                            </button>
                                        </div>
                                    </div>


                                    <RestockTable />

                                </div>

                                {/* Create Restock Modal */}
                                <RestockModal />

                                

      
    
                            </dl>
                    </div>
    

                    </div>

                    

                    <footer>
                        <p className="text-sm font-small text-gray-600">Invincible Services | 2021 | Thank you for using our services</p>
                    </footer>

                </main>
                :

                <div className="m-auto">
                        
                    <BounceLoader color={'#302f2f'} loading={true} size={25} />
                        
                </div>

                }

                </div>

                

            </>
        );

}

export default Home;
