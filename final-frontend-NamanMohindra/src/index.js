import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import {Provider} from "react-redux";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from "./Landing/landing";
import Main from "./Main/main";
import Profile from "./Profile/profile";
import LoginWithGoogle from "./Landing/LoginWithGoogle";
import "./App.css"
import { createStore } from "redux";
import { Instabook } from "./reducers";

const store = createStore(Instabook);


ReactDOM.render(
    <React.StrictMode>
        <Provider store={ store }>
            <Router>
                <Switch>
                    <Route path={"/main"} component={Main}>
                    </Route>
                    <Route path={"/LoginWithGoogle/:id"} component={LoginWithGoogle}>
                        </Route>
                    <Route path={"/profile"} component={Profile}>
                    </Route>
                    <Route exact path={"/"} component={Landing}>
                    </Route>
                    
                </Switch>
            </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
