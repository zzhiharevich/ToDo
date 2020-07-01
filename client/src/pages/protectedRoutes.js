import React from 'react'
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        
        let cookies = (document.cookie).split('; ');
        console.log(cookies);
        let sid = cookies[0].split('=')[0];

        console.log(sid);
        console.log(this.props.path);

        if(sid && (this.props.path === '/authorization' || this.props.path === '/create_account')){
            return <Redirect to={{ pathname: '/today' }} />
        } else if(sid && (this.props.path !== '/authorization' || this.props.path !== '/create_account')) {
            return <Component />
        } else if(!sid && (this.props.path === '/authorization' || this.props.path === '/create_account')){
            return <Component />
        } else if(!sid && (this.props.path !== '/authorization' || this.props.path !== '/create_account')){
            return <Redirect to={{ pathname: '/authorization' }} />
        }


       
        /*return sid ? (
            <Component />
        ) : (
            <Redirect to={{ pathname: '/authorization' }} />
        );*/
    }
}

export default ProtectedRoute;