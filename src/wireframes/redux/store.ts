/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import {configureStore, createAction} from '@reduxjs/toolkit';
import {createBrowserHistory} from 'history';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {
    assets,
    buildAlignment,
    buildAppearance,
    buildDiagrams,
    buildGrouping,
    buildItems,
    buildOrdering,
    createClassReducer,
    loading,
    loadingMiddleware,
    mergeAction,
    rootLoading,
    selectDiagram,
    selectItems,
    toastMiddleware,
    ui,
    undoable
} from '../model/actions';
import {EditorState} from '../model/state/editor-state.ts';
import {createInitialAssetsState, createInitialLoadingState, createInitialUIState} from '../model/internal.ts';
import {registerComponents, registerShapeRenderers} from '../shapes';
import {buildRelationships} from "@app/wireframes/redux/reducers/relationships.ts";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

registerShapeRenderers();
registerComponents();

export const selectSystem =
    createAction('system/select', (system: string) => {
        return { payload: {system: system} };
    });

// Editor
const editorState = EditorState.create();
const editorReducer = createClassReducer(editorState, builder => {
    buildAlignment(builder);
    buildAppearance(builder);
    buildDiagrams(builder);
    buildGrouping(builder);
    buildItems(builder);
    buildOrdering(builder);
    buildRelationships(builder);

    builder.addCase(selectSystem, (state, action) => {
        return state.selectSystem(action.payload.system);
    });
});

// Undoable
const undoableReducer = undoable(
    editorReducer,
    editorState,
    {
        actionMerger: mergeAction,
        actionsToIgnore: [
            selectDiagram.name,
            selectItems.name,
        ],
    });

export const history = createBrowserHistory();

export const store = configureStore({
    reducer: {
        // Contains the store for the left sidebar.
        assets: assets(createInitialAssetsState()),
        // Actual editor content.
        editor: rootLoading(undoableReducer, editorReducer),
        // Loading state, e.g. when something has been loaded.
        loading: loading(createInitialLoadingState()),
        // General UI behavior.
        ui: ui(createInitialUIState()),
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(toastMiddleware(), loadingMiddleware(history)),
});