import {action, computed, decorate, observable} from "mobx";
import ApiService from '../services/ApiService';
import CookieService from "../services/CookieService";
import {Redirect} from "react-router";
import React from "react";

class PermissionsStore {
    permissionList = [];

    loadPermissions(handle, afterError) {
        ApiService.getPermissions({
            body: {},
            params: {
                headers: {
                    'Authorization': CookieService.get('token-admin')
                }
            }

        }, response => {
            this.permissionList = response.data;

            if (handle !== undefined) {
                handle(response.data)
            }
        }, response => {
            if (afterError !== undefined) {
                afterError(response)
            }
        })
    }

    hasPermission(useCase, method) {
        if (this.permissionList.length <= 0) return false;

        const permissions = this.permissionList.filter(permission => {
            return permission.use_case == useCase && permission.method == method;
        });

        let isAllowed = true;

        permissions.forEach(permission => {
            if (!permission.is_allowed) {
                isAllowed = false;
            }
        });

        return isAllowed;
    }

    renderComponent(use_case, method, component) {
        if (this.hasPermission(use_case, method)) {
            return component
        }

        return <Redirect to={"/"} />
    }
}

PermissionsStore = decorate(PermissionsStore, {
    permissionList: observable,
    permission: observable,
    loadPermissions: action,
    renderComponent: action,
    hasPermission: observable
});

const permissionsStore = new PermissionsStore();

export default permissionsStore;