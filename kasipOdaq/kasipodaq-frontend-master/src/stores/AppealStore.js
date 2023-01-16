import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class AppealStore {
    appealList = [{
        person: {},
        files: [],
        answer: {
            files: [{}]
        },
    }];
    appealFiles = [{
        name: '',
        size: '',
        id: ''
    }];
    applicationFiles = [];
    file = { name: 'Прикрепить файл' };
    files = [];

    async uploadFile(file, handle, afterError) {
        let formData = new FormData()
        formData.append('file', file)

        await ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {

            if (handle !== undefined) {
                handle(response.data, response.headers)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadAppealList(type, handle, afterError) {
        ApiService.getAppealList({
            body: {
                self: 1,
                type: type,
                max_depth: 2,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token')
                }
            }
        }, response => {
            this.appealList = response.data
            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createAppeal(unionType, title, content, type, fileId, handle, afterError){
        let body = {
            title: title,
            content: content,
            type: type,
        }

        if (fileId !== ''){
            body.files = fileId
        }


        if (unionType !== null){
            body.union_id = unionType
        }

        ApiService.createAppeal({
            body: body,
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

    addFileToAppeal() {
        this.appealFiles.push({value: '', index: this.appealFiles.length})
    }

}

AppealStore = decorate(AppealStore, {
    appealList: observable,
    appealFiles: observable,
    applicationFiles: observable,
    addFileToAppeal: action,
    file: observable,
    files: observable,
    uploadFile: action,
    loadAppealList: action,
    createAppeal: action,
});

const appealStore = new AppealStore();

export default appealStore;