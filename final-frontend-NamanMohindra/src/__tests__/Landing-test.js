import React from 'react';
import { mount} from 'enzyme';

import Landing from "../Landing/landing";
import Login from "../Landing/landing"
import Register from "../Landing/landing";
import {Provider} from "react-redux";
import { createStore } from "redux";
import {Instabook} from "../reducers";
const store = createStore(Instabook);

describe('Landing Component', () => {
    // make our assertion and what we expect to happen
    // Ensuring that on Landing page both Login and Register Components are rendered
    it('should render without throwing an error', () => {
        const wrapper = mount(<Provider store={store} > <Landing /> </Provider> )
        expect(wrapper.containsMatchingElement(<Login/>)).toEqual(true);
        expect(wrapper.containsMatchingElement(<Register/>)).toEqual(true);

    })
})