/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import {useEventCallback, useOpenFile} from '@app/core';
import {useAppDispatch} from '@app/wireframes/redux/store.ts';
import {texts} from '@app/texts';
import {
    getDiagrams,
    loadDiagramFromFile,
    newDiagram,
    saveDiagramToFile,
    saveDiagramToServer, showToast, updateLoadingScreen,
    useStore
} from '@app/wireframes/model';
import {UIAction} from './shared';
import {genCodeDiagram} from "@app/wireframes/api/api.ts";

export function useLoading() {
    const dispatch = useAppDispatch();
    const diagrams = useStore(getDiagrams);
    const tokenToWrite = useStore(s => s.loading.tokenToWrite);

    const canSave = React.useMemo(() => {
        for (const diagram of diagrams.values) {
            if (diagram.items.size > 0) {
                return true;
            }
        }

        return false;
    }, [diagrams]);

    const openHandler = useOpenFile('.json', file => {
        dispatch(loadDiagramFromFile({file}));
    });

    const doNew = useEventCallback(() => {
        dispatch(newDiagram(true));
    });

    const doSave = useEventCallback(() => {
        dispatch(saveDiagramToServer({navigate: true}));
    });

    const doSaveToFile = useEventCallback(() => {
        dispatch(saveDiagramToFile());
    });

    const triggerGenCode = useEventCallback(async () => {
        if (!tokenToWrite) {
            dispatch(showToast("Please save your workspace first!", 'error'));
            return;
        }
        let filename: string;
        dispatch(updateLoadingScreen(true));
        dispatch(showToast(texts.common.loadingTriggerGenCode));
        genCodeDiagram(tokenToWrite).then(response => {
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
                dispatch(updateLoadingScreen(false));
                dispatch(showToast("Gen code successfully."));
            })
            .catch(error => {
                dispatch(updateLoadingScreen(false));
                dispatch(showToast("Gen code failed.", 'error'));
                console.error(error);
                throw Error('Failed to trigger gen code.');
            });
    })

    const newDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-new',
        label: texts.common.newDiagram,
        shortcut: 'MOD + N',
        tooltip: texts.common.newDiagramTooltip,
        onAction: doNew,
    }), [doNew]);

    const saveDiagram: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-save',
        label: texts.common.saveDiagramTooltip,
        shortcut: 'MOD + S',
        tooltip: texts.common.saveDiagramTooltip,
        onAction: doSave,
    }), [doSave, canSave]);

    const saveDiagramToFileAction: UIAction = React.useMemo(() => ({
        disabled: !canSave,
        icon: 'icon-save',
        label: texts.common.saveDiagramToFileTooltip,
        tooltip: texts.common.saveDiagramToFileTooltip,
        onAction: doSaveToFile,
    }), [doSaveToFile, canSave]);

    const openDiagramAction: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-folder-open',
        label: texts.common.openFromFile,
        tooltip: texts.common.openFromFileTooltip,
        onAction: openHandler,
    }), [openHandler]);

    const genCode: UIAction = React.useMemo(() => ({
        disabled: false,
        icon: 'icon-folder-open',
        label: 'Gen code',
        tooltip: 'Used to gen code for current workspace.',
        onAction: triggerGenCode,
    }), [triggerGenCode])

    return {
        newDiagram: newDiagramAction,
        openDiagramAction,
        saveDiagram,
        saveDiagramToFile: saveDiagramToFileAction,
        genCode,
    };
}
