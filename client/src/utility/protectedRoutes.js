import React from 'react'
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        
        let cookies = (document.cookie).split('; ');
        let sid = cookies[0].split('=')[0];

        if(sid && (this.props.path === '/authorization' || this.props.path === '/create_account')){
            return <Redirect to={{ pathname: '/today' }} />
        } else if(sid && (this.props.path !== '/authorization' || this.props.path !== '/create_account')) {
            return <Component />
        } else if(!sid && (this.props.path === '/authorization' || this.props.path === '/create_account')){
            return <Component />
        } else if(!sid && (this.props.path !== '/authorization' || this.props.path !== '/create_account')){
            return <Redirect to={{ pathname: '/authorization' }} />
        }
    }
}

export default ProtectedRoute;