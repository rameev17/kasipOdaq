import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class FaqStore {
    faqList = [];
    faq = '';

    loadFaqList(handle, afterError){
        ApiService.getFaqList({
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.faqList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadFaq(id, handle, afterError){
        ApiService.getFaq({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.faq = response.data

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

FaqStore = decorate(FaqStore, {
    faqList: observable,
    faq: observable,
    loadFaqList: action,
    loadFaq: action,
});

const faqStore = new FaqStore();

export default faqStore;