import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class LegalStore {
    TypeList = [];
    LegislationList = [];
    legislation = '';
    section = '';
    chapter = '';
    article = '';

    legalCurrentPage = '';
    legalPageCount = '';
    legalPageNumber = 1;

    breadCrumbs = [];

    loadTypeList(parent_id, search, lang, handle, afterError){
        let body = {

        }

        if (search !== null && search !== '') {
            body.search = search
        }else{
            body.page_number = this.legalPageNumber;
            if (parent_id !== null){
                body.parent_id = parent_id
            }
        }

        ApiService.getLegislationType({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang
                }
            }
        }, response => {
            this.TypeList = response.data
            this.legalCurrentPage = response.headers['x-pagination-current-page'];
            this.legalPageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadLegislationList(id, search, lang, handle, afterError){
        let body = {}

        if (search !== null && search !== ''){
            body.search = search
        }else{
            body.parent_id = id;
            body.page_number = this.legalPageNumber
        }

        ApiService.getLegislation({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang
                }
            }
        }, response => {
            this.LegislationList = response.data || [];
            this.legalCurrentPage = response.headers['x-pagination-current-page'];
            this.legalPageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadLegislation(id, handle, afterError) {
        ApiService.getLegislation({
            body: {
                parent_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.legislation = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadLegislationArticle(id, lang, handle, afterError) {
        ApiService.getLegislationArticle({
            id: id,
            body: {

            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang
                }
            }
        }, response => {
            this.legislation = response.data
            this.breadCrumbs = response.data.bread_crumbs

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    createTypeLegislation(title, titleKk, handle, afterError){
        let body = {}

        if (titleKk !== ''){
            body.localizations = [{
                title: titleKk,
                language_id: 'kk'
            },
            {
                title: title,
                language_id: 'ru'
            }
            ]
        }else{
            body.localizations = [{
                title: title,
                language_id: 'ru'
            }]
        }

        ApiService.createLegislation({
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

    createLegislation(id, title, titleKk, handle, afterError){
        let body = {
            parent_id: id
        }

        if (titleKk !== ''){
            body.localizations = [{
                title: titleKk,
                language_id: 'kk'
            },
            {
                title: title,
                language_id: 'ru'
            }]
        }else{
            body.localizations = [{
                title: title,
                language_id: 'ru'
            }]
        }

        ApiService.createLegislation({
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

    createDocument(id, title, content, titleKK, contentKK, handle, afterError){
        let body =  {
            parent_id: id
        }

        if (titleKK !== ''){
            body.localizations = [{
                title: title,
                content: content,
                language_id: 'ru'
            },
            {
                title: titleKK,
                content: contentKK,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: title,
                content: content,
                language_id: 'ru'
            }]
        }

        ApiService.createLegislation({
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

    createDocumentType(title, content, titleKK, contentKK, handle, afterError){
        let body = {}

        if (titleKK !== ''){
            body.localizations = [{
                title: title,
                content: content,
                language_id: 'ru'
            },
            {
                title: titleKK,
                content: contentKK,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: title,
                content: content,
                language_id: 'ru'
            }]
        }

        ApiService.createLegislation({
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

    editLegislation(id, title, content, titleKk, contentKk, handle, afterError){
        let body = {}


        if (titleKk !== ''){
            body.localizations = [{
                title: title,
                content: content,
                language_id: 'ru'
            },
            {
                title: titleKk,
                content: contentKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: title,
                content: content,
                language_id: 'ru'
            }]
        }

        ApiService.updateLegislation({
            id: id,
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

    deleteLegislation(id, handle, afterError){
        ApiService.deleteLegislation({
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

LegalStore = decorate(LegalStore, {
    TypeList: observable,
    LegislationList: observable,
    legislation: observable,
    section: observable,
    chapter: observable,
    article: observable,
    legalCurrentPage: observable,
    legalPageCount: observable,
    legalPageNumber: observable,
    breadCrumbs: observable,
    loadTypeList: action,
    loadLegislationList:action,
    loadLegislation: action,
    loadLegislationArticle: action,
    createTypeLegislation: action,
    createLegislation: action,
    createDocument: action,
    createDocumentType: action,
    editLegislation: action,
    deleteLegislation: action,

});

const legalStore = new LegalStore();

export default legalStore;