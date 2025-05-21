// import axios from "axios"


// const api = axios.create({
//     baseURL: import.meta.env.VITE_BACKEND_URL
// })
// console.log(baseURL)


// export default api;

import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Verify backend URL is properly set
console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);

export default api;