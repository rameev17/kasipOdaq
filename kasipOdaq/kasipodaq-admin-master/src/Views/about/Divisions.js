import React, {Component} from 'react';
import TabsLayout from "../Containers/TabsLayout"
import Division from './Division'

class Divisions extends Component {

    state = {
        tabs: [
            {name: 'Съезд'},
            {name: 'Совет'},
            {name: 'Исполком'},
            {name: 'Комиссия'}
        ],
    }

    changeTabCallback = (tab) => {
        switch (tab) {
            case '1':
                this.props.history.push({
                    pathname: `/about/divisions/congress`,
                    state: { tabId: 1 }
                })
                break;
            case '2':
                this.props.history.push({
                    pathname:`/about/divisions/council`,
                    state: { tabId: 2 }
                })
                break;
            case '3':
                this.props.history.push({
                    pathname: `/about/divisions/ispolcom`,
                    state: { tabId: 3 }
                })
                break;
            case '4':
                this.props.history.push({
                    pathname:`/about/divisions/commission`,
                    state: { tabId: 4 }
                })
                break;
            default:
                this.props.history.push(`/about/divisions`)
        }
    }

    render() {

        return (
            <div className='divisions content'>
                <h1 className="title">Органы ФПРК</h1>
                <div className="panel">
                    <TabsLayout tabs={this.state.tabs}
                                changeTabCallback={this.changeTabCallback}>
                        <Division/>
                    </TabsLayout>
                </div>
            </div>
        );
    }
}

export default Divisions;