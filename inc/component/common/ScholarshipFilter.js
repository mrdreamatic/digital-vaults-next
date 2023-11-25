// Import necessary dependencies
import Link from 'next/link';
import React, { Component } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

class ScholarshipFilter extends Component {
  constructor(props) {
    super(props);

    this.names = {
        "awardedby": "Awarded By",
        "student_country": "Student's Country",
        "student_gender": {type:"country", title: "Student's Gender"},
        "merit_base": "Base",
        "edu_subject": "Education Subject",
        "edu_level": {type: 'array', title: "Education Level"},
        "scholarship_country": {type:"country", title: "Scholarship Country"},
        "scholarship_amt": "Scholarship Amount",
        "deadline": {type: 'date', title: "Deadline"},
      //  "apply_link": "Application Link",
        "nos_scholarship": "Numbers of Scholarships",
        "fully_or_partial": "Fully or Partialy Funded",
       // "scholarship_website": "Official Scholarship Website"
    }

    // Initial state for filters
    this.state = {
      countryFilters: [],
      subjectFilters: [],
      numberOfScholarshipsFilters: [],
      fundingTypeFilters: [],
      baseFilters: [],
    };
  }

  // Function to handle changes in filters
  handleFilterChange = (filterType, value) => {
    this.setState({
      [filterType]: value,
    });

    // Update query string in Next.js here
    // You can use the router or any other method to update the query string
  };

  // Function to handle clear filters
  handleClearFilters = () => {
    this.setState({
      countryFilters: [],
      subjectFilters: [],
      numberOfScholarshipsFilters: [],
      fundingTypeFilters: [],
      baseFilters: [],
    });

    // Clear query string in Next.js here
  };

  // Function to handle filter button click
  handleFilterButtonClick = () => {
    // Perform any action you want when the filter button is clicked
    // Update query string in Next.js here
  };

  getQuery = (str) => {
    let query = {};
    if(str.startsWith('?')){
       str =  str.substr(1);
    }
    str = str.split('&');
    str.forEach((q)=>{
        q = q.split('=');
        if(q.length > 1){
            if(query[q[0]] === undefined){
                query[q[0]] = q[1];
            }else if(typeof(query[q[0]])==='string'){
                query[q[0]] = [query[q[0]]];
                
            }
            
            if(Array.isArray(query[q[0]])){
                query[q[0]].push(q[1]);
            }
            
        }
        
    })
    
   
    return query;
}


setQuery = (obj, rem = '') => {
    let qs = [];
    Object.entries(obj).forEach((o)=>{
        if(Array.isArray(o[1])){
            o[1].forEach((oa)=>{
                if(oa !== rem){
                    qs.push(`${o[0]}=${encodeURIComponent(oa)}`);
                }
            })
        }else{
            qs.push(`${o[0]}=${encodeURIComponent(o[1])}`);
        }
        
    });
    return qs.join('&');
  }

filterQuery = (query) => {
    let o = {}
     Object.keys(this.names).forEach((s)=>{
        if(query[s] !== undefined){
            o[s] = query[s];
        }
    });
    return o;
  }

  queryBuilder = (qry = {}, rem = '') => {
    let qs =this.getQuery(decodeURI(this.props.router.asPath.replace(/\/(.*)\?/i, "")));
    qs = this.filterQuery(qs);
   // console.log(qs, qry, rem);
    
    Object.entries(qry).forEach((q)=>{
      
      if(q[1] === undefined || q[1] === ''){
        delete(qry[q[0]]);
        
        if(qs[q[0]] !== undefined){
          delete(qs[q[0]]);
        }
      }else{
        if(typeof(qs[q[0]]) === 'string'){
            qry[q[0]] = [qs[q[0]]];
        }
        if(Array.isArray(qry[q[0]])){

            qry[q[0]].push(q[1]);
        }
       // //console.log(qry)
       // qs[q[0]].push(q[1]);
      }
    })
    qs = {...qs, ...qry};
    qs = this.setQuery(qs);
   // console.log(qs)
    return (`${this.props.router.route}?${qs}`);
  }


  render() {
    const state = this.props.state;
    return (
        <div style={{position:"sticky","top":"0px"}}>
        <h5>Filter By</h5>
        
        <div className="card" style={{overflow:"auto", maxHeight:"90vh"}}>
            <div className="card-body">
            
                {
                    state.filter !== undefined && 
                    <>
                    
                    {
                        state.filter.map((x,i)=>{
                            return <div key={i} className="mb-2">
                                <h6>{x.name}</h6>
                                <ul className="list-group mb-1">
                            {
                                x.type === 'success' && Array.isArray(x.data) ?
                                x.data.map((d,j)=>{
                                    let qb = {};
                                    if(Array.isArray(state.qryFilter[x.field])){
                                        qb[x.field] = state.qryFilter[x.field].splice(state.qryFilter[x.field].indexOf(d._id.group), 1);
                                    }else{
                                        qb[x.field] = state.qryFilter[x.field] === d._id.group ? undefined : d._id.group;
                                    }
                                    let checked = state.qryFilter[x.field] === d._id.group || (Array.isArray(state.qryFilter[x.field]) && state.qryFilter[x.field].includes(d._id.group));
                                // console.log(checked, d._id.group, state.qryFilter[x.field]);
                                    return <div key={j}>
                                        {
                                            typeof(x.field) === 'string' && x.field.includes('_country') ?
                                            <li key={j} className="list-group-item">
                                            <Link href={this.queryBuilder(qb, d._id.group)}>
                                            <input type="checkbox" id={`${x.field}_${j}`} className="form-check-input" onChange={()=>{
                                            
                                            }} checked={state.qryFilter[x.field] === d._id.group || (Array.isArray(state.qryFilter[x.field]) && state.qryFilter[x.field].includes(d._id.group))} name={x.field} />&nbsp;<label htmlFor={`${x.field}_${j}`}>{this.props.getCountry(d._id.group)} ({d.count})</label>
                                            </Link>
                                            </li>:
                                            <li key={j} className="list-group-item">
                                                <Link href={this.queryBuilder(qb)}>
                                                <input type="checkbox" id={`${x.field}_${j}`} className="form-check-input" onChange={()=>{
                                            
                                            }} checked={state.qryFilter[x.field] === d._id.group || (Array.isArray(state.qryFilter[x.field]) && state.qryFilter[x.field].includes(d._id.group))} name={x.field} />&nbsp;<label htmlFor={`${x.field}_${j}`}>{d._id.group} ({d.count})</label>
                                                </Link>
                                            </li>
                                            
                                        }
                                        </div>
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
    );
  }
}

export default ScholarshipFilter;
