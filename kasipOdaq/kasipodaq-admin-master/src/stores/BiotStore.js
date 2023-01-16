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
    files = [];
    orderFile = null;

    pageNumberOrders = 1;
    currentPageOrders = 1;
    pageCountOrders = 1;

    uploadFile(file, handle, afterError) {
        let formData = new FormData()
        formData.append('file', file)

        ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.files.push(response.headers['x-entity-id'])

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadOrderList(id, search, handle, afterError) {
        let body = {}

        if (search !== null && search !== ''){
            body.search = search
        }else{
            body = {
                max_depth: 3,
                union_id: id,
                page_number: this.pageNumberOrders,
                count: 10,
            }
        }
        ApiService.getOrderList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.orderList = response.data
            this.currentPageOrders = response.headers['x-pagination-current-page'];
            this.pageCountOrders = response.headers['x-pagination-page-count'];

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
                    'Authorization': CookieService.get('token-admin')
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

    createOrder(name, files, handle, afterError){
        ApiService.createOrder({
            body: {
                title: name,
                files: files
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    editOrder(id, name, handle, afterError){
        ApiService.editOrder({
            id: id,
            body: {
                name: name,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    deleteOrder(id, handle, afterError){
        ApiService.deleteOrder({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, data => {
            if (handle !== undefined) {
                handle(data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

}

BiotStore = decorate(BiotStore, {
    files: observable,
    orderList: observable,
    order: observable,
    orderFile: observable,
    pageNumberOrders: observable,
    currentPageOrders: observable,
    pageCountOrders: observable,
    uploadFile: action,
    loadOrderList: action,
    loadOrder: action,
    createOrder: action,
    editOrder: action,
    deleteOrder: action,
});

const biotStore = new BiotStore();

export default biotStore;