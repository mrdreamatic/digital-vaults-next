import React from "react";

import country from './countries.json';


import Link from "next/link";
import ScholarshipFilter from "../common/ScholarshipFilter";


export default class Scholarships extends React.Component{
    
    constructor(props){

        super(props);

        this.state = {
            qryFilter: {},
            loading: false
        };

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
        //console.log(this.props);
    }


    async componentDidMount(){
        
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
       
        if(this.query === undefined){
            this.query = this.getQuery(this.props.router.asPath.replace(/\/(.*)\?/i, ""));
        }
        console.log('sp', this.query);
        this.setState({
            qryFilter: (this.query),
            bookmarked: this.query.bookmarked !== undefined && this.query.bookmarked === 'true'
        }, async ()=>{
            
            
            await this.filterData(this.state.qryFilter);
        });
        
        this.forceUpdate();
        
       this.handleLink();
    }

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
    
  handleLink = async () => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? "with" : "without"
        } shallow routing`
      );
      

      //let qry = query.s === undefined ? this.state.find : query.s;
      
    };

    this.props.router.events.on("routeChangeStart", handleRouteChange);
    this.props.router.events.on(
      "routeChangeComplete",
      async (url, { shallow }) => {
        console.log(
          `App is changed to ${url} ${
            shallow ? "with" : "without"
          } shallow routing`
        );
        this.query = this.getQuery(decodeURI(url.replace(/\/(.*)\?/i, "")));
        console.log(this.query);
        this.setState({
            qryFilter: this.query,
            bookmarked: this.query.bookmarked !== undefined && this.query.bookmarked === 'true'
        }), () => {
            
            
        };

       // await this.filterData(this.query);
        console.log(this.state)
        this.forceUpdate(); 
        
       
      }
    );
  };

  filterQuery = (query) => {
    let o = {}
     Object.keys(this.names).forEach((s)=>{
        if(query[s] !== undefined){
            o[s] = query[s];
        }
    });
    return o;
  }

  filterData = async (query = this.state.qryFilter) => {
    this.setState({
        loading: true
    });
    this.forceUpdate();
    await this.checkbookmarks();
    let dataqry = {};this.filter = [];
    if(!this.state.bookmarked){
        query = this.filterQuery(query);
        dataqry = {$and: Object.entries(query).map((obj)=>{
            let theObj = {};
            if(Array.isArray(obj[1])){
                theObj = {$or: obj[1].map((ai)=>{
                    let nai = {};
                    nai[obj[0]] = ai;
                    return nai;
                })};
            }else{
                theObj[obj[0]] = obj[1];
            }
            return theObj;
        })};
        if(dataqry['$and'].length < 1){
            dataqry = {}
        }
        //console.log(dataqry);
        
    }else{
        dataqry = {$or: this.bookmarks.map(b => {return {'_id': {'ObjectId': b} }}) };
        
        
    }
    Object.entries(this.flist).forEach(async (x)=>{
        ////console.log(x);
        setTimeout(async()=>{
            let filter = await this.filterlist(this.state.bookmarked ? dataqry : {}, x[0], x[1]);
        
    
        this.filter.push(filter);
        this.setState({
            filter: this.filter
        });
        
        this.forceUpdate();
        })
    }, 500);
   // console.log(this.props.user.account.uid, this.bookmarks);
    this.scholarships = await this.props.app.db('GET','find','scholarship', dataqry, {
        limit: 50
    });
    
    //console.log(this.scholarships);
    if(this.scholarships.data !== undefined && this.scholarships.data !== null){
        this.setState({
            scholarships: this.scholarships.data.map((item)=>{
               item.bookmarked = this.bookmarks.includes(item._id);
                
                return item;
            }),
            bookmarks: this.bookmarks,
            loading: false
        }, async()=> {
           //console.log(this.state.scholarships);
        });
        
    }else{
        this.setState({
            scholarships: [],
            loading: false
        });
        
    }
    this.forceUpdate();
  }

  checkbookmarks = async() => {
   // let ids = data.map((i)=>{ return i._id });
   if(this.props.user.account !== null){
    this.bookmarks = await this.props.app.db('GET','findone','user_bookmarks', {_id: this.props.user.account.uid});
    if(this.bookmarks.data !== undefined && this.bookmarks.data !== null){
        this.bookmarks = this.bookmarks.data.item
    }else{

        //console.log(this.bookmarks);
        this.bookmarks = []
    }
   }else{
    this.bookmarks = []
   }
    
  }

    filterlist = async (match = {}, field = 'scholarship_country', fieldname = 'Scholarship Country') => {
        let finder = {$and: []};
        Object.entries((this.state.qryFilter)).forEach((it)=>{
            let fltr = {};
            fltr[it[0]] = it[1];
            finder['$and'].push(fltr);
        });
        if(finder['$and'].length < 1){
            finder['$and'].push({});
        }
        let data = await this.props.app.db('GET','filter','scholarship',{
            field: field, match: match
        });
        
        data.data = data.data !== undefined ? data.data : [];
        data.name = fieldname;
        data.field = field;
        return data;
    }


    convert(obj, val){
        if(val !== undefined){
            switch(obj.type){
                case 'country':
                    return <><strong>{obj.title}:</strong> {this.getCountry(val)}</>
                case 'array':
                    return <><strong>{obj.title}:</strong> {(val).join(', ')}</> 
                case 'date':
                    return <><strong>{obj.title}:</strong> {new Date(val).toDateString()}</>
                default:
                    return val
            }
        }
        
    }

    getCountry = (iso, f = 'name') => {
     let found = country.filter(itm => itm.iso === iso);
        if(found.length > 0){
            return found[0][f] !== undefined ? found[0][f] : ''
        }
      return found.length > 0 ? found[0] : []
    }

    //shouldComponentUpdate = () => false;

    bookmarkItem = async(id, add = true) =>{
        
        let resp = await this.props.app.dbset("bookmark", "user_bookmarks",{id: id, mode: add});
        //console.log(resp);
        if(resp.code === 200){
            if(add){
                this.bookmarks.push(id);
            }else{
                let newbookmarks = this.bookmarks.filter(x => x !== resp.data.removed);
                //console.log(newbookmarks);
                this.bookmarks = newbookmarks;
            }
            this.setState({
                scholarships: this.state.scholarships.map((item)=> {
                   item.bookmarked = this.bookmarks.includes(item._id);
                    
                    return item;
                })
            });
            this.forceUpdate();
            
           // await this.props.checkUserData();
            // window.location.reload();
        }
            
        
    }

    render(){
        return(
            <>{
                this.state.loading ? 
               <> {this.props.loader}</>
                :
                <div className="scholarships container">
                <div className="p-3"></div>
                        <div className="row">
                            <div className="col-md-4 col-lg-4 col-xl-3" >
                                <ScholarshipFilter state={this.state} router={this.props.router} getCountry={this.getCountry} />
                            </div>
                            <div className="col-md-8 col-lg-9 col-xl-9">
                            <div className="text-center">
                            <h2>Scholarships</h2>
                            
                            </div>
                            {this.props.user.account !== null && <div className="card sticky-top mb-2" style={{top:'0px'}}>
                                <div className="card-body">
                                <div className="form-check form-switch">
                                    <Link href={this.queryBuilder({bookmarked:!this.state.bookmarked})}>
                                    <input className="form-check-input" type="checkbox" role="switch" id="onlybookmarks" checked={this.state.bookmarked} />
                                    <label className="form-check-label" htmlFor="onlybookmarks">Show Only Saved Scholarship</label>
                                    </Link>
                                </div>
                                </div>
                            </div>}
                        {
                            this.state.scholarships !== undefined && Array.isArray(this.state.scholarships) && <>
                            {
                                this.state.scholarships.length < 1 ?
                                <div className="card">
                                    <div className="card-body display-4">
                                        No Data available
                                    </div>
                                </div>
                                :
                                <div className="accordion" id={`scholarships`}>
                                {
                                    this.state.scholarships.map((x, i)=>{
                                    
                                        return <>
                                        <div className="card" key={i}>
                                            
                                            <div className="card-body">
                                            <div className="row">
                                                <div className="col-10">
                                                <h3 className="card-title text-blue m-0">{x.title}</h3>
                                                </div>
                                                <div className="col-2 text-end">
                                                    <button className="btn btn-bookmark" onClick={()=>{
                                                        if(this.props.user.account === null){
                                                            this.props.router.push('/login');
                                                            return;
                                                        }else{
                                                            this.bookmarkItem(x._id, !x.bookmarked)
                                                        }
                                                        
                                                    }}>
                                                    <i className={`${x.bookmarked ? `fa-solid` : `fa-regular`} fa-bookmark`}></i>
                                                    </button>
                                                </div>
                                                <div className="col-12">
                                                    <hr />
                                                    
                                                    <div className="d-flex" style={{gap:'5px', flexWrap:"wrap"}}>
                                                                { 
                                                                    Object.entries(this.names).map((v, ji)=>{
                                                                        
                                                                        if(x[v[0]] !== undefined && x[v[0]] !== '' && x[v[0]] !== null && x[v[0]] !== 'All' && x[v[0]] !== 'Any'){
                                                                            return (<div className="d-inline-block" style={{flexGrow:"1"}} key={ji}>
                                                                                <div className="card mb-1" style={{padding:"5px 10px"}}>
                                                                                    
                                                                                        {
                                                                                            typeof(v[1]) === 'object' ?
                                                                                            <>{this.convert(v[1], x[v[0]])}</> :
                                                                                            <><strong>{v[1]}:</strong> {x[v[0]]}</>
                                                                                        }
                                                                                
                                                                                </div>
                                                                            </div>)
                                                                        }
                                                                        
                                                                    })
                                                                }
                                                                </div>
                                                                <div className="accordion-item  mt-2">
                                                    <h2 className="accordion-header" id={`heading${x._id}`}>
                                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${x._id}`} aria-expanded="true" aria-controls={`collapse${x._id}`}>
                                                        More Details
                                                    </button>
                                                    </h2>
                                                    <div id={`collapse${x._id}`} className="accordion-collapse collapse" aria-labelledby={`heading${x._id}`} data-bs-parent={`#scholarships`}>
                                                    <div className="accordion-body">
                                                        
                                                        {
                                                            x.about_scholarship !== '' && 
                                                            <div className="pb-2">
                                                                <h5 className="m-0 text-blue">About Scholarship</h5>
                                                                <div dangerouslySetInnerHTML={{__html: x.about_scholarship}} />
                                                            </div>
                                                        }
                                                        {
                                                            x.eligibility !== '' && 
                                                            <div className="pb-2"><h5 className="m-0 text-blue">Eligibility</h5>
                                                            <div dangerouslySetInnerHTML={{__html: x.eligibility}} /></div>
                                                        }
                                                        {
                                                            x.application_process !== '' && 
                                                            <div className="pb-2"><h5 className="m-0 text-blue">Application Process</h5>
                                                            <div dangerouslySetInnerHTML={{__html: x.application_process}} /></div>
                                                        }
                                                        {
                                                            x.other_details !== '' && 
                                                            <div className="pb-2"><h5 className="m-0 text-blue">Other Details</h5>
                                                            <div dangerouslySetInnerHTML={{__html: x.other_details}} /></div>
                                                        }
                                                        <div>
                                                        
                                                            {
                                                                x.contact_email !== '' && 
                                                                <a className="btn btn-blue" href={`mailto:${x.contact_email}`} title="Send Mail"><i className="fa-regular fa-envelope"></i></a>
                                                            }
                                                        
                                                            {
                                                                x.phone_number !== '' && 
                                                                <a className="btn btn-blue" href={`tel:${x.phone_number}`} title="Call"><i className="fa-solid fa-phone"></i></a>
                                                            }
                                                            
                                                        </div>
                                                        
                                                            </div>
                                                        </div>
                                                    </div>
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
                                </div>
                                
                            }
                            </>
                        }
                            </div>
                        </div>
                        <div className="p-3"></div>
                    </div>
            }</>
        )
    }
}