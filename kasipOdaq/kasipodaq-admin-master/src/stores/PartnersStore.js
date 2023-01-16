import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class PartnersStore {
    partnerCategoryList = [];
    partnerCategory = '';
    partnerList = [];
    partner = '';
    file = null;
    pictureId = 0;
    partnerCategoryName = '';
    partnerCategoryId = null;

    partnerCurrentPage = '';
    partnerPageCount = '';
    partnerPageNumber = 1;

    uploadFile(handle, afterError) {
        let formData = new FormData();
        formData.append('file', this.file);

        ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.pictureId = response.headers['x-entity-id'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadPartnerCategoryList(search, handle, afterError) {
        let body = {};

        if (search !== null){
            body = {
                book: 'partner_category',
                search: search
            }
        }else{
            body = {
                book: 'partner_category',
                page_number: this.partnerPageNumber,
            }
        }

        ApiService.getPartnerCategoryList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }

        }, response => {
            this.partnerCategoryList = response.data;
            this.partnerCurrentPage = response.headers['x-pagination-current-page'];
            this.partnerPageCount = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadPartnerCategory(id, handle, afterError) {
        ApiService.getPartnerCategory({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }

        }, response => {
            this.partnerCategory = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createPartnerCategory(name, handle, afterError){
        ApiService.createPartnerCategory({
            body: {
                localizations: [{
                    name: name,
                    language_id: 'ru'
                },
                {
                    name: name,
                    language_id: 'kk'
                }],
                book: 'partner_category',
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

    editPartnerCategory(id, name, handle, afterError){
        ApiService.editPartnerCategory({
            id: id,
            body: {
                localizations: [{
                    name: name,
                    language_id: 'ru'
                },
                {
                    name: name,
                    language_id: 'kk'
                }],
                book: 'partner_category',
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

    deletePartnerCategory(id, handle, afterError){
        ApiService.deletePartnerCategory({
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

    loadPartnerList(resource_id, handle, afterError) {
        ApiService.getPartnerList({
            body: {
                category_id: resource_id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }

        }, response => {
            this.partnerList = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadPartner(id, lang, handle, afterError) {
        ApiService.getPartner({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang,
                }
            }

        }, response => {
            this.partner = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createPartner(id, name, nameKk, contentRu, contentKk, vk, ok, instagram, facebook, whatsapp, twitter, telegram, handle, afterError){

        let body = {
            category_id: id,
            localizations: [{
                name: name,
                description: contentRu,
                language_id: 'ru'
            },
            {
                name: nameKk,
                description: contentKk,
                language_id: 'kk'
            }],
        };

        if (this.pictureId !== 0){
            body.picture_id = this.pictureId
        }

        if (vk !== ''){
            body.vk = vk
        }

        if (ok !== ''){
            body.odnoklassniki = ok
        }

        if (instagram !== ''){
            body.instagram = instagram
        }

        if (facebook !== ''){
            body.facebook = facebook
        }

        if (whatsapp !== ''){
            body.whatsapp = whatsapp
        }

        if (twitter !== ''){
            body.twitter = twitter
        }

        if (vk !== ''){
            body.vk = vk
        }

        if (telegram !== ''){
            body.telegram = telegram
        }

        ApiService.createPartner({
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

    editPartner(id, name, nameKk, content, contentKk, vk, ok, instagram, facebook, whatsapp, twitter, telegram, handle, afterError){
        let body = {};

        body.localizations = [{
            name: name,
            description: content,
            language_id: 'ru'
        },
        {
            name: nameKk,
            description: contentKk,
            language_id: 'kk'
        }];

        if (this.pictureId !== 0){
            body.picture_id = this.pictureId
        }

        if (vk !== ''){
            body.vk = vk
        }

        if (ok !== ''){
            body.odnoklassniki = ok
        }

        if (instagram !== ''){
            body.instagram = instagram
        }

        if (facebook !== ''){
            body.facebook = facebook
        }

        if (whatsapp !== ''){
            body.whatsapp = whatsapp
        }

        if (twitter !== ''){
            body.twitter = twitter
        }

        if (vk !== ''){
            body.vk = vk
        }

        if (telegram !== ''){
            body.telegram = telegram
        }

        ApiService.editPartner({
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

    deletePartner(id, handle, afterError){
        ApiService.deletePartner({
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

PartnersStore = decorate(PartnersStore, {
    file: observable,
    pictureId: observable,
    partnerCategoryList: observable,
    partnerCategory: observable,
    partnerList: observable,
    partner: observable,
    partnerCategoryName: observable,
    partnerCategoryId: observable,
    partnerCurrentPage: observable,
    partnerPageCount: observable,
    partnerPageNumber: observable,
    uploadFile: action,
    loadPartnerCategoryList: action,
    loadPartnerCategory: action,
    createPartnerCategory: action,
    editPartnerCategory: action,
    deletePartnerCategory: action,
    loadPartnerList: action,
    loadPartner: action,
    createPartner: action,
    editPartner: action,
    deletePartner: action
});

const partnersStore = new PartnersStore();

export default partnersStore;