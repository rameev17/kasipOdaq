import React,{Component} from 'react';
import './index.scss';

class Notification extends Component{

    state = {
        visibleNotification: false
    }

    onCloseNotification = () => {
        this.setState({
            visibleNotification: !this.state.visibleNotification
        })
    }

    render(){
        const {notificationType, text} = this.props;
        switch(notificationType){
            case 'error':
                return (
                    <div className={"notification error__message " + (this.state.visibleNotification ? 'hide': '')}>
                        <span>Ошибка!</span>
                        {text}
                        <div className="close-error__message" onClick={this.onCloseNotification}></div>
                    </div>
                )
            case 'warning':
                return (
                    <div className={"notification warning__message " + (this.state.visibleNotification ? 'hide' : '')}>
                        {text}
                        <div className="close-warning__message" onClick={this.onCloseNotification}></div>
                    </div>
                )
            default:
                return(
                    <div className={"notification warning__message " + (this.state.visibleNotification ? 'hide' : '')}>
                        {text}
                        <div className="close-warning__message" onClick={this.onCloseNotification}></div>
                    </div>
                )
        }
    }
}

export default Notification;