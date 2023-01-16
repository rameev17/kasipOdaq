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

    aboutYntymaqInfo = '';
    infoContacts = '';
    infoDispute = '';
    aboutBiotInfo = '';
    aboutBiotOpoInfo = '';
    aboutBiotPpoInfo = '';
    aboutCouncilInfo = '';

    aboutYntymaqInfoId = null;
    infoContactsId = null;
    infoDisputeId = null;
    aboutBiotInfoId = null;
    aboutBiotOpoInfoId = null;
    aboutBiotPpoInfoId = null;
    aboutCouncilInfoId = null;
    orderList = '';

    loadInfo(union_id, type, key, lang, handle, afterError){

        let body = {
            key: key,
            max_depth: 3,
        }

        if(union_id !== null){
            body.union_id = union_id
        }

        if (type !== null){
            body.type_id = type
        }

        ApiService.getInfo({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': lang
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

    createInfo(type, content, key, union_id, contentKk, handle, afterError) {

        let body = {
            key: key,
        }

        if (type !== null){
            body.type_id = type
        }

        if (union_id !== null){
            body.union_id = union_id
        }

        if (contentKk !== ''){
            body.localizations = [{
                content: content,
                language_id: 'ru'
            },
            {
                content: contentKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                content: content,
                language_id: 'ru'
            }]
        }

        ApiService.createInfo({
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
    };

    updateInfo(type, id, content, contentKk, handle, afterError) {
        let body = {}

        if (type !== null){
            body.type_id = type
        }
        
        if (contentKk !== ''){
            body.localizations = [{
                content: content,
                language_id: 'ru'
            },
            {
                content: contentKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                content: content,
                language_id: 'ru'
            }]
        }

        ApiService.updateInfo({
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
    };

}

InfoStore = decorate(InfoStore, {
    aboutYntymaqInfo: observable,
    infoContacts: observable,
    infoDispute: observable,
    aboutBiotInfo: observable,
    aboutBiotOpoInfo: observable,
    aboutCouncilInfo: observable,
    aboutYntymaqInfoId: observable,
    infoContactsId: observable,
    infoDisputeId: observable,
    aboutBiotInfoId: observable,
    aboutBiotOpoInfoId: observable,
    aboutCouncilInfoId: observable,
    orderList: observable,
    loadInfo: action,
    updateInfo: action,
    createInfo: action,
});

const infoStore = new InfoStore();

export default infoStore;