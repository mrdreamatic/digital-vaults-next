import React from "react";
import client from "../../client";

export default class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lwp: false,
            lw: 'passwordless',
            resp: {}
        }
        
        console.log(this.props);
    }

    async componentDidMount(){
       await this.VerifyPasswordLess();
    }

    VerifyPasswordLess = async () => {
        const qry = this.props.app.helper !== undefined ? this.props.app.helper._query() : {};
        if(qry.mode !== undefined && qry.mode === 'signIn' && this.props.app.helper.user === null){
            await this.props.app.VerifyPasswordLess(this.props.app.helper.user).then(async (res)=> {
            console.log(res);
            window.localStorage.removeItem('emailForSignIn');
            window.location.reload();
          })
        }
    }

    formObject = (target) => {
        let form = {};
        for (let i = 0; i < target.length; i++) {
            if(target.elements[i].getAttribute("name") !== null){
                form[target.elements[i].getAttribute("name")] = target.elements[i].value; 
            }
        }
        return form;
    }

    response = (resp) => {
        return <div className={'alert alert-' + resp.type}>
            {resp.msg}
        </div>
    }

    login = async(e) => {
        e.preventDefault();
        let form = this.formObject(e.target);
        let resp;
        try{
        resp = await this.props.app.signIn(form, this.state.lw); 
        resp = {
            type: "success",
            msg: resp
        }
        }catch(ex){
            resp = {
                type: "danger",
                msg: ex.message
            }
        }
        this.setState({
            resp: resp
        })
        console.log(resp);
    }

    render(){
        return(
            <div className="login-container">
                <div className="login-response">{this.response(this.state.resp)}</div>
                <div className="login-form box-shadow">
                    <form onSubmit={this.login}>
                        <div className="row">
                            <div className="col-12">
                                <input type="email" name="email" id="email" placeholder="Enter your email address" className="form-control" required />
                            </div>
                            <div className="col-12 pb-2">
                                <div className="form-check form-switch text-start text-left">
                                    <input className="form-check-input" type="checkbox" role="switch" id="loginwithpassword" onChange={()=>{
                                        this.setState({
                                            lw: this.state.lwp ? 'passwordless' : 'password',
                                            lwp: !this.state.lwp,
                                        })
                                    }} />
                                        <label className="form-check-label" htmlFor="loginwithpassword">Login With Password</label>
                                </div>
                            </div>{
                                this.state.lwp &&     
                                <div className="col-12 pb-2">
                                    <input type="password" name="pwd" id="pwd" placeholder="Enter your account password" required className="form-control" />
                                </div>
                            }
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-5">
                                        <button className="btn btn-primary btn-sm" type="submit">Login / Register</button>
                                    </div>
                                    <div className="col-7 align-self-center text-right text-end">
                                        <button type="button" className="btn btn-sm btn-transparent text-white">Send Password Reset Link</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="login-box" style={{width:"72%"}}>
                <hr />
                OR<br />
                <button onClick={async ()=>{
                    let resp = await this.props.app.signIn({}, 'google');
                    console.log(resp);
                }} className="btn bg-light p-1 box-shadow" type="button">
                    <img className=" box-shadow" src={this.props.app.helper.siteUrl + '/lwgoogle.png'} style={{maxWidth:"180px"}} alt="Login with Google" />
                </button>
                </div>
            </div>
        )
    }
}