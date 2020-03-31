import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, title: Title, setBannerTop: SetBannerTop, setBannerText: SetBannerText, ...rest }) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} title={Title} setBannerTop={SetBannerTop} setBannerText={SetBannerText} />
            : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    )} />
)