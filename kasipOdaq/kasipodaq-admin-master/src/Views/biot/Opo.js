import React, {Component} from 'react';
import AddDocument from './AddDocument'
import OrdersList from './OrdersList'
import PpoList from './PpoList'

class Opo extends Component {

    render() {

        return (
            <React.Fragment>
                <AddDocument addOrder={this.addOrder}/>

                <OrdersList
                    title={`Приказы`}
                    orders={this.props.opoWorkOrders}
                    headers={this.props.opoWorkOrdersHeaders}
                    deleteOrder={this.deleteOrder}
                    editOrder={this.editOrder}
                    from='self'
                />

                <PpoList id={'1'}/>

            </React.Fragment>
        );
    }
}

export default Opo;