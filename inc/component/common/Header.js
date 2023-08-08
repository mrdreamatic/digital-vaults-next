import React from "react";

export default class Header extends React.Component{
    componentDidMount(){
        console.log(this.props.client)
    }
    render(){
        return(<header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" aria-label="Eighth navbar example">
    <div className="container">
      <a className="navbar-brand" href={this.props.client.siteUrl}><img src={this.props.client.siteUrl + '/assets/img/logo.png'} alt={this.props.client.config.name} /></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarsExample07">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
          </li>
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="dropdown07" data-bs-toggle="dropdown" aria-expanded="false">Dropdown</a>
            <ul className="dropdown-menu" aria-labelledby="dropdown07">
              <li><a className="dropdown-item" href="#">Action</a></li>
              <li><a className="dropdown-item" href="#">Another action</a></li>
              <li><a className="dropdown-item" href="#">Something else here</a></li>
            </ul>
          </li>
        </ul>
        <form>
          <input className="form-control" type="text" placeholder="Search" aria-label="Search" spellcheck="false" data-ms-editor="true" />
        </form>
      </div>
    </div>
  </nav>
        </header>)
    }
}