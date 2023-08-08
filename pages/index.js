import react from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Header from '../inc/component/common/Header';
import Footer from '../inc/component/common/Footer';



export default class Home extends react.Component{
  constructor(props){
    super(props);
   
    console.log(this.props)
  }
  
  render() {
    return <>
    <Header {...this.props} />
    <main></main>
    <Footer {...this.props} />
    </>;
  }
}
