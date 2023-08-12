import React from "react";

export default class Footer extends React.Component{
    render(){
        return(<footer>
            <div className="bg-dark-grey p-3 text-center">
                &copy; {new Date().getFullYear()} {this.props.app.helper.config.name}
            </div>
        </footer>)
    }
}