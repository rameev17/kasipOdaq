import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService'
import CookieService from "../services/CookieService";

class NewsStore {
    newsList = []
    news = {}

    loadNewsList(count, search, handle, afterError) {
        let body = {}

        if (search !== null && search !== ''){
            body.search = search
        }else{
            body.count = count
        }

        ApiService.getNewsList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language') ?? 'ru'
                }
            }
        }, response => {
            this.newsList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response.data)
            }
        })
    }

    loadAllNews(id, count, search, handle, afterError) {
        let body = {}

        if (search !== null && search !== ''){
            body.search = search
        }else{
            body = {
                union_id: id,
                count: count,
                is_public: 1
            }
        }

        ApiService.getNewsList({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language') ?? 'ru'
                }
            }
        }, response => {

            this.newsList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response.data)
            }
        })
    }

    loadNews(id, handle, afterError) {
        ApiService.getNews({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language') ?? 'ru'
                }
            }
        }, response => {

            this.news = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response.data)
            }
        })
    }
}

NewsStore = decorate(NewsStore, {
    newsList: observable,
    news: observable,
    loadNewsList: action,
    loadNews: action,
    loadAllNews: action
});

const newsStore = new NewsStore();

export default newsStore;