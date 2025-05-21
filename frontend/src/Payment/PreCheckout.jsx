import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useEffect, useState } from 'react'
import api from '../utils/api/axios'
import { decodeToken } from 'react-jwt'
import CheckoutForm from './CheckoutForm'
import { useLocation } from 'react-router-dom'
const stripePromise = loadStripe('pk_test_51RQUFJFvVybNONbJGDvIcdrzoGMQVZbzMIuFIjjgO2oXd38MfronGM879bWlWklf7L5MqENP6YcYa1TMxwQcvbTC00lARQFcVl')


export default function PreCheckout() {

    const location = useLocation()
    const [options, setOption] = useState({
        clientSecret: null,
    })
    useCallback(useEffect(() => {
        const fetchClient = async() => {
            const AccessToken = decodeToken(sessionStorage.getItem('access-token'))

            const customer = await api.post('/api/payment/create-customer', {
                email: AccessToken.email, name: AccessToken.name
            })
            if(!customer){
                return;
            }

            const res = await api.post('/api/payment/create-subscription', {
                customerId: customer.data.customerId, priceId: location.state
            })
            if(!res) {
                return
            }
            setOption({clientSecret: res.data.clientSecret})
        }
        fetchClient()
    }, [setOption]), [])
    return (
        <>
            {options.clientSecret ? <Elements stripe={stripePromise} options={options}>
                <CheckoutForm />
            </Elements> : <></>}
        </>
    )
}