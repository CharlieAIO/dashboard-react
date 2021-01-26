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
                <main className="space-y-6 sm:px-6 overflow-y-auto mb-12">
                    <section aria-labelledby="section1">

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-8 shadow-lg w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <h1 className="text-lg font-medium text-indigo-700">General Settings</h1>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                    <div>
                                        <label for="accountName" className="block text-sm font-medium text-gray-700">Account Name</label>
                                        <div className="mt-1">
                                            <input type="text" name="accountName" id="accountName" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="Cook Group" aria-describedby="email-description" />
                                        </div>

                                        <p className="mt-2 text-sm text-gray-500" id="accountName-description">This account name will be displayed on the Dashboard & in email receipts</p>
                                    </div>

                                    <div className="text-right">
                                        <button className="text-indigo-600 text-sm font-medium  bg-gray-200 rounded-lg py-2 px-8 text-right">Save</button>
                                    </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <label for="domain" className="block text-sm font-medium text-gray-700">Dashboard Domain</label>
                                    <div className="mt-1">
                                    <input type="text" name="domain" id="domain" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="www.cookgroup.com" aria-describedby="domain-description" />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500" id="accountName-description">Don't include the https://</p>
                                </div>

                                <div className="text-right">
                                    <button className="text-indigo-600 text-sm font-medium  bg-gray-200 rounded-lg py-2 px-8 text-right">Save</button>
                                </div>

                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <label for="supportEmail" className="block text-sm font-medium text-gray-700">Support email</label>
                                    <div className="mt-1">
                                        <input type="text" name="supportEmail" id="supportEmail" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="help@cookgroup.com" aria-describedby="supportEmail-description" />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500" id="supportEmail-description">This will be displayed to all your users if they require assistance</p>
                                </div>

                                <div className="text-right">
                                    <button className="text-indigo-600 text-sm font-medium  bg-gray-200 rounded-lg py-2 px-8 text-right">Save</button>
                                </div>
                            </div>
                        </div>
                        
                    </section>

                    <section aria-labelledby="section2">
                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-8 shadow-lg w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <h1 className="text-lg font-medium text-indigo-700">Branding Settings</h1>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <label for="logo" className="block text-sm font-medium text-gray-700">Logo</label>
                                    <div className="mt-1">
                                    <input type="text" name="logo" id="logo" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-1/2 text-md border-gray-300 rounded-md py-2" placeholder="help@cookgroup.com" aria-describedby="logo-description" />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500" id="logo-description">Enter an image URL here</p>
                                </div>
                                <div className="text-right">
                                    <button className="text-indigo-600 text-sm font-medium  bg-gray-200 rounded-lg py-2 px-8 text-right">Save</button>
                                </div>

                            </div>
                        </div>
                    </section>


                    <section aria-labelledby="section3">
                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-8 shadow-lg w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <h1 className="text-lg font-medium text-indigo-700">Stripe Settings</h1>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 w-3/4">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <label for="failePayments" className="block text-sm font-medium text-gray-700">Setup Stripe Intergation</label>
                                    <div className="mt-1">
                                        <button onClick={this.openIntergrate}  className="bg-indigo-600 rounded-sm w-24 h-10 text-white text-md font-medium px-6 hover:bg-indigo-700">
                                            <FaStripe className="h-10 w-12"/>
                                        </button>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500" id="failePayments-description">Link you stripe account...</p>
                                </div>
                            </div>
                        </div>

                        <div className="shadow sm:rounded-md sm:overflow-hidden mt-3 w-3/4 mb-12">
                            <div className="bg-gray-100 py-4 px-4 sm:p-6">
                                <div>
                                    <label for="failePayments" className="block text-sm font-medium text-gray-700">Manage Failed Payments</label>
                                    <div className="mt-1">
                                        <select id="failePayments" name="failePayments" className="py-5 text-gray-800 font-medium focus:ring-indigo-500 focus:border-indigo-500 relative block w-1/4 rounded-none rounded-t-md bg-transparent focus:z-10 sm:text-sm border-gray-300">
                                            <option value="1" className="text-red-500 font-medium">Delete key & Kick user</option>
                                            <option value="2" className="text-green-500 font-medium">Remove roles & Allow user to renew</option>
                                        </select>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500" id="failePayments-description">Select how you want to deal with failed payments from users</p>
                                </div>
                                <div className="text-right">
                                    <button className="text-indigo-600 text-sm font-medium  bg-gray-200 rounded-lg py-2 px-8 text-right">Save</button>
                                </div>

                            </div>
                        </div>
                    
                    </section>

                </main>
                </div>
            
            </>
        )
    }

}

export default Settings