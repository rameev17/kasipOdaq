import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class UserStore {
    userList = []
    profile = {
        first_name: '',
        family_name: '',
        patronymic: '',
        picture_uri: '',
        union: {},
    };
    login = '';
    password = '';
    phone = '';
    activationCode = '';
    newPassword = '';
    role = '';
    kind = '';
    languageList = [];

    setLogin(login) {
        this.login = login
    };

    setPassword(password) {
        this.password = password
    };

    auth(handle, afterError) {
        ApiService.authenticate({
            body: {
                phone: this.login,
                password: this.password
            },
            params: {}
        }, response => {
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })

    };

    profileInfo(handle, afterError){
        ApiService.getProfileInfo({
            body: {
                max_depth: 3
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.profile = response.data
            this.role = response.data.roles[0]
            this.kind = response.data.union.kind

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    restorePass(handle, afterError){
        ApiService.restorePass({
            body: {
                phone: this.phone,
                sms_code: this.activationCode,
                new_password: this.newPassword
            },
            params: {}
        }, response => {
            this.unionsList = response.data
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    sendSms(handle, afterError) {
        ApiService.send_sms({
            body: {
                method: "restore_password",
                phone: this.phone,
            },
            params: {}
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

    confirmSms(handle, afterError) {
        ApiService.confirm_sms({
            body: {
                phone: this.phone,
                sms_code: this.activationCode
            },
            params: {}
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

    changePassword(oldPassword, newPassword, handle, afterError) {

        ApiService.changePassword({
            body: {
                old_password: oldPassword,
                new_password: newPassword
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
    };

    singleLanguage(language, key, handle, afterError){
        ApiService.setLanguage({
            body: {
                key: key,
                language: language
            },
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
    };

    getLanguage(language, handle, afterError){
        ApiService.getLanguageList({
            body: {
                language: language,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }
        }, response => {
            this.languageList = response.data

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

UserStore = decorate(UserStore, {
    userList: observable,
    profile: observable,
    login: observable,
    kind: observable,
    password: observable,
    phone: observable,
    newPassword: observable,
    activationCode: observable,
    role: observable,
    languageList: observable,
    profileInfo: action,
    setLogin: action,
    setPassword: action,
    auth: action,
    restorePass: action,
    sendSms: action,
    confirmSms: action,
    changePassword: action,
    getLanguage: action,
    singleLanguage: action,

});

const userStore = new UserStore();

export default userStore;