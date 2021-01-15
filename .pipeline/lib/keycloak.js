"use strict";
const axios = require("axios");
const _ = require("lodash");
//code reference https://github.com/bcgov/HMCR/blob/0.7/.pipeline/lib/keycloak.js
module.exports = class KeyCloakClient {
    constructor(settings, oc) {
        this.phases = settings.phases;
        this.options = settings.options;
        this.oc = oc;
        this.appHost = this.phases.dev.host;
    }

    async init() {

        this.getSecrets();

        this.apiTokenPath = `/auth/realms/${this.realmId}/protocol/openid-connect/token`;
        this.tfrsPublicClientPath = `auth/admin/realms/${this.realmId}/clients/${this.tfrsClientId}`;

        this.api = axios.create({
            baseURL: `https://${this.ssoHost}`
        });

        const token = await this.getAccessToken();

        this.api.defaults.headers.common = {
            Authorization: `Bearer ${token}`
        };
    }

    getSecrets() {
        const keycloakSecret = this.oc.raw("get", [
            "secret",
            "tfrs-keycloak",
            "-o",
            "json"
        ]);
        const secret = JSON.parse(keycloakSecret.stdout).data;

        this.clientId = Buffer.from(secret.clientId, "base64").toString();
        this.clientSecret = Buffer.from(secret.clientSecret, "base64").toString();
        this.tfrsClientId = Buffer.from(secret.tfrsPublic, "base64").toString();
        this.realmId = Buffer.from(secret.realmId, "base64").toString();
        this.ssoHost = Buffer.from(secret.host, "base64").toString();

        if (!this.clientId || !this.clientSecret || !this.tfrsClientId)
            throw new Error(
                "Unable to retrieve Keycloak service account info from OpenShift"
            );
    }

    getAccessToken() {

        return this.api
            .post(this.apiTokenPath, "grant_type=client_credentials", {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                auth: {
                    username: this.clientId,
                    password: this.clientSecret
                }
            })
            .then(function(response) {
                if (!response.data.access_token)
                    throw new Error(
                        "Unable to retrieve Keycloak service account access token"
                    );

                return Promise.resolve(response.data.access_token);
            });
    }

    async getUris() {

        console.log("in getURis this.tfrsPublicClientPath=", this.tfrsPublicClientPath)

        const response = await this.api.get(this.tfrsPublicClientPath);

        console.log("in getURis 000000")
        const data = { ...response.data };
        const redirectUris = data.redirectUris;

        return { data, redirectUris };
    }

    async addUris() {
        await this.init();

        console.log("111Attempting to add RedirectUri and WebOrigins");

        const { data, redirectUris} = await this.getUris();

        console.log("2222");

        const putData = { id: data.id, clientId: data.clientId };

        console.log("3333");

        const hasRedirectUris = redirectUris.find(item =>
            item.includes(this.appHost)
        );

        console.log("4444");

        if (!hasRedirectUris) {
            redirectUris.push(`https://${this.appHost}/*`);
            putData.redirectUris = redirectUris;
        }

        if (!(hasRedirectUris)) {
            this.api
                .put(this.tfrsPublicClientPath, putData)
                .then(() => console.log("RedirectUri and WebOrigins added."));
        } else {
            console.log("RedirectUri and WebOrigins add skipped.");
        }
    }

    async removeUris() {
        await this.init();

        console.log("Attempting to remove RedirectUri and WebOrigins");

        const { data, redirectUris } = await this.getUris();

        const putData = { id: data.id, clientId: data.clientId };

        const hasRedirectUris = redirectUris.find(item =>
            item.includes(this.appHost)
        );

        if (hasRedirectUris) {
            putData.redirectUris = redirectUris.filter(
                item => !item.includes(this.appHost)
            );
        }

        if (hasRedirectUris) {
            this.api
                .put(this.tfrsPublicClientPath, putData)
                .then(() => console.log("RedirectUri and WebOrigins removed."));
        } else {
            console.log("RedirectUri and WebOrigins remove skipped.");
        }

    }
};
