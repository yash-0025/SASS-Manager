import { Outlet, Navigate, useRoutes } from "react-router-dom";
import UserLayout from "../Layouts/UserLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import Home from "../Pages/Home";
import Plans from "../Pages/Plans";
import Cart from "../Pages/Cart";
import SignUp from "../Pages/Signup";
import Login from "../Pages/Login";

import PreCheckout from "../Payment/PreCheckout";
import Success from "../Payment/Success";
import Users from "../Dashboard/Users";
import Services from "../Dashboard/Services";
import UserDetails from "../Dashboard/Forms/UserForm"
import ServiceDetails from "../Dashboard/Forms/ServiceForm"
import NewUserForm from "../Dashboard/Forms/NewUserForm"
import NewServiceForm from '../Dashboard/Forms/NewServiceForm'


export default function Router() {
    const routes = useRoutes([
        {
            path: "/",
            element: (
                <UserLayout>
                <Outlet />
                </UserLayout>
            ),
            children: [
                {element: <Navigate to="/home" />, index:true},
                {path: '/home', element:<Home />},
                {path:'/plans/:service', element:<Plans />},
                {path:"/cart",element:<Cart />},
            ]
        },
        {path:"/login",element:<Login />},
        {path:"signup",element:<SignUp />},
        {path:"/checkout", element: <PreCheckout />},
        {path:"/success", element:<Success />},
        {
            path:"dashboard", element: (
                <DashboardLayout>
                <Outlet />
                </DashboardLayout>
            ),
            children: [
                {element: <Navigate to="/dashboard/users" />, index:true},
                {path: 'users',
                    children:[
                        {element:<Users />,index:true},
                        {path: 'new', element:<NewUserForm />}
                    ]
                },
                {path: 'servies', children:[
                    {element: <Services />, index:true},
                    {path:'new', element:<NewServiceForm />}
                ]},
                {path:'userdetail', element:<UserDetails />},
                {path:'servicedetail', element:<ServiceDetails />}
            ]
        }

    ])
    return routes
}

