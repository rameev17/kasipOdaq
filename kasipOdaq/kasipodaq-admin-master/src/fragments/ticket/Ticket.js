import React, {Component} from "react";
import { ReactComponent as ArrowDownIcon} from '../../assets/icons/arrow.svg';
import { ReactComponent as LawyerIcon} from '../../assets/icons/lawyer.svg';
import { ReactComponent as DownLoadIcon} from '../../assets/icons/download.svg';

class Ticket extends Component{

    state = {
        status: '',
        question: '',
        answer: '',
        date: '',
        title: '',
        isVisibleText:false
    }

    isVisibleText = () =>{
        this.setState({
            isVisibleText: !this.state.isVisibleText
        })
    }

    render(){

        return(
            <div className={'ticket' + (this.state.answer.length > 0 ? ' is-ready' : ' not-ready')}>
                <div className="title">title</div>
                <div className="date">date</div>
                <div className="question">question</div>
                <div className="answer">
                    <label onClick={this.isVisibleText}>
                        <span className="icon__lawyer">
                            <LawyerIcon/>
                        </span>
                        <span>Ответ: </span>
                        <span className="status">status</span>
                        <div className={"icon " + (this.state.isVisibleText ? "rotate180" : "")}>
                            <ArrowDownIcon/>
                        </div>
                    </label>
                    <div className={"text " + (this.state.isVisibleText ? "is-visible" : "")}>{this.state.answer}</div>
                    <div className={'document ' + (this.state.isVisibleText ? "is-visible" : "")}>
                        <a href="./assets/images/icons/lawyer-active.svg" target="_blank">Документ.pdf</a>
                        <div className="icon download__icon">
                            <DownLoadIcon/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Ticket