/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { Color, ColorPalette, Types } from "@app/core/utils";
import { texts } from "@app/texts";
import {
  addDiagram,
  addShape,
  changeColor,
  changeColors,
  changeItemsAppearance,
  pasteItems,
  removeDiagram,
  removeItems,
} from "../actions";
import { AssetsStateInStore } from "../state/assets-state.ts";
import { Diagram } from "../diagram/diagram.ts";
import { DiagramItemSet } from "../diagram/diagram-item-set.ts";
import { EditorState, EditorStateInStore } from "../state/editor-state.ts";
import { LoadingStateInStore } from "../state/loading-state.ts";
import { UIStateInStore } from "../state/ui-state.ts";
import { UndoableState } from "../state/undoable-state.ts";

const EMPTY_SELECTION_SET = DiagramItemSet.EMPTY;

export const getDiagramId = (state: EditorStateInStore) =>
  state.editor.present.selectedDiagramId;
export const getDiagrams = (state: EditorStateInStore) =>
  state.editor.present.diagrams;
export const getDiagramsFilter = (state: UIStateInStore) =>
  state.ui.diagramsFilter;
export const getEditorRoot = (state: EditorStateInStore) => state.editor;
export const getEditor = (state: EditorStateInStore) => state.editor.present;
export const getIcons = (state: AssetsStateInStore) => state.assets.icons;
export const getIconSet = (state: AssetsStateInStore) => state.assets.iconSet;
export const getIconsFilter = (state: AssetsStateInStore) =>
  state.assets.iconsFilter;
export const getOrderedDiagrams = (state: EditorStateInStore) =>
  state.editor.present.orderedDiagrams;
export const getShapes = (state: AssetsStateInStore) => state.assets.shapes;
export const getShapesFilter = (state: AssetsStateInStore) =>
  state.assets.shapesFilter;

export const getContexts = (state: AssetsStateInStore) => state.assets.contexts;
export const getContainers = (state: AssetsStateInStore) =>
  state.assets.containers;
export const getComponents = (state: AssetsStateInStore) =>
  state.assets.components;

export const getContextsFilter = (state: AssetsStateInStore) =>
  state.assets.contextsFilter;
export const getContainersFilter = (state: AssetsStateInStore) =>
  state.assets.containersFilter;
export const getComponentsFilter = (state: AssetsStateInStore) =>
  state.assets.componentsFilter;
export const getSystem = (state: EditorStateInStore) =>
  state.editor.present.system;
export const getShowDescModal = (state: UIStateInStore) =>
  state.ui.showDescModal;

export const getRelationships = createSelector(
  getDiagrams,
  getDiagramId,
  (diagrams, id) => diagrams.get(id!)?.relationships
);

export const getIconsFilterRegex = createSelector(
  getIconsFilter,
  (filter) => new RegExp(filter || ".*", "i")
);

export const getShapesFilterRegex = createSelector(
  getShapesFilter,
  (filter) => new RegExp(filter || ".*", "i")
);

export const getContextsFilterRegex = createSelector(
  getContextsFilter,
  (filter) => new RegExp(filter || ".*", "i")
);

export const getContainersFilterRegex = createSelector(
  getContainersFilter,
  (filter) => new RegExp(filter || ".*", "i")
);

export const getComponentsFilterRegex = createSelector(
  getComponentsFilter,
  (filter) => new RegExp(filter || ".*", "i")
);

export const getDiagramsFilterRegex = createSelector(
  getDiagramsFilter,
  (filter) => new RegExp(filter || ".*", "i")
);

export const getIconSets = createSelector(getIcons, (icons) =>
  Object.keys(icons)
);

export const getSelectedIcons = createSelector(
  getIcons,
  getIconSet,
  (icons, set) => icons[set]
);

export const getFilteredIcons = createSelector(
  getSelectedIcons,
  getIconsFilterRegex,
  (icons, filter) => icons.filter((x) => filter.test(x.displaySearch))
);

