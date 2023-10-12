import React from "react";

import country from "./countries.json";

export default class Profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
        this.data = {};
        this.state = {
            data: this.data,
            loaded: false,
            profile: {}
        }
        this.country = country
        
        //console.log(country)
        console.log(this.props.app.helper.user);
    }

    shouldComponentUpdate = () => false


    componentDidMount(){
        if(!this.state.loaded){
            this.country = country;
        }
        let profile = this.props.user.profile !== undefined ? this.props.user.profile : {};
        console.log(this.props.user)
        this.setState({
            loaded: true,
            profile: profile
        },()=>{
            

        });
        console.log(this.state.data);
        this._updateModel(profile);
    }


    getModel = (name, def = '') => {
        this.data = this.state.data === null ? {} : this.state.data;
        return this.data[name] !== undefined && this.data[name] !== null ? this.data[name] : def;
    }

    _updateModel = (obj = {}) => {
        let data = this.state.data === null ? {} : this.state.data;
        
        if(typeof(obj) === 'object' && obj !== null){
            Object.entries(obj).forEach((x)=>{
                data[x[0]] = x[1];
            })
            console.log(data);
            this.setState({
                data: data
            })
        }
    }

    updateModel = async (e) => {
        console.log(e.target.value)
        let data = this.state.data === null ? {} : this.state.data;
       let type = !e.ele && e.ele !== undefined ? e.type : e.target.getAttribute('type');
       let name = !e.ele && e.ele !== undefined ? e.name : e.target.getAttribute('name');
       if(e.ele === undefined){
        this.setState({
            changed: true
        })
       }
       if(type === 'checkbox'){
        let checked = [];
        if(data[name] === undefined || !Array.isArray(data[name])){
            checked = [];
        }else{
            data[name].push(e.target.value);
            checked = [...new Set(data[name])];
            checked = !e.target.checked ? checked.filter(x => x !== e.target.value) : checked;
        }
        console.log(checked.map((x)=>{
            return e.target.checked ? x + " >>> Checked" : x;
        }))
        console.log(name, e.target.checked)
        data[name] = checked;
       
       }else{
            data[name] = e.target.value;
       }
        console.log(data);
        this.setState({
            data: data
        }, ()=>{
            this.forceUpdate();
        });
        
        //console.log(data)
        
    }

    saveForm = async (e) => {
        e.preventDefault();
        let params = this.props.app.helper.formObject(e.target);
        params = {...params, ...{"_id": this.props.app.helper.user.uid}}
        let resp = await this.props.app.dbset("profile","profile",params);
        if(resp.code === 200){
            alert('Profile Saved!');
            await this.props.checkUser();
            await this.props.checkUserData();
        }
        
    }

    render(){
        let code;
        if(this.getModel('country') !== ''){

            code = JSON.parse(this.getModel('country')).iso;
        }
       return <div className="card">
       
            <form className="card-body" onSubmit={this.saveForm}>
            <div className="form-group">
                <h6>Email Address {this.props.app.helper.user.emailVerified ? <span className="text-success"><i className="fa-solid fa-circle-check"></i></span> : <span className="text-danger">Verify</span>}</h6>
                <input type="email" id={`email`} name={`email`} onChange={this.updateModel} defaultValue={this.props.app.helper.user.email} className="form-control" placeholder="Your email address" readOnly />
                
                <div className="p-2"></div>
            </div>
            
           {
             
            <div className="form-group">
                <h6>Your country</h6>
                <select id={`country`} required name={`country`} onChange={this.updateModel} className="form-control" value={this.getModel['country']}>
                <option value={''}>Select your country</option>
                {
                    this.country.map((v, i)=>{
                        //console.log(v);
                        return <option key={i} value={JSON.stringify(v)}>{v.name}</option>
                    })
                }
                </select>
                <div className="p-2"></div>
            </div>
           }
            <div className="form-group">
                <h6>Your Mobile Number</h6>
                <div class="input-group mb-3">
                    {
                        this.getModel('country') !== '' &&
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="mobile"><img alt={code} src={`https://flagsapi.com/${code}/shiny/24.png`} />
                            </span>
                        </div>
                    }
                    
                    <input type="text" required minLength={4} maxLength={20} id={`mobile`} name={`mobile`} onChange={this.updateModel}  value={this.getModel['mobile']} className="form-control" placeholder="Your mobile number" />
                </div>
            </div>
            <div className="form-group">
                <h6>Your Name</h6>
                <input type="text" id={`name`} name={`name`} onChange={this.updateModel} defaultValue={this.props.app.helper.user.displayName} required className="form-control" placeholder="Your Name" />
            </div>
            <hr />
            <div className="form-group text-center">
                <button className="btn btn-primary">SAVE PROFILE</button>
            </div>
            </form>
       </div>
    }
}