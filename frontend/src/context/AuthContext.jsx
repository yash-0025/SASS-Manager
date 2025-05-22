// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { decodeToken } from "react-jwt";

// const AuthContext = createContext();

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// export const AuthProvider = ({ children }) => {
//     const [isLogin, setIsLogin] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [isSuperAdmin, setIsSuperAdmin] = useState(false);
//     const [name, setName] = useState('');
//     const [loading, setLoading] = useState(true);

//     const checkAuthStatus = () => {
//         const token = sessionStorage.getItem('access-token');
//         if (token) {
//             try {
//                 const data = decodeToken(token);
//                 if (data && !isTokenExpired(data)) {
//                     setIsLogin(true);
//                     setIsAdmin(data.isAdmin || false);
//                     setIsSuperAdmin(data.isSuperAdmin || false);
//                     setName(data.name || '');
//                 } else {
//                     // Token expired or invalid
//                     logout();
//                 }
//             } catch (error) {
//                 console.error('Error decoding token:', error);
//                 logout();
//             }
//         } else {
//             logout();
//         }
//         setLoading(false);
//     };

//     const isTokenExpired = (decodedToken) => {
//         if (!decodedToken.exp) return false;
//         const currentTime = Date.now() / 1000;
//         return decodedToken.exp < currentTime;
//     };

//     const login = (token) => {
//         sessionStorage.setItem('access-token', token);
//         checkAuthStatus();
//     };

//     const logout = () => {
//         sessionStorage.removeItem('access-token');
//         setIsLogin(false);
//         setIsAdmin(false);
//         setIsSuperAdmin(false);
//         setName('');
//     };

//     useEffect(() => {
//         checkAuthStatus();
//     }, []);

//     const value = {
//         isLogin,
//         isAdmin,
//         isSuperAdmin,
//         name,
//         loading,
//         login,
//         logout,
//         checkAuthStatus
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { decodeToken } from "react-jwt";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);

    const isTokenExpired = useCallback((decodedToken) => {
        if (!decodedToken.exp) return true;
        const currentTime = Date.now() / 1000;
        return decodedToken.exp < currentTime;
    }, []);

    const checkAuthStatus = useCallback(() => {
        const token = sessionStorage.getItem('access-token');
        if (token) {
            try {
                const data = decodeToken(token);
                if (data && !isTokenExpired(data)) {
                    setIsLogin(true);
                    setIsAdmin(data.isAdmin || false);
                    setIsSuperAdmin(data.isSuperAdmin || false);
                    setName(data.name || '');
                } else {
                    logout();
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                logout();
            }
        } else {
            logout();
        }
        setLoading(false);
    }, [isTokenExpired]);

    const login = useCallback(async (token) => {
        sessionStorage.setItem('access-token', token);
        checkAuthStatus();
    }, [checkAuthStatus]);

    const logout = useCallback(() => {
        sessionStorage.removeItem('access-token');
        setIsLogin(false);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        setName('');
    }, []);

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const value = {
        isLogin,
        isAdmin,
        isSuperAdmin,
        name,
        loading,
        login,
        logout,
        checkAuthStatus
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};