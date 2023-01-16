import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class NotificationStore {
    notificationList = [];
    headers = {};

    loadNotificationList(pageNumber, handle, afterError) {
        ApiService.getNotificationList({
            body: {
                page_number: pageNumber
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.notificationList = response.data
            this.headers = response.headers;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    notificationRead(id, handle, afterError) {
        ApiService.notificationRead({
            body: {
                notification_id: id
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
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

    notificationToggle(id, status, handle, afterError) {

        ApiService.notificationToggle({
            id: id,
            body: {
                enable_notice: status
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
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

NotificationStore = decorate(NotificationStore, {
    notificationList: observable,
    headers: observable,
    loadNotificationList: action,
    notificationRead: action,
    notificationToggle: action,
});

const notificationStore = new NotificationStore();

export default notificationStore;