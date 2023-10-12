import react from 'react';
import Head from 'next/head';

import Header from '../inc/component/common/Header';
import Footer from '../inc/component/common/Footer';
import Login from '../inc/component/common/Login';
import { withRouter } from 'next/router';
import EditProfile from '../inc/component/private/EditProfile';




class Profile extends react.Component{
  
  constructor(props){
    super(props);
    this.state = {}
  }

  async componentDidMount(){
    setTimeout(async ()=>{
      this.user = {};
      this.user.account = this.props.app.helper.user;
      if(this.user.account !== null){
        this.user.profile = await this.props.app.db('GET','findone','profile', {_id: this.user.account.uid});
        if(this.user.profile.data !== undefined ){
          this.user.profile = this.user.profile.data
        }
      }
      
      this.setState({
        user: this.user
      })
    }, 1000);
  }
  
  render() {
    return <>
    
    {
      this.state.user !== undefined &&
      <>
      <Header {...this.props} user={this.state.user} />
      {
        this.state.user.account === null ? 
        <Login {...this.props} user={this.state.user} /> :
        <EditProfile {...this.props}  user={this.state.user} />
      }
      <Footer {...this.props} user={this.state.user} />
      </>
    }
    
    
    
    </>;
  }
}

export default withRouter(Profile);