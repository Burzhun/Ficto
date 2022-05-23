import React, {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BrowserRouter as Router} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {endpoints} from './api';
import {useHttp} from './hooks/http.hook';
import {login, logout} from './Redux/actions/auth.actions';
import {useRoutes} from './Routes/Routes';

type State = {
    auth: { isAuth: boolean };
};

const App: FC = () => {
    const isAuth = useSelector((state: State) => state.auth.isAuth);
    const routes = useRoutes(isAuth);
    const {request} = useHttp();
    const dispatch = useDispatch();


    useEffect(() => {
        const token = localStorage.getItem('userToken') || '';

        async function checkAuth(token: string) {
            try {
                const data = await request(`${endpoints.currentUser()}`, 'GET', null, {
                    Authorization: `Bearer ${token}`,
                });
                dispatch(
                    login(token, data.payload.observer, data.payload.organizationCard)
                );
            } catch (e) {
                localStorage.removeItem('userToken');
                dispatch(logout());
            }
        }

        checkAuth(token).catch((e: ErrorEvent) => e);
    }, [dispatch, request]);

    return (
        <Router>
            <ToastContainer/>
            {routes}
        </Router>
    );
};

export default App;
