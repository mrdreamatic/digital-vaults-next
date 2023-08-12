import react from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../inc/component/common/Header';
import Footer from '../inc/component/common/Footer';
import Login from '../inc/component/common/Login';
import Index from '../inc/component/private/Home';



export default class Home extends react.Component{
  
  constructor(props){
    super(props);
    console.log(this.props);
    this.state = {
      user: undefined
    }
  }

  async componentDidMount(){
    setTimeout(()=>{
      this.setState({
        user: this.props.app.helper.user
      })
    }, 1000);
  }
  
  render() {
    return <>
    <Header {...this.props} />
    
    {
      this.props.app.helper.user === null ? 
      <Login {...this.props} /> :
      <Index {...this.props} />
    }
    
    <Footer {...this.props} />
    </>;
  }
}
