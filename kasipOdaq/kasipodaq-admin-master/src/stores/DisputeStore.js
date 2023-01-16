import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class DisputeStore {
    disputeCategory = [];
    disputeInfoCategory = [];
    disputeList = [];
    dispute = '';
    disputeThesis = '';
    disputeSolution = '';
    resolved = 0;
    pageNumber = 1;
    currentPage = 1;
    pageCount = 1;

    loadCategoryDispute(handle, afterError) {
        ApiService.getCategoryDispute({
            body: {
                book: 'dispute_category'
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }

        }, response => {
            this.disputeCategory = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadCategoryInfoDispute(handle, afterError) {
        ApiService.getCategoryDispute({
            body: {
                book: 'dispute_category'
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }

        }, response => {
            this.disputeInfoCategory = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadDisputeList(union_id, category_id, search, handle, afterError){
        let body = {};

        if (search !== null && search !== ''){
            body.search = search
        }else{
            body = {
                max_depth: 2,
                category_id: category_id,
                union_id: union_id
            }
        }

        ApiService.getDisputeList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.disputeList = response.data;
            this.currentPage = response.headers['x-pagination-current-page'];
            this.pageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadDispute(id, lang, handle, afterError) {
        ApiService.getDispute({
            id: id,
            body: {
                self: 1
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang,
                }
            }

        }, response => {
            this.dispute = response.data;
            this.disputeThesis = response.data.thesis;
            this.disputeSolution = response.data.solution;
            this.resolved = response.data.resolved;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    createDispute(id, category, subjectRu, subjectKk, contentRu, contentKk, answerRu, answerKk, status, handle, afterError){
        let body = {
            union_id: id,
            category_id: category,
            resolved: status
        };

        if (subjectKk !== ''){
            body.localizations = [{
                title: subjectRu,
                thesis: contentRu,
                solution: answerRu,
                language_id: 'ru'
            },
            {
                title: subjectKk,
                thesis: contentKk,
                solution: answerKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: subjectRu,
                thesis: contentRu,
                solution: answerRu,
                language_id: 'ru'
            }]
        }

        ApiService.createDispute({
            body: body,
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

    editDispute(subjectRu, subjectKk, contentRu, contentKk, answerRu, answerKk, resolved, handle, afterError){
        let body = {
            resolved: resolved
        };

        if (subjectKk !== ''){
            body.localizations = [{
                title: subjectRu,
                thesis: contentRu,
                solution: answerRu,
                language_id: 'ru'
            },
            {
                title: subjectKk,
                thesis: contentKk,
                solution: answerKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: subjectRu,
                thesis: contentRu,
                solution: answerRu,
                language_id: 'ru'
            }]
        }

        ApiService.updateDispute({
            id: this.dispute.resource_id,
            body: body,
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

    deleteDispute(id, handle, afterError){
        ApiService.deleteDispute({
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

DisputeStore = decorate(DisputeStore, {
    disputeCategory: observable,
    disputeInfoCategory: observable,
    disputeList: observable,
    dispute: observable,
    disputeThesis: observable,
    disputeSolution: observable,
    resolved: observable,
    loadCategoryInfoDispute: action,
    loadDisputeList:action,
    loadCategoryDispute: action,
    loadDispute: action,
    createDispute: action,
    editDispute: action,
    deleteDispute: action,
});

const disputeStore = new DisputeStore();

export default disputeStore;