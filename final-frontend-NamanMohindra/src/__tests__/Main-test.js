import React from 'react';

import { mount,shallow } from 'enzyme';

import Main  from "../Main/main";

import { BrowserRouter as Router } from 'react-router-dom';
import {Provider} from "react-redux";
import { createStore } from "redux";
import {Instabook} from "../reducers";
import Following from '../Main/main'
import Post from '../Main/main'
import User from '../Main/main'
import {setUser} from "../actions";

const store = createStore(Instabook);

jest.setTimeout(7000);
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

beforeEach(() => {
    jest.clearAllMocks();
});
describe('Login component test', ()=> {
    const props={
        userId: 1,
        username: 'Bret',
        following: [2,3,4],
        fNames: [],
        fUserNames: [],
        fImg: [],
        fStatus: [],
        setUser,
        history:[],
    }
    const wrapper = mount(<Provider store={store} >
        <Router>
        <Main {...props}/>
            </Router>
    </Provider> )
    // ensuring all the child components are rendered
    it('should render all the components on main page', ()=> {
        expect(wrapper.containsMatchingElement(<Following/>)).toEqual(true);
        expect(wrapper.containsMatchingElement(<Post/>)).toEqual(true);
        expect(wrapper.containsMatchingElement(<User/>)).toEqual(true);

    });

    // Ensuring 40 posts are shown for the registered users
    it('should show 40 posts for a user', done => {
        const wrapper1 = mount(<Provider store={store} >
            <Router>
                <Main {...props}/>
            </Router>
        </Provider> )
        // mocking local storage
        saveToStorage('userId',1)
        saveToStorage('username','Bret')

        //expect(window.localStorage.getItem('userId')).toEqual(1);
        //wrapper1.find('Main').setState({userId:1})
        //wrapper1.find('Main').setState({username:'Bret'})
        //wrapper1.find('Main').update();
        const instance = wrapper1.find('Main').instance(); // you assign your instance of the wrapper
        //jest.spyOn(instance, 'componentDidMount'); // You spy on the randomFunction
        instance.componentDidMount();
        //expect(instance.componentDidMount).toHaveBeenCalledTimes(1);
        setTimeout(() =>{
            wrapper1.find('Main').update();
            expect(wrapper1.find('Main').state('posts').length).toEqual(40)
            done()
        }, 3000);
    });

        //jest.runOnlyPendingTimers();

        //expect(wrapper1.find('Main').props()).toEqual(1)

        //jest.spyOn(instance, 'setPostData')
        //expect(instance.setPostData).toHaveBeenCalled()
        //expect(instance).toEqual(1);


        // setTimeout(() => {
        // expect(wrapper1.find('Main').state('posts')).toEqual('hi');},2000)


        //const component = wrapper.instance().state

        //expect(component).toEqual(1)
        //setPostData()

        //expect(wrapper.containsMatchingElement(<Post/>)).toEqual(true);
    //     //expect(wrapper.containsMatchingElement(<User/>)).toEqual(true);
    it('posts should increase after add follow', done => {


        const wrapper2 = mount(<Provider store={store} >
            <Router>
                <Main {...props}/>
            </Router>
        </Provider> )
        wrapper2.find('Main').find('input#followText').simulate('change', {
            target: {
                name: 'addFollowingText', value: 'Kamren'
            }
        })
        wrapper2.find('Main').find('#addFollow1').simulate('click')
        setTimeout(() => {
            wrapper2.update();

            expect(wrapper2.find('Main').state('posts').length).toBeGreaterThan(40)
            done()
        }, 3000);
        //expect(window.localStorage.getItem('userId')).toEqual(1);
        //wrapper1.find('Main').setState({userId:1})
        //wrapper1.find('Main').setState({username:'Bret'})
        //wrapper1.find('Main').update();
        //const instance = wrapper1.find('Main').instance();


    })
    //
    // it('posts search', done => {
    //     const wrapper2 = mount(<Provider store={store} >
    //         <Router>
    //             <Main {...props}/>
    //         </Router>
    //     </Provider> )
    //     wrapper2.find('Main').find('input#searchtext').simulate('change', {
    //         // target: {
    //         //     name: 'searchtext', value: 'Bret'
    //         // }
    //         target: { value: 'Bret' }
    //     })
    //     console.log(wrapper2.find('Main').find('input#searchtext').debug())
    //
    //     //expect(wrapper2.find('Main').state()).toEqual(1)
    //
    //     wrapper2.update();
    //     setTimeout(() => {
    //         console.log(wrapper2.find('Main').state())
    //         expect(wrapper2.find('Main').state('showPost').length).toBeLessThan( 40)
    //         done()
    //     }, 2000);
    //     //expect(window.localStorage.getItem('userId')).toEqual(1);
    //     //wrapper1.find('Main').setState({userId:1})
    //     //wrapper1.find('Main').setState({username:'Bret'})
    //     //wrapper1.find('Main').update();
    //     //const instance = wrapper1.find('Main').instance();
    //
    // })
    it('delete posts', done => {
        const wrap5 = mount(<Provider store={store} >
            <Router>
                <Main {...props}/>
            </Router>
        </Provider> )

        // simulating the deletion of follower Karianne
        wrap5.find('Main').find('li.pt-1').children().find('Following#Karianne').find('button#unfollowbtn').simulate('click')

        //expect(wrapper2.find('Main').state()).toEqual(1)
        wrap5.update();
        //wrapper2.find('Main').find('#addFollow1').simulate('click')
        setTimeout(() => {

            console.log(wrap5.find('Main').state('showPost').length)
            //expect(wrapper5.find('Main').props('following').length).toBeLessThan(40)
            done()
        }, 3000);
    })

    it('logout', done => {
        const wrapper5 = mount(<Provider store={store} >
            <Router>
                <Main {...props}/>
            </Router>
        </Provider> )

        wrapper5.find('Main').find('Link#logout').simulate('click')
        expect(parseInt(window.localStorage.getItem('userId'))).toEqual(0);
        expect(window.localStorage.getItem('username')).toEqual(null);

        done()
    })

    it('update status', done => {

        const wrap6 = mount(<Provider store={store} >
            <Router>
                <Main {...props}/>
            </Router>
        </Provider> )

        wrap6.find('Main').find('User').find('input#statusInput').simulate('change',{
            target:{
                value:'hi'
            }
        })
        wrap6.find('Main').find('User').find('button#statusUpdate').simulate('click')
        wrap6.find('Main').find('User').update()
        expect(wrap6.find('Main').find('User').state('statusText')).toEqual('hi');
        done()
    })




})