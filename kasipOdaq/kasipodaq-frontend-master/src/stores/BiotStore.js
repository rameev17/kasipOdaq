import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class BiotStore {
    orderList = [
        {
            union: {
                name: ''
            },
            files: {
                uri: ''
            }
        }
    ];
    order = '';

    loadOrderList(id, handle, afterError) {
        ApiService.getOrderList({
            body: {
                max_depth: 3,
                union_id: id,
                all: 1,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }

        }, response => {
            this.orderList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadOrder(id, handle, afterError) {
        ApiService.getOrder({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.order = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

}

BiotStore = decorate(BiotStore, {
    orderList: observable,
    order: observable,
    loadOrderList: action,
    loadOrder: action
});

const biotStore = new BiotStore();

export default biotStore;