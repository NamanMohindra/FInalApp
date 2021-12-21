import React from 'react';

import {shallow} from 'enzyme';
import Register from "../Landing/register";



describe('Register component test', ()=> {
    const wrapper = shallow(<Register/>);
    it('should have a Submit button', () => {
        //There should be only one button
        expect(wrapper.find('button#submit')).toHaveLength(1);
        //Button should have matching text
        expect(wrapper.find('button#submit').text()).toEqual('Submit');
    });

    it ("successful registration", () =>{
        wrapper.find('input#username').simulate('change', {target:{
                name:'username', value: 'Naman'}})
        wrapper.find('input#email').simulate('change', {target:{
                name:'email', value: 'naman897@gmail.com'}})
        wrapper.find('input#tel').simulate('change', {target:{
                name:'tel', value: '9812123'}})

        wrapper.find('input#dname').simulate('change', {target:{
                name:'dname', value: 'Klaup'}})

        wrapper.find('input#pwd').simulate('change', {target:{
                name:'pwd', value: 'newpass'}})
        wrapper.find('input#pwd2').simulate('change', {target:{
                name:'pwd2', value: 'newpass'}})
        wrapper.find('input#zip').simulate('change', {target:{
                name:'zip', value: '12234'}})


        const preventDefault = jest.fn();
        wrapper.find('button').simulate('click', {preventDefault})

        expect(wrapper.state('username')).toEqual('Naman')
        expect(wrapper.state('email')).toEqual('naman897@gmail.com')
        expect(wrapper.state('displayName')).toEqual('Klaup')

    });

    it ("unsuccessful registration", () =>{
        wrapper.find('input#username').simulate('change', {target:{
                name:'username', value: '123'}})
        wrapper.find('input#email').simulate('change', {target:{
                name:'email', value: '897gmail.com'}})
        wrapper.find('input#tel').simulate('change', {target:{
                name:'tel', value: '9812123'}})

        wrapper.find('input#dname').simulate('change', {target:{
                name:'dname', value: '123'}})

        wrapper.find('input#pwd').simulate('change', {target:{
                name:'pwd', value: 'newpass'}})
        wrapper.find('input#pwd2').simulate('change', {target:{
                name:'pwd2', value: 'newpass1'}})
        wrapper.find('input#zip').simulate('change', {target:{
                name:'zip', value: 'ab234'}})


        const preventDefault = jest.fn();
        wrapper.find('button').simulate('click', {preventDefault})

        expect(wrapper.state('showError')).toEqual(true)

    });


})