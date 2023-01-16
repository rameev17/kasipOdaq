import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class FaqStore {
    faqList = [];
    faq = '';
    faqHeaders = '';

    loadFaqList(pageNumber, handle, afterError){
        ApiService.getFaqList({
            body: {
                page_number: pageNumber
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.faqList = response.data;
            this.faqHeaders = response.headers;

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
                    'Authorization': CookieService.get('token-admin')
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

    createFaq(question, answer, handle, afterError){
        ApiService.createFaq({
            body: {
                question: question,
                answer: answer,
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

    editFaq(id, question, answer, handle, afterError){

        ApiService.editFaq({
            id: id,
            body: {
                question: question,
                answer: answer,
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

    deleteFaq(id, handle, afterError){
        ApiService.deleteFaq({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
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
    faqHeaders: observable,
    loadFaqList: action,
    loadFaq: action,
    createFaq: action,
    editFaq: action,
    deleteFaq: action,
});

const faqStore = new FaqStore();

export default faqStore;