export const getFilteredShapes = createSelector(
  getShapes,
  getShapesFilterRegex,
  (shapes, filter) => shapes.filter((x) => filter.test(x.displaySearch))
);

export const getFilteredContexts = createSelector(
  getContexts,
  getContextsFilterRegex,
  (shapes, filter) => shapes.filter((x) => filter.test(x.displaySearch))
);

export const getFilteredContainers = createSelector(
  getContainers,
  getContainersFilterRegex,
  (shapes, filter) => shapes.filter((x) => filter.test(x.displaySearch))
);

export const getFilteredComponents = createSelector(
  getComponents,
  getComponentsFilterRegex,
  (shapes, filter) => shapes.filter((x) => filter.test(x.displaySearch))
);

export const getFilteredDiagrams = createSelector(
  getOrderedDiagrams,
  getDiagramsFilterRegex,
  (diagrams, filter) =>
    diagrams.filter((x, index) => filter.test(getPageName(x, index)))
);

export const getDiagram = createSelector(
  getDiagrams,
  getDiagramId,
  (diagrams, id) => diagrams.get(id!)
);

export const getMasterDiagram = createSelector(
  getDiagrams,
  getDiagram,
  (diagrams, diagram) => diagrams.get(diagram?.master!)
);

export const getSelection = createSelector(getDiagram, (diagram) =>
  diagram
    ? DiagramItemSet.createFromDiagram(diagram.selectedIds.values, diagram)
    : EMPTY_SELECTION_SET
);

export const getColors = createSelector(
  getEditorRoot,
  (editor) => {
    const colors: { [color: string]: { count: number; color: Color } } = {};

    const addColor = (value: any) => {
      const color = Color.fromValue(value);

      let colorKey = color.toString();
      let colorEntry = colors[colorKey];

      if (!colorEntry) {
        colorEntry = { count: 1, color };
        colors[colorKey] = colorEntry;
      } else {
        colorEntry.count++;
      }
    };

    addColor(editor.present.color.toNumber());

    for (const diagram of editor.present.diagrams.values) {
      for (const shape of diagram.items.values) {
        if (shape.type === "Group") {
          continue;
        }

        for (const [key, value] of shape.appearance.entries) {
          if (key.endsWith("COLOR")) {
            addColor(value);
          }
        }
      }
    }

    const sorted = Object.entries(colors).sort(
      (x, y) => y[1].count - x[1].count
    );

    return new ColorPalette(sorted.map((x) => x[1].color));
  },
  {
    memoizeOptions: {
      equalityCheck: (
        current: UndoableState<EditorState>,
        previous: UndoableState<EditorState>
      ) => {
        function shouldChange() {
          if (current === previous) {
            return false;
          }

          if (current.present.id !== previous.present.id) {
            return true;
          }

          const lastAction = previous.lastAction;

          return (
            addDiagram.match(lastAction) ||
            addShape.match(lastAction) ||
            changeColor.match(lastAction) ||
            changeColors.match(lastAction) ||
            changeItemsAppearance.match(lastAction) ||
            pasteItems.match(lastAction) ||
            removeDiagram.match(lastAction) ||
            removeItems.match(lastAction)
          );
        }

        return !shouldChange();
      },
    },
  }
);

export function getPageName(diagram: Diagram | string, index: number): string {
  let title: string | undefined;

  if (Types.isString(diagram)) {
    title = diagram;
  } else {
    title = diagram.title;
  }

  return title || `${texts.common.page} ${index + 1}`;
}

export const getShouldConnectedItems = createSelector(
  getSelection,
  (items: DiagramItemSet) => {
    if (items.selectedItems.length !== 2) {
      return null;
    }
    return {
      source: items.selectedItems[0],
      target: items.selectedItems[1],
    };
  }
);

type State = AssetsStateInStore &
  EditorStateInStore &
  UIStateInStore &
  LoadingStateInStore;

export function useStore<T>(selector: (state: State) => T) {
  return useSelector<State, T>((p) => selector(p));
}
