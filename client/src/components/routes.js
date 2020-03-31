import React from 'react';
import { Switch } from 'react-router-dom';

import { PrivateRoute } from '../_helpers/PrivateRoute';
import { CustomRoute } from '../_helpers/CustomRoute';

import home from './home';
import forgetPassword from './forget-password';
import login from './login';
import register from './register';
import { dashboardView }  from './dashboard';
import { profileEdit, profileView, profileImage, profilePhotos }  from './profile';
import { postEdit, postView, postsView }  from './post';
import page404 from './404';
import comingsoon from './coming-soon';

export default function Routes({ setBannerTop, setBannerText }) {
    return (
        <Switch>
                <CustomRoute exact path='/' component={home} setBannerTop={setBannerTop} setBannerText={setBannerText} />
                <CustomRoute exact path='/login' component={login} setBannerTop={setBannerTop} setBannerText={setBannerText} title='Login' /> 
                <CustomRoute exact path='/forgetpassword' component={forgetPassword} setBannerText={setBannerText} />
                <CustomRoute exact path='/register' component={register} setBannerText={setBannerText} />                
                
                <PrivateRoute exact path='/city/:city' component={dashboardView} setBannerTop={setBannerTop} setBannerText={setBannerText} />
                <PrivateRoute exact path='/state/:state' component={dashboardView} setBannerTop={setBannerTop} setBannerText={setBannerText} />
                <PrivateRoute exact path='/country/:country' component={dashboardView} setBannerTop={setBannerTop} setBannerText={setBannerText} />             
                <PrivateRoute exact path='/:username' component={postsView} setBannerTop={setBannerTop} setBannerText={setBannerText} title='' />
                <PrivateRoute exact path='/profile/:username' component={profileView} setBannerTop={setBannerTop} setBannerText={setBannerText} title='Profile' />   
                
                <PrivateRoute exact path='/profile/photos/:username' component={profilePhotos} setBannerTop={setBannerTop} setBannerText={setBannerText} title='Photos' />
                <PrivateRoute exact path='/profile/edit/:userId' component={profileEdit} setBannerTop={setBannerTop} setBannerText={setBannerText} title='Profile Update' />
                <PrivateRoute exact path='/profile/image/:userId' component={profileImage} setBannerTop={setBannerTop} setBannerText={setBannerText} title='Profile Image' />
                
                <PrivateRoute exact path='/post/:username' component={postView} setBannerTop={setBannerTop} setBannerText={setBannerText} />
                <PrivateRoute exact path='/post/edit/:userId' component={postEdit} setBannerTop={setBannerTop} setBannerText={setBannerText} />

                <CustomRoute exact path='/eat' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/shop' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/places' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/connect' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/learn' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/spiritual' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/share' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/hui' component={comingsoon} setBannerText={setBannerText} />
                <CustomRoute exact path='/cooking' component={comingsoon} setBannerText={setBannerText} />

                <CustomRoute exact path='/404' component={page404} setBannerText={setBannerText} />
                <CustomRoute exact path='/404:message' component={page404} setBannerText={setBannerText} />
                <CustomRoute component={page404} setBannerText={setBannerText} />
        </Switch>
    );
}
