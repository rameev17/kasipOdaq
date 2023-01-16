import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class DisputeStore {
    categoryDispute = [];
    disputeList = [];
    disputeInfoCategory = [];
    disputeResolved = '';

    loadDisputeCategory(handle, afterError){
        ApiService.getDisputeCategory({
            body: {
                book: 'dispute_category'
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.categoryDispute = response.data

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadDisputeList(id, handle, afterError) {
        ApiService.getDisputeList({
            body: {
                self: 1,
                category_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.disputeList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

}

DisputeStore = decorate(DisputeStore, {
    categoryDispute: observable,
    disputeList: observable,
    disputeResolved: observable,
    loadDisputeList: action,
    loadDisputeCategory: action,
});

const disputeStore = new DisputeStore();

export default disputeStore;