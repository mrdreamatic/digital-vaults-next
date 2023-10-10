import React from "react";
import Questions from "./Questions";
import country from './countries.json';
import Profile from "./Profile";
import Link from "next/link";


export default class Scholarships extends React.Component{

    constructor(props){

        super(props);

        this.state = {
            qryFilter: {},
            query: {}
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
    }

    getQuery = (str) => {
        let query = {};
        new URLSearchParams(str).forEach((qv, qk)=>{
            if(query[qk] === undefined){
                query[qk] = qv;
            }else{
                if(typeof(query[qk]) === 'string'){
                    query[qk] = [query[qk]];
                }
                
                query[qk].push(qv);
            }
            
        });
        return query;
    }
    
  handleLink = async () => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? "with" : "without"
        } shallow routing`
      );
      let query = Object.fromEntries(
        new URLSearchParams(decodeURI(url.replace(/\/(.*)\?/i, "")))
      );
      
      this.setState({
        loadingdata: true
      });

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
        let query = Object.fromEntries(
          new URLSearchParams(decodeURI(url.replace(/\/(.*)\?/i, "")))
        );
        
        let qry = query.s === undefined ? this.state.find : query.s;
        this.setState({
            query: query
        });
        
        this.forceUpdate();
        this.filterData(query);
        //console.log(query)
       // let exact= query.exact === undefined ? this.state.exact : query.exact;
      //  console.log(exact);
     //   await this.loadCats(query.catId);
      //  await this.loadData(qry, query.catId, exact);
       
      }
    );
  };

  filterData = async (query = this.state.query) => {
    let dataqry = {$and: Object.entries(query).map((obj)=>{
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
    console.log(dataqry);
    this.scholarships = await this.props.app.db('GET','find','scholarship', dataqry, {
        limit: 50
    });
    //console.log(country);
    
    this.setState({
        scholarships: this.scholarships.data,
        query: query
    }, ()=> {
       
    });
    this.forceUpdate();
  }

  queryBuilder = (qry = {}) => {
    let qs =this.getQuery(decodeURI(this.props.router.asPath.replace(/\/(.*)\?/i, "")));
    
    console.log(qs,qry);
    Object.entries(qry).forEach((q)=>{
      
      if(q[1] === undefined || q[1] === ''){
        delete(qry[q[0]]);
        if(qs[q[0]] !== undefined){
          delete(qs[q[0]]);
        }
      }
    })
    qs = {...qs, ...qry};
    
    qs = (new URLSearchParams(qs).toString())
    return (`${this.props.router.route}?${qs}`);
  }

    filterlist = async (field = 'scholarship_country', fieldname = 'Scholarship Country') => {
        let finder = {$and: []};
        Object.entries((this.state.query)).forEach((it)=>{
            let fltr = {};
            fltr[it[0]] = it[1];
            finder['$and'].push(fltr);
        });
        if(finder['$and'].length < 1){
            finder['$and'].push({});
        }
        let data = await this.props.app.db('GET','filter','scholarship',{
            field: field, match: {}
        });
        
        data.data = data.data !== undefined ? data.data : [];
        data.name = fieldname;
        data.field = field;
        return data;
    }

    async componentDidMount(){
        
        let query = this.getQuery(decodeURI(this.props.router.asPath.replace(/\/(.*)\?/i, "")));
          console.log(query);
        this.setState({
           query: query
        }, async ()=>{
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
                setTimeout(async()=>{
                    let filter = await this.filterlist(x[0], x[1]);
                
               
                this.filter.push(filter);
                this.setState({
                    filter: this.filter
                });
                
                this.forceUpdate();
                })
            }, 500);
            this.forceUpdate();
            await this.filterData(this.state.query);
        });
        
        
        
       this.handleLink();
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

    shouldComponentUpdate = () => false;

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
                                                        let qb = {};
                                                        if(Array.isArray(this.state.query[x.field])){
                                                            qb[x.field] = this.state.query[x.field].splice(this.state.query[x.field].indexOf(d._id.group), 1);
                                                        }else{
                                                            qb[x.field] = this.state.query[x.field] === d._id.group ? undefined : d._id.group;
                                                        }
                                                        console.log(qb);
                                                        return <>
                                                            {
                                                                typeof(x.field) === 'string' && x.field.includes('_country') ?
                                                                <li key={j} className="list-group-item">
                                                                <Link href={this.queryBuilder(qb)}>
                                                                <input type="checkbox" id={`${x.field}_${j}`} className="form-check-input" onChange={()=>{
                                                                   
                                                                }} checked={this.state.query[x.field] === d._id.group || (Array.isArray(this.state.query[x.field]) && this.state.query[x.field].includes(d._id.group))} name={x.field} />&nbsp;<label htmlFor={`${x.field}_${j}`}>{this.getCountry(d._id.group)} ({d.count})</label>
                                                                </Link>
                                                                </li>:
                                                                <li key={j} className="list-group-item">
                                                                    <Link href={this.queryBuilder(qb)}>
                                                                    <input type="checkbox" id={`${x.field}_${j}`} className="form-check-input" onChange={()=>{
                                                                   
                                                                }} checked={this.state.query[x.field] === d._id.group || (Array.isArray(this.state.query[x.field]) && this.state.query[x.field].includes(d._id.group))} name={x.field} />&nbsp;<label htmlFor={`${x.field}_${j}`}>{d._id.group} ({d.count})</label>
                                                                    </Link>
                                                                </li>
                                                                
                                                            }
                                                            </>
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
                        this.state.scholarships.length < 1 ?
                        <div className="card">
                            <div className="card-body display-4">
                                No Data available
                            </div>
                        </div>
                        :
                        <>
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
                    </>
                }
                    </div>
                </div>
                <div className="p-3"></div>
            </div>
        )
    }
}