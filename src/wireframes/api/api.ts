/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const WORKSPACE_PATH = import.meta.env.VITE_WORKSPACE_PATH;
const LOGIN_PATH = import.meta.env.VITE_LOGIN_PATH;

export async function getDiagram(readToken: string) {
    const response = await fetch(`${SERVER_URL}/${WORKSPACE_PATH}/${readToken}`);

    if (!response.ok) {
        throw Error('Failed to load diagram');
    }

    const stored = await response.json();

    return stored;
}

export async function putDiagram(writeToken: string, body: any) {
    const response = await fetch(`${SERVER_URL}/${WORKSPACE_PATH}/${writeToken}`, {
        method: 'PUT',
        headers: {
            ['Content-Type']: 'application/json'
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw Error('Failed to save diagram');
    }
}

export async function postDiagram(body: any) {
    const response = await fetch(`${SERVER_URL}/${WORKSPACE_PATH}/`, {
        method: 'POST',
        headers: {
            ['Content-Type']: 'application/json'
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        throw Error('Failed to save diagram');
    }

    const json: { readToken: string; writeToken: string } = await response.json();

    return json;
}

export function genCodeDiagram(writeToken: string) {

    return fetch(`${SERVER_URL}/${WORKSPACE_PATH}/${writeToken}`, {
        method: 'PATCH'
    });
}

export function login(username: string, password: string) {
    return fetch(`${SERVER_URL}/${LOGIN_PATH}`, {
        method: 'POST',
        body: JSON.stringify({username, password})
    });
}