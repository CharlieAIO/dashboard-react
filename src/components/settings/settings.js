import '../../static/styles/main.css'; 
import React, { Component, useEffect } from 'react';
import AdminNavigation from '../adminNav';
import AdminSearchbar from '../adminSearch';

import { FaStripe } from 'react-icons/fa'

class Settings extends Component {
    constructor() {
        super()
        this.state = {}

    }

    openIntergrate = () => {
        window.open('https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_IoulDfRGftLWpHLLkw7NJwDFfs9LqhgT&scope=read_write&redirect_uri=http://127.0.0.1:4000/stripe/oauth/uri', '_blank').focus()
    }

    

    render() {

        return (
            <>
                <AdminNavigation />
                <div className="flex flex-col w-0 flex-1 overflow-hidden">
                <AdminSearchbar />
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                <div className="py-6">

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"></div>

                    <div className="mx-auto px-4 sm:px-6 md:px-8 w-full">
                    
                    <section aria-labelledby="section1">

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-8 shadow-lg lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <h1 className="text-lg font-medium text-other-300 dark:text-white select-none">General Settings</h1>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                    <div>
                                        <label for="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-400 select-none">Account Name</label>
                                        <div className="mt-1">
                                            <input type="text" name="accountName" id="accountName" autoComplete="off" className="dark:text-other-100 dark:bg-darkOther-100 shadow-sm focus:ring-other-200 focus:border-other-200 block w-1/2 text-md border-gray-300 rounded-md py-2 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200" placeholder="Cook Group" aria-describedby="email-description" />
                                        </div>

                                        <p className="mt-2 text-sm text-gray-500 select-none" id="accountName-description">This account name will be displayed on the Dashboard & in email receipts</p>
                                    </div>

                                    <div className="text-right">
                                        <button className="text-other-200 text-sm font-medium bg-gray-200 rounded-lg py-2 px-8 text-right dark:bg-darkOther-100 dark:text-other-100">Save</button>
                                    </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <label for="domain" className="block text-sm font-medium text-gray-700 dark:text-gray-400 select-none">Dashboard Domain</label>
                                    <div className="mt-1">
                                    <input type="text" name="domain" id="domain" className="dark:text-other-100 dark:bg-darkOther-100 shadow-sm focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="www.cookgroup.com" aria-describedby="domain-description" />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 select-none" id="accountName-description">Don't include the https://</p>
                                </div>

                                <div className="text-right">
                                    <button className="text-other-200 text-sm font-medium bg-gray-200 rounded-lg py-2 px-8 text-right dark:bg-darkOther-100 dark:text-other-100">Save</button>
                                </div>

                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <label for="supportEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-400 select-none">Support email</label>
                                    <div className="mt-1">
                                        <input type="text" name="supportEmail" id="supportEmail" className="dark:text-other-100 dark:bg-darkOther-100 shadow-sm focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="help@cookgroup.com" aria-describedby="supportEmail-description" />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 select-none" id="supportEmail-description">This will be displayed to all your users if they require assistance</p>
                                </div>

                                <div className="text-right">
                                    <button className="text-other-200 text-sm font-medium bg-gray-200 rounded-lg py-2 px-8 text-right dark:bg-darkOther-100 dark:text-other-100">Save</button>
                                </div>
                            </div>
                        </div>
                        
                    </section>

                    <section aria-labelledby="section2">
                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-8 shadow-lg lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <h1 className="text-lg font-medium text-other-300 dark:text-white select-none">Branding Settings</h1>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <label for="logo" className="block text-sm font-medium text-gray-700 dark:text-gray-400 select-none">Logo</label>
                                    <div className="mt-1">
                                    <input type="text" name="logo" id="logo" className="dark:text-other-100 dark:bg-darkOther-100 shadow-sm focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="help@cookgroup.com" aria-describedby="logo-description" />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 select-none" id="logo-description">Enter an image URL here</p>
                                </div>
                                <div className="text-right">
                                    <button className="text-other-200 text-sm font-medium bg-gray-200 rounded-lg py-2 px-8 text-right dark:bg-darkOther-100 dark:text-other-100">Save</button>
                                </div>

                            </div>
                        </div>
                    </section>


                    <section aria-labelledby="section3">
                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-8 shadow-lg lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <h1 className="text-lg font-medium text-other-300  dark:text-white select-none">Stripe Settings</h1>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 lg:w-3/4 md:3/4 sm:w-full">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <label for="failePayments" className="block text-sm font-medium text-gray-700 dark:text-gray-400 select-none">Setup Stripe Intergation</label>
                                    <div className="mt-1">
                                        <button onClick={this.openIntergrate}  className="bg-other-200 dark:bg-darkOther-100 rounded-sm w-24 h-10 text-white text-md font-medium px-6 hover:bg-other-300">
                                            <FaStripe className="h-10 w-12"/>
                                        </button>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 select-none" id="failePayments-description ">Link you stripe account...</p>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 lg:w-3/4 md:3/4 sm:w-full mb-12">
                            <div className="bg-white py-4 px-4 sm:p-6 dark:bg-darkOther-200">
                                <div>
                                    <label for="failePayments" className="block text-sm font-medium text-gray-700 dark:text-gray-400 select-none">Manage Failed Payments</label>
                                    <div className="mt-1">
                                        <select id="failePayments" name="failePayments" className="py-5 text-gray-800 font-medium focus:ring-other-200 focus:border-other-200 dark:focus:ring-darkOther-200 dark:focus:border-darkOther-200 dark:text-white relative block w-1/2 rounded-none rounded-t-md bg-transparent focus:z-10 sm:text-sm border-gray-300">
                                            <option value="1" className="font-medium dark:text-white dark:bg-darkOther-200">Delete key & Kick user</option>
                                            <option value="2" className="font-medium dark:text-white dark:bg-darkOther-200">Remove roles & Allow user to renew</option>
                                        </select>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500 select-none" id="failePayments-description">Select how you want to deal with failed payments from users</p>
                                </div>
                                <div className="text-right">
                                    <button className="text-other-200 text-sm font-medium bg-gray-200 rounded-lg py-2 px-8 text-right dark:bg-darkOther-100 dark:text-other-100">Save</button>
                                </div>

                            </div>
                        </div>
                    
                    </section>

                    </div>
                </div>
                </main>
                </div>
            
            </>
        )
    }

}

export default Settings