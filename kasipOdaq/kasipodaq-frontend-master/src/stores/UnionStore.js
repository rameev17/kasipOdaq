import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService'
import CookieService from "../services/CookieService";

class UnionStore {
    unions = [];
    union = {
        picture: {},
        files: [],
        protocol: {
            name: '',
            uri: ''
        },
        position: {
            name: '',
            uri: ''
        },
        statement: {
            name: '',
            uri: ''
        },
        agreement: {
            name: '',
            uri: ''
        }
    };
    unionName = '';
    placeList = [];
    place = {};
    unionAssociations = [];
    unionAssociation = {};
    industryList = [];
    industry = {};
    personUnionsList = [];

    loadUnion(handle, afterError) {

        ApiService.union({
            body: {
                max_depth: 2
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.union = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadUnions(id, handle, afterError) {

        ApiService.getUnion({
            id: id,
            body: {
                max_depth: 2
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.unions = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadPlaces(handle, afterError) {

        ApiService.getPlaces({
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.placeList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadUnionAssociations(search, handle, afterError) {
        let body = {
            max_depth: 3
        }

        if (search !== null && search !== ''){
            body.search = search
        }

        ApiService.getUnionAssociations({
            body: body,
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.unionAssociations = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadIndustryAssociations(handle, afterError) {

        ApiService.getIndustries({
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.industryList = response.data

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    loadUnionsByPerson(handle, afterError) {

        ApiService.getPersonUnions({
            body: {
                max_depth: 2,
            },
            params: {
                headers: {
                    'Authorization': CookieService.get('token'),
                    'Accept-Language': CookieService.get('language')
                }
            }
        }, response => {
            this.personUnionsList = response.data

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

UnionStore = decorate(UnionStore, {
    union: observable,
    unions: observable,
    unionName: observable,
    placeList: observable,
    place: observable,
    industryList: observable,
    industry: observable,
    unionAssociations: observable,
    unionAssociation: observable,
    personUnionsList: observable,
    loadUnion: action,
    loadPlaces: action,
    loadUnionAssociations: action,
    loadIndustryAssociations: action,
    loadUnionsByPerson: action

});

const unionStore = new UnionStore();

export default unionStore;