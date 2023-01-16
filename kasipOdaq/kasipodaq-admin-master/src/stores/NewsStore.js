import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService'
import CookieService from "../services/CookieService";

class NewsStore {
    news = {};
    newsList = [];
    file = null;
    newsStatus = '';
    pictureId = 0;
    pageNumber = 1;
    currentPage = 1;
    pageCount = 1;

    loadFile(handle, afterError){
        ApiService.loadFile({
            body: {
                book: 'classes',
                count: 20,
            },
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
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
    }

    uploadFile(handle, afterError) {
        let formData = new FormData()
        formData.append('file', this.file)
        formData.append('thumbnail', '1')
        formData.append('width', '1024')
        formData.append('height', '768')

        ApiService.uploadFile({
            body: formData,
            params: {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': CookieService.get('token-admin'),
                }
            }
        }, response => {
            this.pictureId = response.headers['x-entity-id']

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadNewsList(search, handle, afterError) {
        let body = {

        }

        if (search !== null && search !== ''){
            body.search = search
        }else{
            body = {
                self: 1,
                is_public: 0,
                page_number: this.pageNumber,
            }
        }

        ApiService.getNewsList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.newsList = response.data;
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

    };

    loadUnionNewsList(id, search, handle, afterError) {
        let body = {}

        if (search !== null){
            body.search = search
        }else{
            body = {
                union_id: id,
                is_public: 1,
                page_number: this.pageNumber,
            }
        }

        ApiService.getNewsList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin'),
                    'Accept-Language': CookieService.get('language-admin')
                }
            }
        }, response => {
            this.newsList = response.data;
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

    };

    loadNews(id, lang, handle, afterError) {
        ApiService.getNews({
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
            this.news = response.data
            this.newsStatus = response.data.is_published

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    };

    createNews(title, content, source, sourceKk, status, titleKK, contentKK,  handle, afterError) {
        let body =  {
            is_published: status,
            picture_id: this.pictureId
        }

        if (titleKK !== ''){
            body.localizations = [{
                title: title,
                content: content,
                source: source,
                language_id: 'ru'
            },
            {
                title: titleKK,
                content: contentKK,
                source: sourceKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: title,
                content: content,
                source: source,
                language_id: 'ru'
            }]
        }

        ApiService.createNews({
            body: body,
            params: {
                headers: {
                    'Content-Type': 'application/json',
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

    updateNews(title, content, source, sourceKk, status, titleKk, contentKk, handle, afterError) {
        let body = {
            is_published: status,
            picture_id: this.pictureId
        }

        if (titleKk !== ''){
            body.localizations = [{
                title: title,
                content: content,
                source: source,
                language_id: 'ru'
            },
            {
                title: titleKk,
                content: contentKk,
                source: sourceKk,
                language_id: 'kk'
            }]
        }else{
            body.localizations = [{
                title: title,
                content: content,
                source: source,
                language_id: 'ru'
            }]
        }

        ApiService.updateNews({
            id: this.news.resource_id,
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

    deleteNews(id, handle, afterError) {
        ApiService.deleteNews({
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
    };

}

NewsStore = decorate(NewsStore, {
    news: observable,
    newsStatus: observable,
    newsList: observable,
    title: observable,
    content: observable,
    fileId: observable,
    count: observable,
    currentPage: observable,
    pageNumber: observable,
    loadFile: action,
    loadNews: action,
    loadNewsList: action,
    loadUnionNewsList: action,
    createNews: action,
    updateNews: action,
    deleteNews: action,
    setTitle: action,
    setContent: action,
    setFileId: action,
    uploadFile: action,
    deleteFile: action,

});

const newsStore = new NewsStore();

export default newsStore;