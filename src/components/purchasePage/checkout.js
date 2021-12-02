import React, {useState, useEffect} from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import publicIp from "public-ip";
import  { useHistory  } from 'react-router-dom'

import {HiOutlineMail} from 'react-icons/hi'
import {RiCoupon2Fill} from 'react-icons/ri'
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';


const CheckoutForm = () => {
    let history = useHistory()
    const stripe = useStripe();
    const elements = useElements();
    const [checkoutStatus, setCheckoutStatus] = useState("idle")
    const [email, setEmail] = useState("")
    const [coupon, setCoupon] = useState("")
    const [key, setKey] = useState("")
    const [availableStock, setAvailableStock] = useState(false)
    const [pricingDetails, setPricingDetails] = useState("")
    const [loaded, setLoaded] = useState(false)

    const getClientIp = async () => await publicIp.v4({
        fallbackUrls: [ "https://ifconfig.co/ip" ]
    });

    async function fetchData(){
        const res = await fetch('/restocks/data/' + localStorage.getItem('pswd'));
        res.json()
        .then(res => {
            setAvailableStock(res.availableStock)
            setPricingDetails(res.pricingDetails)
            setLoaded(true)
        })
        .catch(err =>  {
            setAvailableStock(false)
            setLoaded(true)
        });
        
    }

    useEffect(() =>{
        const abortController = new AbortController();
        fetchData()


        return () => {
            abortController.abort();
        };

    }, [])





    const handleSubmit = async (event) => {
        event.preventDefault();
        if (['success','pending'].includes(checkoutStatus)) {
            console.log("")
        }
        else {

            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: elements.getElement(CardElement),
            });
            if(error) {
                setCheckoutStatus("failed")
            }

            
            try{
                if(JSON.parse(localStorage.getItem('ip')).ip == await getClientIp() && JSON.parse(localStorage.getItem('ip')).restock == localStorage.getItem('pswd')) setCheckoutStatus("failed")
            }catch{}

            setCheckoutStatus("pending")
            if(paymentMethod.id.length > 0 && email.length > 0 && document.querySelector('#purchase-btn').disabled == false) {
                document.querySelector('#purchase-btn').disabled = true
                var response = await fetch('/stripe/checkout', {
                    method:'post',
                    body:JSON.stringify({
                        paymentMethod:paymentMethod,
                        password:localStorage.getItem('pswd'),
                        email:email,
                        coupon:coupon
                    }),
                    "headers": {
                        "Content-Type": "application/json"
                    }
                })
                if(response.ok) {
                    if(response.status == 200) {
                        document.querySelector('#dash-button').classList.remove('hidden')
                        try{
                            localStorage.setItem('ip',JSON.stringify({
                                ip:await getClientIp(),
                                restock:localStorage.getItem('pswd')
                            }))
                        }catch{}
                        setCheckoutStatus("success")
                        //setKey(await response.json().key)
                    }
                    else setCheckoutStatus("failed")
    
                } else {
    
                    setCheckoutStatus("failed")
                }
            } else {
                setCheckoutStatus("failed")
            }
        }
    };

    const dashPush = (e) => {
        // e.preventDefault()
        history.push('/dashboard')
    }

    return (
        <div className="w-full text-center">
            <div>

                <div>
                {
                    loaded ? 
                        availableStock ? 
                        
                        <form onSubmit={handleSubmit}>

                            <fieldset>
                            <CardElement options={{
                                style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#aab7c4',
                                    '::placeholder': {
                                    color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                                },
                            }}/>
                            </fieldset>

                            <fieldset >
                                <div class="mt-3 relative rounded-md border-0">
                                    <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                    <HiOutlineMail class="h-6 w-6 text-gray-400"/>
                                    </div>
                                    <input type="text" className="focus:outline-none md:text-md lg:text-md font-normal text-gray-500 w-full pl-8 sm:text-sm rounded-md p-3" placeholder="email" onChange={e => setEmail(e.target.value)} />
                                </div>
                            </fieldset>

                            <fieldset >
                                <div class="mt-3 relative rounded-md border-0">
                                    <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                                    <RiCoupon2Fill class="h-6 w-6 text-gray-400"/>
                                    </div>
                                    <input type="text" className="focus:outline-none md:text-md lg:text-md font-normal text-gray-500 w-full pl-8 sm:text-sm rounded-md p-3" placeholder="coupon" onChange={e => setCoupon(e.target.value)} />
                                </div>
                            </fieldset>

                            <p className="text-xs text-gray-400 font-medium select-none">{pricingDetails}</p>

                            {
                                checkoutStatus == "idle" ? <button type="submit" disabled={!stripe} className="duration-150 transform hover:scale-105 motion-reduce:transform-none font-medium text-md rounded-md text-white bg-other-900 p-2 px-5 text-center mt-12" id="purchase-btn">Purchase Now</button> : 
                                checkoutStatus == "failed" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-red-500 p-2 px-5 text-center mt-12" id="purchase-btn">Checkout Failed</button> :
                                checkoutStatus == "success" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-green-500 p-2 px-5 text-center mt-12" id="purchase-btn">Purchased</button> : 
                                checkoutStatus == "pending" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-yellow-500 p-2 px-5 text-center mt-12" id="purchase-btn"><BeatLoader color={'#ffffff'} loading={true} size={10} /> </button> :
                                <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-blue-500 p-2 px-5 text-center mt-12" id="purchase-btn">Purchase Now</button>     
                            }

                        </form> : <button type="submit" className="font-medium text-md rounded-md text-white bg-red-500 p-2 px-5 text-center mt-12">Sold Out</button> 
                    
                    :

                    <form>
                    <fieldset>
                    <CardElement options={{
                        style: {
                        base: {
                            fontSize: '16px',
                            color: '#aab7c4',
                            '::placeholder': {
                            color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#9e2146',
                        },
                        },
                    }}/>
                    </fieldset>

                    <fieldset >
                        <div class="mt-3 relative rounded-md border-0">
                            <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                            <HiOutlineMail class="h-6 w-6 text-gray-400"/>
                            </div>
                            <input type="text" className="focus:outline-none md:text-md lg:text-md font-normal text-gray-500 w-full pl-8 sm:text-sm rounded-md p-3" placeholder="email" onChange={e => setEmail(e.target.value)} />
                        </div>
                    </fieldset>

                    <fieldset >
                        <div class="mt-3 relative rounded-md border-0">
                            <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                            <RiCoupon2Fill class="h-6 w-6 text-gray-400"/>
                            </div>
                            <input type="text" className="focus:outline-none md:text-md lg:text-md font-normal text-gray-500 w-full pl-8 sm:text-sm rounded-md p-3" placeholder="coupon" onChange={e => setCoupon(e.target.value)} />
                        </div>
                    </fieldset>

                    <p className="text-xs text-gray-400 font-medium select-none">...</p>

                    <button className="font-medium text-md rounded-md text-white bg-yellow-500 p-2 px-5 text-center mt-12" id="purchase-btn"><BeatLoader color={'#ffffff'} loading={true} size={10} /> </button>

                    </form>

                }
                </div>

                <div>
                    <button id="dash-button" type="button" onClick={() => dashPush()} className="font-medium text-md rounded-md text-white bg-other-900 p-2 px-5 text-center mt-4 w-full hidden">Dashboard</button>
                </div>
            </div>
            
            
        </div>
            
    );
};

const Checkout = () => (
    <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC)}>
      <CheckoutForm />
    </Elements>
);
  
export default Checkout