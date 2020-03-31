import React from 'react';
import { Route } from 'react-router-dom';

export const CustomRoute = ({ component: Component, title: Title, setBannerTop: SetBannerTop, setBannerText: SetBannerText,  ...rest }) => (
    <Route {...rest} render={ props => ( <Component {...props} title={Title} setBannerTop={SetBannerTop} setBannerText={SetBannerText} />)} />
)