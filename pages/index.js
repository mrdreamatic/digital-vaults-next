import react from 'react';
import Head from 'next/head';

import Header from '../inc/component/common/Header';
import Footer from '../inc/component/common/Footer';
import Index from '../inc/component/private/Home';
import { withRouter } from 'next/router';




class Home extends react.Component{
  
  constructor(props){
    super(props);
    this.state = {}
  }

  async componentDidMount(){
    setTimeout(async ()=>{
      await this.checkUser();
    }, 1500);
  }

  checkUser = async () => {
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
    });
  }
  
  render() {
    return <>
    
    {
      this.state.user !== undefined &&
      <>
      <Header {...this.props} user={this.state.user} />
      <Index {...this.props}  user={this.state.user} checkUser={this.checkUser} />
      <Footer {...this.props} user={this.state.user} />
      </>
    }
    
    
    
    </>;
  }
}

export default withRouter(Home);