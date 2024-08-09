import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import React from 'react';

import { BrowserRouter, Route, Switch } from 'react-router-dom';


export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login}/>
                <Route path="/home/:user/:position" component={Home}/>
            </Switch>
        </BrowserRouter>
    )
}