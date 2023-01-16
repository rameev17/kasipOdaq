import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";

class LegalStore {
    legislationList = [];
    legislationType = [];
    legislation = [];
    breadCrumbs = [];
    legislationArticle = '';
    SectionList = [];
    ChapterList = [];
    ArticleList = [];
    laws = [];
    labors = [];
    section = '';
    chapter = '';
    article = '';

    loadLegislation(id, search, handle, afterError){
        let body = {
            parent_id: id
        }

        if (search !== null && search !== ''){
            body.search = search
        }

        ApiService.getLegislation({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.legislation = response.data
            this.legislationArticle = response.data
            this.breadCrumbs = response.data.bread_crumbs

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadLegislationArticle(id, handle, afterError){

        ApiService.getLegislationArticle({
            id: id,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.legislationArticle = response.data
            this.breadCrumbs = response.data.bread_crumbs

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadLegislationType(search, handle, afterError){
        let body = {

        }

        if (search !== null && search !== ''){
            body.search = search
        }

        ApiService.getLegislationType({
            body: body,
            params: {
                headers: {
                    // 'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.legislationType = response.data

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadSectionList(handle, afterError){
        ApiService.getLegislation({
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.SectionList = response.data.children

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadChapterList(handle, afterError){
        ApiService.getChapters({
            id: 2,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.ChapterList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadArticleList(handle, afterError){
        ApiService.getLegislation({
            id: 3,
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.ArticleList = response.data.children

            if (handle !== undefined) {
                handle(response.data)
            }

        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadSection(id, handle, afterError) {
        ApiService.getSection({
            id: id,
            body: {
                self: 1
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.section = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadChapter(id, handle, afterError) {
        ApiService.getChapter({
            id: id,
            body: {
                self: 1
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }

        }, response => {
            this.chapter = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadArticle(id, handle, afterError) {
        ApiService.getArticle({
            id: id,
            body: {
                self: 1
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }

        }, response => {
            this.article = response.data

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

LegalStore = decorate(LegalStore, {
    SectionList: observable,
    ChapterList: observable,
    ArticleList: observable,
    legislationList: observable,
    legislationType: observable,
    legislationArticle: observable,
    legislation: observable,
    breadCrumbs: observable,
    section: observable,
    chapter: observable,
    article: observable,
    laws: observable,
    labors: observable,
    loadLegislation: action,
    loadLegislationType: action,
    loadSectionList:action,
    loadChapterList:action,
    loadArticleList: action,
    loadSection: action,
    loadChapter: action,
    loadArticle: action,
    loadLegislationArticle: action,
});

const legalStore = new LegalStore();

export default legalStore;