import React from "react";
import Questions from "./Questions";
import Profile from "./Profile";


export default class Scholarships extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.names = {
            "awardedby": "Awarded By",
            "student_country": "Student's Country",
            "student_gender": "Student's Gender",
            "merit_base": "Base",
            "edu_subject": "Education Subject",
            "edu_level": {type: 'array', title: "Education Level"},
            "scholarship_country": "Scholarship Country",
            "scholarship_amt": "Scholarship Amount",
            "deadline": {type: 'date', title: "Deadline"},
          //  "apply_link": "Application Link",
            "nos_scholarship": "Numbers of Scholarships",
            "fully_or_partial": "Fully or Partialy Funded",
           // "scholarship_website": "Official Scholarship Website"
        }
    }

    filterlist = async (field = 'scholarship_country', fieldname = 'Scholarship Country') => {
        let data = await this.props.app.db('GET','filter','scholarship',{
            field: field
        });
        data.data = data.data !== undefined ? data.data : [];
        data.name = fieldname;
        data.field = field;
        return data;
    }

    async componentDidMount(){
        this.scholarships = await this.props.app.db('GET','find','scholarship');
        
        
        this.setState({
            scholarships: this.scholarships.data,
            
        })
        this.filter = [];
        this.flist = {
            "scholarship_country" : "Scholarship Country",
            "fully_or_partial": "Fully or Partialy Funded",
            "merit_base": "Base",
            "edu_subject": "Education Subject",
           // "edu_level": {type: 'array', title: "Education Level"},
            //"awardedby": "Awarded By",
           // "student_country": "Student's Country",
           // "student_gender": "Student's Gender",
            
            //"scholarship_amt": "Scholarship Amount",
           // "deadline": {type: 'date', title: "Deadline"},
          //  "apply_link": "Application Link",
            "nos_scholarship": "Numbers of Scholarships",
            
           // "scholarship_website": "Official Scholarship Website"
        };
        Object.entries(this.flist).forEach(async (x)=>{
            //console.log(x);
            let filter = await this.filterlist(x[0], x[1]);
            
            console.log(filter);
            this.filter.push(filter);
            this.setState({
                filter: this.filter
            });
        })
       
    }

    convert(obj, val){
        if(val !== undefined){
            switch(obj.type){
                case 'array':
                    return <><strong>{obj.title}:</strong> {(val).join(', ')}</> 
                case 'date':
                    return <><strong>{obj.title}:</strong> {new Date(val).toDateString()}</>
                default:
                    return val
            }
        }
        
    }

    render(){
        return(
            <div className="scholarships container">
                <div className="p-3"></div>
                <div className="row">
                    <div className="col-md-4 col-lg-4 col-xl-3" >
                        <div style={{position:"sticky","top":"0px"}}>
                            <h1>Filter By</h1>
                            <div className="card" style={{overflow:"auto", maxHeight:"90vh"}}>
                                <div className="card-body">
                                    {
                                        this.state.filter !== undefined && 
                                        <>
                                        
                                        {
                                            this.state.filter.map((x,i)=>{
                                                return <div key={i} className="mb-2">
                                                    <h6>{x.name}</h6>
                                                    <ul className="list-group mb-1">
                                                {
                                                    x.type === 'success' ?
                                                    x.data.map((d,j)=>{
                                                        return <li key={j} className="list-group-item">
                                                            <input type="checkbox" id={`${x.field}_${j}`} className="form-check-input" name={x.field} />&nbsp;<label htmlFor={`${x.field}_${j}`}>{d._id.group} ({d.count})</label>
                                                        </li>
                                                    })
                                                    : <li className="list-group-item list-group-item-danger">
                                                        {x.msg}
                                                    </li>
                                                }
                                                </ul>
                                                </div>
                                            })
                                        }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 col-lg-9 col-xl-9">
                    <div className="text-center">
                    <h1>Scholarships</h1>
                </div>
                {
                    this.state.scholarships !== undefined && Array.isArray(this.state.scholarships) && <>
                    {
                        this.state.scholarships.map((x)=>{
                            return <>
                            <div className="card">
                                <div className="card-header bg-dark text-white">
                                <h3 className="card-title m-0">{x.title}</h3>
                                </div>
                                <div className="card-body">
                                    
                                    <div className="card-text">
                                    <div className="row">
                                    {
                                        Object.entries(this.names).map((v, i)=>{
                                            
                                            return (<div className="col-lg-4 col-md-6 col-12 align-self-center">
                                                <div className="card mb-1" style={{padding:"5px 10px"}}>
                                                    {
                                                        typeof(v[1]) === 'object' ?
                                                        <>{this.convert(v[1], x[v[0]])}</> :
                                                        <><strong>{v[1]}:</strong> {x[v[0]]}</>
                                                    }
                                                
                                                </div>
                                            </div>)
                                        })
                                    }
                                    </div>
                                    </div>
                                    
                                </div>
                                <div className="card-footer text-muted">
                                    <div className="row">
                                        <div className="col-6 align-self-center">
                                        
                                        </div>
                                        <div className="col-6">
                                        <div className="text-end">
                                        <a href={x.apply_link !== undefined ? x.apply_link : "#"} rel="noreferrer" target="_blank" className="btn btn-info">Apply Now</a>
                                        </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                            <div className="p-2"></div>
                            </>
                        })
                    }
                    </>
                }
                    </div>
                </div>
                <div className="p-3"></div>
            </div>
        )
    }
}