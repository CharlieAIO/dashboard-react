import React, {useState, useEffect} from 'react';
import BeatLoader from "react-spinners/BeatLoader";
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
    const [key, setKey] = useState("")
    const [availableStock, setAvailableStock] = useState(false)
    const [pricingDetails, setPricingDetails] = useState("")

    async function fetchData(){
        setAvailableStock(true)
        setPricingDetails("N/A")  
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

            setCheckoutStatus("pending")
            var response = await fetch('/stripe/renew', {
                method:'post',
                body:JSON.stringify({
                    paymentMethod:paymentMethod
                }),
                "headers": {
                    "Content-Type": "application/json"
                }
            })
            if(response.ok) {
                if(response.status == 200) {
                    setCheckoutStatus("success")
                    //setKey(await response.json().key)
                }
                else setCheckoutStatus("failed")

            } else {

                setCheckoutStatus("failed")
            }
        }
    };


    return (
        <div className="w-full text-center">
            {availableStock ? <form onSubmit={handleSubmit}>

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

                <p className="text-xs text-gray-400 font-medium select-none">{pricingDetails}</p>

                {
                    checkoutStatus == "idle" ? <button type="submit" disabled={!stripe} className="duration-150 transform hover:scale-105 motion-reduce:transform-none font-medium text-md rounded-md text-white bg-other-900 p-2 px-5 text-center mt-12">Renew Now</button> : 
                    checkoutStatus == "failed" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-red-500 p-2 px-5 text-center mt-12">Checkout Failed</button> :
                    checkoutStatus == "success" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-green-500 p-2 px-5 text-center mt-12">Renewed</button> : 
                    checkoutStatus == "pending" ? <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-yellow-500 p-2 px-5 text-center mt-12"><BeatLoader color={'#ffffff'} loading={true} size={10} /> </button> :
                    <button type="submit" disabled={!stripe} className="font-medium text-md rounded-md text-white bg-blue-500 p-2 px-5 text-center mt-12">Renew Now</button>     
                }

                </form> : <button type="submit" className="font-medium text-md rounded-md text-white bg-red-500 p-2 px-5 text-center mt-12">Error</button>

            }
        </div>
            
    );
};


const Checkout = () => (
  <Elements stripe={loadStripe(process.env.REACT_APP_STRIPE_PUBLIC)}>
    <CheckoutForm />
  </Elements>
);

export default Checkout