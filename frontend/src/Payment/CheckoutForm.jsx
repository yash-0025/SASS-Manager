import { Card, CardContent, Container } from '@mui/material'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import React from 'react'


const CheckoutForm = () => {

    const stripe = useStripe()
    const elements = useElements()

    const handleSubmit = async(event) => {
        event.preventDefault()
        if(!stripe || !elements){
            return
        }

        const result = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin+"/success",
            }
        })
        console.log(result)
    }

    co
    return (
        <Container component="main" maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Card sx={{ width: "100%", py: 5 }}>
                <CardContent>
                    <form>

                        <PaymentElement />
                        <Button disabled={!stripe} variant='contained' fullWidth onClick={handleSubmit}>Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    )
}

export default CheckoutForm
