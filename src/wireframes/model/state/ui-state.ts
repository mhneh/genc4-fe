/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

export interface UIState {
    // The current zoom level.
    zoom: number;

    // The error toast from any loading operation.
    errorToast?: string;

    // The info toast from any loading operation.
    infoToast?: string;

    // Indicates if the left sidebar is open.
    showLeftSidebar: boolean;

    // Indicates if the right sidebar is open.
    showRightSidebar: boolean;

    // The selected tab on the left sidebar.
    selectedTab: string;

    // The color tab.
    selectedColorTab: string;

    // The filter for the diagram.
    diagramsFilter?: string;

    // Description Appender
    showDescModal?: boolean;

    showRelationshipModal?: boolean;

    isLoading?: boolean;
}

export interface UIStateInStore {
    ui: UIState;
}

export const createInitialUIState: () => UIState = () => {
    return {
        zoom: 0.7,
        selectedTab: 'levels',
        showLeftSidebar: true,
        showRightSidebar: true,
        selectedColorTab: 'palette',
        showDescModal: false,
        showRelationshipModal: false,
        isLoading: false,
    };
};
