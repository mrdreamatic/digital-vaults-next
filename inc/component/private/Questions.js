import React from "react";


export default class Questions extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
        this.data = {};
        this.state = {
            data: this.data,
            country: {}
        }
    }

  //  shouldComponentUpdate = () => false


    async componentDidMount(){
        
            let data = window.localStorage.getItem('pdata');
            data = JSON.parse(data);
            console.log(data);
            this.setState({
                data: data
            }, async () => {
                this.changeState({
                    type: "select",
                    name: "country",
                    ele: false,
                    target: {
                        value: data !== null ? data.country : '""',
                        getAttribute: (attr) => {
                            return {
                                name: "country"
                            }
                        }
                    }
                });
                let question = await this.props.app.db('GET', 'find','question', {enabled: true}, {
                    order: JSON.stringify({order: 1})
                });
                console.log(question)
                this.setState({
                    question: question.data
                }, async() => {
                    await this.loadControls(this.state.question);
                });
                
            });
        
       
        //console.log(this.question);
    }

    changeState = (e) => {
        if(e.target.value !== undefined && e.target.value !== 'undefined'){
            const detail = JSON.parse(e.target.value);
            
            this.setState({
                country: detail
            }, async ()=> {
                this.updateModel(e);
                await this.loadControls();
                console.log(this.state.country)
            })
        }
        
        
    }

    replaceDefaultVal = (str) => {
        let user = this.props.app.helper.user !== null ? this.props.app.helper.user.providerData[0] : null;
        if(user !== null && str !== undefined && str !== null && typeof(str) === 'string'){
            Object.entries(user).forEach((x)=>{
               str = str.replace(`%%user.${x[0]}%%`, x[1] === null ? "" : x[1]);
            })
            
           // console.log(user);
        }
        return str;
    }

    loadControls = async (items) => {
        let ctrl;
       /// let user = this.props.app.helper.user !== null ? this.props.app.helper.user.providerData[0] : null;
       // console.log(items);
        this.items = items !== undefined ? items.map((x)=>{
            ctrl = x.control.map((xi)=>{
                if(xi.attr === undefined){xi.attr = {}}
                //console.log(xi.attr);
                xi.attr = {...xi.attr, ...{
                    onChange: this.updateModel,
                    checked: this.getModel(xi.name),
                    defaultValue: this.getModel(xi.name) !== "" ? this.replaceDefaultVal(this.getModel(xi.name)) : xi.attr.defaultValue === undefined ? "" : this.replaceDefaultVal(xi.attr.defaultValue)
                }};
                //console.log(xi.attr);
                if(xi.option === undefined){ xi.option = [] }
                if(xi.relation !== undefined){ xi.rel = this.getModel(xi.relation) }
                
                let option;
                if(typeof(xi.option) !== 'string'){
                    option = xi.option.map((xo)=>{
                        
                        if(xi.type === 'checkbox'){
                            console.log(xi.type, this.getModel(xi.name), xo.val);
                            xo.name = xi.name;
                            xo.attr = {
                                onChange: this.updateModel,
                            }
                            
                            xo.defaultChecked = this.getModel(xi.name).includes(xo.val);
                        }else{
                            xo.defaultChecked = Array.isArray(this.getModel(xi.name)) ? this.getModel(xi.name) === xo.val : this.getModel(xi.name).includes(xo.val);
                        }
                        
                        return xo;
                    });
                }
                
                xi.option = option;
                return xi;
                //console.log(xi.option);
            });
            x.control = ctrl;
            return x;
        }) : [];
        console.log(this.items);
        this.setState({
            items: this.items
        })
    }

    getModel = (name, def = '') => {
        this.data = this.state.data === null ? {} : this.state.data;
        return this.data[name] !== undefined && this.data[name] !== null ? this.data[name] : def;
    }

    updateModel = async (e) => {
        let items = this.state.items;
        let data = this.state.data === null ? {} : this.state.data;
       let type = !e.ele && e.ele !== undefined ? e.type : 
       e.target.tagName.toLowerCase() === 'select' ? 'select' : e.target.getAttribute('type');
       let name = !e.ele && e.ele !== undefined ? e.name : e.target.getAttribute('name');
       if(e.ele === undefined){
        this.setState({
            changed: true
        })
       }
      
       if(type === 'checkbox'){
        let checked = [];
        if(data[name] === undefined && !Array.isArray(data[name])){
            data[name] = [];
        }
            data[name].push(e.target.value);
            checked = [...new Set(data[name])];
            checked = !e.target.checked ? checked.filter(x => x !== e.target.value) : checked;
            data[name] = checked;
        
       
     //  console.log(name, e.target.checked)
        //data[name] = checked;
       
        }else if(type === 'select' && e.target.multiple){
            var result = [];
            var options = e.target.options;
            var opt;
          
            for (let j=0, iLen=options.length; j<iLen; j++) {
              opt = options[j];
          
              if (opt.selected) {
                result.push(opt.value || opt.text);
              }
            }
            console.log(result);
            data[name] = result;
        }else{
                data[name] = e.target.value;
        }
        console.log(data);
        this.setState({
            data: data
        }, async () => {
            await this.loadControls(this.state.question);
            window.localStorage.setItem('pdata', JSON.stringify(data));
        });
        
        //console.log(data)
        
    }

    saveData = async (e) => {
        e.preventDefault();
        let params = this.props.app.helper.formObject(e.target);
        params = {...params, ...{"_id": this.props.app.helper.user.uid}};
        console.log(params);
        let resp = await this.props.app.dbset("profile", "profile_detail",params);
        console.log(resp);
        if(resp.code === 200){
            await this.props.checkUserData();
          // window.location.reload();
        }
        
    }

    render(){
        return(
            <div className="profile">
                <form onSubmit={this.saveData}>
                {
                Array.isArray(this.state.items) && (this.state.items).map((v,i)=>{
                    //console.log(v);
                        
                        return <>
                        
                        <div key={i} className="card mb-2">
                        {
                            <>
                            <div className="card-header">
                                {
                                    v.title
                                }
                            </div>
                            <div className="card-body">
                            {v.control !== undefined && v.control.map((x, j)=>{
                                //console.log(x.option)
                                return this.props.app.form(x, x.option, j)
                            })}
                            </div>
                            {
                                this.state.changed && <div className="card-footer">
                                    <div className="row">
                                        <div className="col-6">
                                            {(this.state.index > 0) && <button className="btn btn-primary">Prev</button>}
                                        </div>
                                        <div className="col-6 text-end">
                                            <button type="submit" className="btn btn-primary">SAVE</button>
                                        </div>
                                    </div>
                                </div>
                            }
                            </>
                        }</div>
                        
                        
                        </>;
                    })
                }
                </form>
            </div>
        )
    }
}