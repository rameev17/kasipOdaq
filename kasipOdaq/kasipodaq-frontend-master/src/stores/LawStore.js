import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';

class LawStore {
    lawList = []

    loadLaw() {
        this.lawList = [
            {
                id: '1',
                title: 'Title 1',
                picture_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                preview_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                short_content: 'Short content',
                content: 'Content...',
                created_date: '12.10.2019',
                updated_date: '12.10.2019',
                source: 'Google'
            },
            {
                id: '2',
                title: 'Title 2',
                picture_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                preview_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                short_content: 'Short content',
                content: 'Content...',
                created_date: '12.10.2019',
                updated_date: '12.10.2019',
                source: 'Google'
            },
            {
                id: '3',
                title: 'Title 3',
                picture_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                preview_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                short_content: 'Short content',
                content: 'Content...',
                created_date: '12.10.2019',
                updated_date: '12.10.2019',
                source: 'Google'
            },
            {
                id: '4',
                title: 'Title 4',
                picture_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                preview_uri: 'https://forbes.kz/img/articles/a44fe6968396c259bc20b2cc2e27f0b5-small.jpg',
                short_content: 'Short content',
                content: 'Content...',
                created_date: '12.10.2019',
                updated_date: '12.10.2019',
                source: 'Google'
            }
        ]
    }
}

LawStore = decorate(LawStore, {
    lawList: observable,
    loadLaw: action
});

const lawStore = new LawStore();

export default lawStore;