import {Elements} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useCallback, useEffect, useState } from 'react'
import api from '../utils/api/axios'
import { decodeToken } from 'react-jwt'
import CheckoutForm