import React, {useState} from 'react';
import BeatLoader from "react-spinners/BeatLoader";

import {HiOutlineMail} from 'react-icons/hi'
import {loadStripe} from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';



const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutStatus, setCheckoutStatus] = useState("idle")
  const [email, setEmail] = useState("")
  const [key, setKey] = useState("")


  const handleSubmit = async (event) => {
    event.preventDefault();
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });
    if(error) {
        setCheckoutStatus("failed")
    }



    setCheckoutStatus("pending")
    var response = await fetch('/stripe/checkout', {
        method:'post',
        body:JSON.stringify({
            paymentMethod:paymentMethod,
            password:localStorage.getItem('pswd'),
            email:email
        }),
        "headers": {
            "Content-Type": "application/json"
        }
    })
    if(response.ok) {
        console.log(response.status)
        if(response.status == 200) {
            setCheckoutStatus("success")
            //setKey(await response.json().key)
        }
        else setCheckoutStatus("failed")
    } else {
        setCheckoutStatus("failed")
    }
  };


  return (
    <div className="w-full text-center">
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
            {/* <HiOutlineMail/> */}
                <div class="mt-3 relative rounded-md border-0">
                    <div class="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <HiOutlineMail class="h-6 w-6 text-gray-400"/>
                    </div>
                    <input type="text" className="focus:outline-none md:text-md lg:text-md font-normal text-gray-500 w-full pl-8 sm:text-sm rounded-md p-3" placeholder="email" onChange={e => setEmail(e.target.value)} />
                </div>
            </fieldset>

            {
                checkoutStatus == "idle" ? <button type="submit" disabled={!stripe} className="duration-150 transform hover:scale-105 motion-reduce:transform-none font-medium text-md rounded-md text-white bg-blue-500 p-2 px-5 text-center mt-12">Purchase Now</button> : 
                checkoutStatus == "failed" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-red-500 p-2 px-5 text-center mt-12">Checkout Failed</button> :
                checkoutStatus == "success" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-green-500 p-2 px-5 text-center mt-12">Purchased</button> : 
                checkoutStatus == "pending" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-yellow-500 p-2 px-5 text-center mt-12"><BeatLoader color={'#ffffff'} loading={true} size={10} /> </button> :
                <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-blue-500 p-2 px-5 text-center mt-12">Purchase Now</button>     
            }

        </form>
    </div>
        
  );
};

const stripePromise = loadStripe('pk_test_yNOrvYEsFI7fmUNnIhuwUrFF00hyizaNIs');

const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout