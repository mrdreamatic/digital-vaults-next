import react from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';



export default class Home extends react.Component{
  constructor(props){
    super(props);
   
    console.log(this.props)
  }
  
  render() {
    return <>
    {this.props.loader}
    </>;
  }
}
