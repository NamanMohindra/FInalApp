import React from 'react';

import {shallow} from 'enzyme';
import Login from "../Landing/Login";
import {Instabook} from "../reducers";
import {setUser} from "../actions";

jest.setTimeout(5000)

describe('Login component test', ()=> {
    const wrapper = shallow(<Login />);
    it('should have a login button', ()=> {
        //There should be only one button
        expect(wrapper.find('button')).toHaveLength(1);
        //Button should have matching text
        expect(wrapper.find('button').text()).toEqual('Login');
    });

    it('should have input for username and password', ()=> {
        //Email and password input field should be present
        expect(wrapper.find('input#username')).toHaveLength(1);
        expect(wrapper.find('input#password')).toHaveLength(1);
    });

     it('should have an empty username and password state initially', ()=> {
        //Optionally test to check if password and email are empty strings on setup
        expect(wrapper.state('username')).toEqual('');
        expect(wrapper.state('password')).toEqual('');
    });

    it ("login check", () =>{
        wrapper.find('input#username').simulate('change', {target:{
                name:'username', value: 'Bret'}})
        wrapper.find('input#password').simulate('change', {target:{
                name:'password', value: 'Kulas Light'}})

        const preventDefault = jest.fn();
        wrapper.find('button').simulate('click', {preventDefault})
        const initialState = {
            userId: 0,
            username: '',
            following: [],
            followingImgs: [],
            followingStatus: [],
            followingNames: [],
            followingUserNames: [],
        }
        expect (Instabook(initialState,setUser(1,'Bret'))).toEqual({
            userId: 1,
            username: 'Bret',
            following: [],
            followingImgs: [],
            followingStatus: [],
            followingNames: [],
            followingUserNames: [],
        })
        expect(wrapper.state('showError')).toEqual(false)
    });
    // login and username value not entered
    it ("login fail", () =>{
        const preventDefault = jest.fn()
        wrapper.find('input#username').simulate('change', {target:{
                name:'username', value: ''}})
        wrapper.find('input#password').simulate('change', {target:{
                name:'password', value: ''
            }})
        wrapper.find('button').simulate('click',{preventDefault});
        wrapper.update();//if you are setting state
        expect(wrapper.state('showError')).toEqual(true)
    });
    // entering with an incorrect password
    it ("incorrect username", done => {
        const preventDefault = jest.fn()
        wrapper.find('input#username').simulate('change', {
            target: {
                name: 'username', value: 'Naman'
            }
        })
        wrapper.find('input#password').simulate('change', {
            target: {
                name: 'password', value: 'passphrase'
            }
        })
        wrapper.find('button').simulate('click', {preventDefault});
        setTimeout(() => {
            wrapper.update();
            expect(wrapper.state('errorMessage')).toEqual('Username and password do not match')
            expect(wrapper.state('showError')).toEqual(true)
            done()
        }, 2000);

    })

    // entering an incorrect password
    it ("incorrect password", done => {
        const preventDefault = jest.fn()
        wrapper.find('input#username').simulate('change', {
            target: {
                name: 'username', value: 'Bret'
            }
        })

        wrapper.find('input#password').simulate('change', {
            target: {
                name: 'password', value: 'Kulas'
            }
        })
        wrapper.find('button').simulate('click', {preventDefault});
        setTimeout(() => {
                wrapper.update();
                expect(wrapper.state('errorMessage')).toEqual('Username and password do not match')
                expect(wrapper.state('showError')).toEqual(true)
                done()
        }, 2000);

    })


    // entering no values
    it ("should not be empty", () => {
        const preventDefault = jest.fn()
        wrapper.find('input#username').simulate('change', {
            target: {
                name: 'username', value: ''
            }
        })
        wrapper.find('input#password').simulate('change', {
            target: {
                name: 'password', value: ''
            }
        })

        wrapper.find('button#login').simulate('click', {preventDefault});
        expect(wrapper.state('errorMessage')).toEqual('Username and password fields should not be empty')
        expect(wrapper.state('showError')).toEqual(true)

    })


});