import React from "react";
import Questions from "./Questions";
import Profile from "./Profile";
import Scholarships from "./Scholarships";


export default class Home extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    async componentDidMount(){
        this.profile = await this.props.app.db('GET','findone','profile', {_id: this.props.app.helper.user.uid});
        
        if(this.profile.data !== undefined){
            this.setState({
                profile: this.profile.data === null ? [] : this.profile.data
            })
        }
        console.log(this.profile);
        this.userdata = await this.props.app.db('GET','findone','profile_detail', {_id: this.props.app.helper.user.uid});
        if(this.userdata.data !== undefined){
            this.setState({
                userdata: this.userdata.data === null ? [] : this.userdata.data
            })
        }
    }

    render(){
        return(<main>
            <div className="page-contents">
             {
                this.state.profile !== undefined &&
                <>
                {
                    this.state.profile.length < 1 ?
                    <div className="container pt-3 pb-3">
                        <div className="text-center">
                        <h1>Create your profile</h1>
                        </div>
                        <Profile {...this.props} />
                    </div> : 
                    <>{
                        this.state.userdata !== undefined && this.state.userdata.length < 1 ? 
                        <div className="container pt-3 pb-3">
                        <div className="text-center">
                        <h1>Answer the following questions</h1>
                        <p>We need to know a few information about you in order to create a scholarship list that is appropriate for your needs.</p>
                        </div>
                        <Questions {...this.props} />
                        </div>
                         :
                         <><Scholarships {...this.props} state={this.state} /></>
                    }</>
                }
                </>
             }
            </div>
        </main>)
    }
}