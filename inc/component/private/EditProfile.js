import React from "react";

import country from "./countries.json";
import Questions from "./Questions";
import Profile from "./Profile";

export default class EditProfile extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
        this.data = {};
        this.state = {
            data: this.data,
            loaded: false
        }
        this.country = country
        
        //console.log(country)
        console.log(this.props.app.helper.user);
    }

    shouldComponentUpdate = () => false


    async componentDidMount(){
        
        await this.checkUserData();
    }

    checkUserData = async () => {
        if(this.props.user.account !== null){
         
            this.userdata = await this.props.app.db('GET','findone','profile_detail', {_id: this.props.user.account.uid});
            if(this.userdata.data !== undefined){
                this.setState({
                    userdata: this.userdata.data === null ? [] : this.userdata.data
                })
            }
        }
        
    }



    render(){
        return(<main>
            <div className="page-contents">
             {
                this.props.user.account !== null && (this.props.user.profile === undefined || this.props.user.profile === null) ?
                <>
                {
                    this.props.user.profile === null &&
                    <div className="container pt-3 pb-3">
                        <div className="text-center">
                        <h1>Create your profile</h1>
                        </div>
                        <Profile {...this.props} checkUserData={this.checkUserData} />
                    </div> 
                }
                
                </> : 
                
                <>{
                    this.props.user.account !== null && 
<                   div className="container pt-3 pb-3">
                        <div className="text-center">
                        <h1>Your Profile</h1>
                        
                        </div>
                        <Profile {...this.props} user={this.props.user} checkUserData={this.checkUserData} /> 
                        <hr />
                        <Questions {...this.props} checkUserData={this.checkUserData} />
                    </div>
                    
                }</>
                
                
                
                
             }
            </div>
        </main>)
    }
}