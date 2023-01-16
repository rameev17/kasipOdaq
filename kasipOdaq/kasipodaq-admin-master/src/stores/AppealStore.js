import {action, computed, decorate, observable, onBecomeObserved} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class AppealStore {
    appealList = [];
    appeal = {
        person: {},
        answer: {
            files: {
                name: '',
            },
        },
        files: []
    };
    answerFiles = [{
        name: '',
        size: '',
        id: ''
    }];
    applicationFiles = [];
    answerAppealText = '';
    file = { };
    files = [];
    pageNumberAppeals = 1;
    currentPageAppeals = 1;
    pageCountAppeals = 1;

    async uploadFile(file, handle, afterError) {
        let formData = new FormData()
        formData.append('file', file)

        await ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
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

    loadAppeals(type, search, id, handle, afterError) {
        let body = {
            max_depth: 3,
        }

        if (search !== null && search !== ''){
            body.search = search;
            body.type = type;
        }else if (id !== null && id !== ''){
            body = {
                max_depth: 3,
                type: type,
                page_number: this.pageNumberAppeals,
                count: 10,
                union_id: id,
            }
        }else{
            body = {
                max_depth: 3,
                type: type,
                page_number: this.pageNumberAppeals,
                count: 10
            }
        }

        ApiService.getAppealList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }

        }, response => {
            this.appealList = response.data
            this.currentPageAppeals = response.headers['x-pagination-current-page'];
            this.pageCountAppeals = response.headers['x-pagination-page-count'];

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    loadAppeal(id, type, handle, afterError) {
        ApiService.getAppeal({
            id: id,
            body: {
                type: type,
                max_depth: 2,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }

        }, response => {
            this.appeal = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    deleteAppeal(id, handle, afterError) {
        ApiService.delete_appeal({
            id: id,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    async answerAppeal(id, fileId, handle, afterError){
        let body = {
            question_id: id,
            content: this.answerAppealText
        }

        if (fileId !== ''){
            body.files = fileId
        }

        await ApiService.answer_appeal({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
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

    addFileToAppeal() {
        this.answerFiles.push({value: '', index: this.answerFiles.length})
    }

}

AppealStore = decorate(AppealStore, {
    appealList: observable,
    appeal: observable,
    answerAppealText: observable,
    file: observable,
    answerId: observable,
    pageNumberAppeals: observable,
    currentPageAppeals: observable,
    pageCountAppeals: observable,
    applicationFiles: observable,
    answerFiles: observable,
    createAppeal: action,
    loadAppeals: action,
    loadAppeal: action,
    deleteAppeal: action,
    answerAppeal: action,
    uploadFile: action,
    addFileToAppeal: action


});

const appealStore = new AppealStore();

export default appealStore;