/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function getDiagram(readToken: string) {
    const response = await fetch(`${SERVER_URL}/${readToken}`);

    if (!response.ok) {
        throw Error('Failed to load diagram');
    }

    const stored = await response.json();

    return stored;
}

export async function putDiagram(writeToken: string, body: any) {
    const response = await fetch(`${SERVER_URL}/${writeToken}`, {
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
    const response = await fetch(`${SERVER_URL}/`, {
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
    let filename: string;
    fetch(`${SERVER_URL}/${writeToken}`, {
        method: 'PATCH'
    }).then(response => {
        const header = response.headers.get('Content-Disposition');
        const parts = header!.split(';');
        filename = parts[1].split('=')[1];
        return response.blob();
    })
        .then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // append the element to the dom
            a.click();
            a.remove(); // afterwards, remove the element
        })
        .catch(error => {
            console.error(error);
            throw Error('Failed to trigger gen code.');
        });
}