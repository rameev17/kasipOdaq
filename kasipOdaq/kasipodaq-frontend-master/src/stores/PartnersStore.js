import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class PartnersStore {
    partnerCategoryList = [];
    partnerCategory = '';
    partnerList = [];
    partner = '';
    partnerName = '';
    partnerId = '';


    loadPartnerCategoryList(handle, afterError) {
        ApiService.getPartnerCategoryList({
            body: {
                book: 'partner_category'
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }

        }, response => {
            this.partnerCategoryList = response.data

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
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }

        }, response => {
            this.partnerCategory = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadPartnerList(resource_id, handle, afterError) {
        ApiService.getPartnerList({
            body: {
                category_id: resource_id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }

        }, response => {
            this.partnerList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadPartner(id, handle, afterError) {
        ApiService.getPartner({
            id: id,
            body: {},
            params: {
                headers: {
                    // 'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }

        }, response => {
            this.partner = response.data

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

PartnersStore = decorate(PartnersStore, {
    partnerCategoryList: observable,
    partnerCategory: observable,
    partnerList: observable,
    partner: observable,
    partnerName: observable,
    partnerId: observable,
    loadPartnerCategoryList: action,
    loadPartnerCategory: action,
    loadPartnerList: action,
    loadPartner: action,

});

const partnersStore = new PartnersStore();

export default partnersStore;