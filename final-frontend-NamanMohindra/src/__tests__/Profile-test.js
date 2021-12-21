import React from 'react';

import { mount} from 'enzyme';


import Profile from "../Profile/profile";
import {Provider} from "react-redux";
import {BrowserRouter as Router} from "react-router-dom";

import {createStore} from "redux";
import {Instabook} from "../reducers";
import Post from "../Main/post";

const store = createStore(Instabook);
jest.setTimeout(4000)

const fakeLocalStorage = (function() {
    let store = {};
    return {
        getItem: function(key) {
            return store[key] || null;
        },
        setItem: function(key, value) {
            store[key] = value;
        },
        removeItem: function(key) {
            delete store[key];
        },
        clear: function() {
            store = {};
        }
    };
})();

function saveToStorage(key,value) {
    window.localStorage.setItem(key, value);
}
Object.defineProperty(window, 'localStorage', {
    value: fakeLocalStorage
});


describe('Login component test', ()=> {
    saveToStorage('userId',1)
    saveToStorage('username','Bret')
    const wrapper = mount(<Provider store={store} >
        <Router>
            <Profile/>
        </Router>
    </Provider>)
    // Check for logout function
    it('should have a logout button', ()=> {
        expect(wrapper.find('Profile').find('Link#logout')).toHaveLength(1)
        //Button should have matching text
        expect(wrapper.find('Profile').find('Link#logout').text()).toEqual('Logout');
        expect(wrapper.find('Profile').find('button#update')).toHaveLength(1)

    });

    it('should call function when update clicked', ()=> {
        const instance = wrapper.find('Profile').instance()
        const spy = jest.spyOn(instance, 'update')
        instance.forceUpdate();
        const preventDefault = jest.fn();
        wrapper.find('Profile').find('button#update').simulate('click',{preventDefault})
        expect(spy).toHaveBeenCalled()
    });

    it ("update input username", () => {
        wrapper.find('Profile').find('input#updatedName').simulate('change', {
            target: {
                value: 'Naman'
            }
        })
        wrapper.find('Profile').find('button#update').simulate('click', { preventDefault: () => {} })
        wrapper.find('Profile').update()
        expect(wrapper.find('Profile').state('name')).toEqual('Naman')

    })
    it ("update email", () => {
        const preventDefault = jest.fn()
        wrapper.find('Profile').find('input#updatedEmail').simulate('change', {
            target: {
                value: 'naman897@gmail.com'
            }
        })

        wrapper.find('Profile').find('button#update').simulate('click', {preventDefault})
        wrapper.find('Profile').update()
        expect(wrapper.find('Profile').state('email')).toEqual('naman897@gmail.com')
    })
    it ("update phone", () => {
        const preventDefault = jest.fn()
        wrapper.find('Profile').find('input#updatedPhone').simulate('change', {
            target: {
                value: '983922'
            }
        })
        wrapper.find('Profile').find('button#update').simulate('click', {preventDefault})
        wrapper.find('Profile').update()
        expect(wrapper.find('Profile').state('phone')).toEqual('983922')
    })
    it ("update zip", () => {
        const preventDefault = jest.fn()
        wrapper.find('Profile').find('input#updatedZip').simulate('change', {
            target: {
                value: '98765'
            }
        })
        wrapper.find('Profile').find('button#update').simulate('click', {preventDefault})
        wrapper.find('Profile').update()
        expect(wrapper.find('Profile').state('zip')).toEqual('98765')
    })

    it ("clear inputs", () => {
        wrapper.find('Profile').find('input#updatedName').simulate('change', {
            target: {
                value: 'Naman'
            }
        })
        wrapper.find('Profile').find('input#updatedEmail').simulate('change', {
            target: {
                value: 'naman897@gmail.com'
            }
        })
        wrapper.find('Profile').find('input#updatedPhone').simulate('change', {
            target: {
                value: '98765'
            }
        })
        wrapper.find('Profile').find('input#clear').simulate('click')
        wrapper.find('Profile').update()
        expect(wrapper.find('Profile').state('name')).toEqual('')
        expect(wrapper.find('Profile').state('phone')).toEqual('')
        expect(wrapper.find('Profile').state('email')).toEqual('')
    })




    it(`should fetch the user's profile username`, ()=> {
        wrapper.find('Profile').setState({ sName: localStorage.getItem('username')});
        expect(wrapper.find('Profile').find('span#username').text()).toEqual('Bret')

        expect(wrapper.find('Profile').state('username')).toEqual('Bret')
    })

    it('should load user info', done => {
        const wrapper1 = mount(<Provider store={store} >
            <Router>
                <Profile />
            </Router>
        </Provider> )
        const instance = wrapper1.find('Profile').instance();
        instance.componentDidMount();
        setTimeout(() =>{
            wrapper1.find('Profile').update();
            expect(wrapper1.find('Profile').find('div#info').children().length).toEqual(6)
            done()
        }, 3000);
    });


    it('logout', done => {
        const wrapper5 = mount(<Provider store={store} >
            <Router>
                <Profile />
            </Router>
        </Provider> )

        wrapper5.find('Profile').find('Link#logout').simulate('click')
        expect(parseInt(window.localStorage.getItem('userId'))).toEqual(0);
        expect(window.localStorage.getItem('username')).toEqual(null);
        done()
    })
    //
    // it('comments shown', done => {
    //     const props1={
    //         img : "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-baby-animals-1558535060.jpg",
    //         username: 'Bret',
    //         time : 1,
    //         postid:1,
    //         post: 1,
    //
    //     }
    //     const wrap6 = mount(
    //         <Post {...props1}/>)
    //
    //     wrap6.find('button#show').simulate('click')
    //     wrap6.update()
    //     setTimeout(() => {
    //         console.log(wrap6.find('.input-group').find('div#com').children().length)
    //
    //         expect(wrap6.find('.input-group').find('div').children().length).toEqual(5)
    //         done()
    //     },3000)
    //
    //
    // })
})
