import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";


class InfoStore {

    INFO_KEY_ABOUT_YNTYMAQ = 'about_yntymaq';
    INFO_KEY_CONTACTS = 'contacts';
    INFO_KEY_DISPUTE = 'dispute';
    INFO_KEY_BIOT = 'biot';
    INFO_KEY_BIOT_OPO = 'biot_opo';
    INFO_KEY_BIOT_PPO = 'biot_ppo';
    INFO_KEY_COUNCIL = 'council';
    disputeInfoCategory = [];

    aboutYntymaq = '';
    infoContacts = '';
    infoDispute = '';
    aboutBiot = '';
    aboutBiotOpo = '';
    aboutBiotPpo = '';
    aboutCouncil = '';

    orderArticles = [];


    loadInfo(type, key, union_id, handle, afterError){

        let body = {
            key: key,
            parent_articles: 1,
        }

        if (type !== null){
            body.type_id = type
        }

        if (union_id !== null){
            body.union_id = union_id
        }

        ApiService.getInfo({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.orderArticles = response.data

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
            this.disputeInfoCategory = response.data

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

InfoStore = decorate(InfoStore, {
    aboutYntymaq: observable,
    infoContacts: observable,
    infoDispute: observable,
    aboutBiot: observable,
    aboutBiotOpo: observable,
    aboutBiotPpo: observable,
    aboutCouncil: observable,
    disputeInfoCategory: observable,
    orderArticles: observable,
    loadInfo: action,
    loadDisputeCategory: action,
});

const infoStore = new InfoStore();

export default infoStore;