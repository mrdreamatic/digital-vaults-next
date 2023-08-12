import React from "react";

export default class Header extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        menu: 'default'
      }
      console.log(this.props.app);
      this.menu = {
        default: [
          {content: <>Login</>, a: {href: "#"}},
        ],
        user: [
          {
            content: <>Account</>,
            a: {href: "#"},
            children: [
              {content: <>User</>, a: {href: "#"}},
              {content: <button type="button" className="btn btn-sm btn-light" onClick={async ()=>{
                await this.props.app.signOut();
                window.location.reload();
              }}>Logout</button>, a: {href: "#"}}
            ]
          }
        ]
      }
       
    }

    componentDidMount(){
        console.log(this.props.app);
        if(this.props.app.helper.user !== null){
          this.setState({
            menu: 'user'
          })
        }
    }
    render(){
        return(<header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" aria-label="Eighth navbar example">
    <div className="container">
      <a className="navbar-brand" href={this.props.app.helper.siteUrl}><img src={this.props.app.helper.siteUrl + '/assets/img/logo.png'} alt={this.props.app.helper.config.name} /></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="mainNav" style={{flexGrow:"inherit"}}>
        
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-end">
          {
            this.menu[this.state.menu].map((x, i)=>{
              let xattr = x.a.attr === undefined ? {} : x.a.attr;
              let hasChild = x.children !== undefined ? {...xattr, ...{
                "data-bs-toggle":"dropdown",
                "aria-expanded":"false"
              }} : xattr;
              return <li key={i} className={`nav-item${x.children !== undefined ? ' dropdown' :""}`}>
                <a className={`nav-link${x.children !== undefined ? ' dropdown-toggle' :""}${window.location.href === x.a.href ? ' active' : ""}`} id={`topnav_${i}`} {...hasChild} href={x.a.href}>{x.content}</a>{
                  x.children !== undefined && 
                  <ul className="dropdown-menu" aria-labelledby={`topnav_${i}`}>
                    {x.children.map((xi, j)=>{
                      let attr = xi.a.attr === undefined ? {} : xi.a.attr;
                      return <li key={j}><a className="dropdown-item" href={xi.a.href} >{xi.content}</a></li>
                    })}
                  </ul>
                }
              </li>
            })
            
          }
          
        </ul>
      </div>
    </div>
  </nav>
        </header>)
    }
}