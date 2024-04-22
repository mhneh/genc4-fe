/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

/* eslint-disable @typescript-eslint/no-loop-func */

import {ActionReducerMapBuilder, createAction} from '@reduxjs/toolkit';
import {ImmutableMap, MathHelper, Rotation, Vec2} from '@app/core/utils';
import {
    DescProps,
    Diagram,
    DiagramItem,
    DiagramItemSet,
    EditorState,
    RendererService,
    Serializer,
    Transform
} from '../../model/internal.ts';
import {createDiagramAction, createItemsAction, DiagramRef, ItemsRef} from '../../model/actions/utils.ts';
import {Appearance} from "@app/wireframes/interface/common/appearance.ts";
import {AssetType} from "@app/wireframes/interface/common/asset-type.ts";

export const addShape = createAction(
    'items/addShape',
    (
        diagram: DiagramRef,
        renderer: string,
        props: {
            position?: { x: number; y: number };
            size?: { x: number; y: number };
            appearance?: Appearance,
            type?: AssetType,
        } = {},
        id?: string,
    ) => {
        return {
            payload: createDiagramAction(diagram, {
                id: id || MathHelper.nextId(),
                renderer,
                type: props.type,
                ...props
            })
        };
    });

export const lockItems =
    createAction('items/lock', (diagram: DiagramRef, items: ItemsRef) => {
        return {payload: createItemsAction(diagram, items)};
    });

export const unlockItems =
    createAction('items/unlock', (diagram: DiagramRef, items: ItemsRef) => {
        return {payload: createItemsAction(diagram, items)};
    });

export const selectItems =
    createAction('items/select', (diagram: DiagramRef, items: ItemsRef) => {
        return {payload: createItemsAction(diagram, items)};
    });

export const removeItems =
    createAction('items/remove', (diagram: DiagramRef, items: ItemsRef) => {
        return {payload: createItemsAction(diagram, items)};
    });

export const renameItems =
    createAction('items/rename', (diagram: DiagramRef, items: ItemsRef, name: string) => {
        return {payload: createItemsAction(diagram, items, {name})};
    });

export const pasteItems =
    createAction('items/paste', (diagram: DiagramRef, json: string, offset = 0) => {
        return {
            payload: createDiagramAction(diagram, {
                json: Serializer.tryGenerateNewIds(json),
                offset
            })
        };
    });

export const addDesc = createAction('desc/add',
    (diagram: DiagramRef, items: ItemsRef, desc?: string, id?: string) => {
        return {
            payload: createItemsAction(diagram, items, {
                desc: desc,
                id: id,
            })
        }
    })

export const removeDesc = createAction('desc/remove',
    (diagram: DiagramRef, items: ItemsRef, id: string) => {
        return {
            payload: createItemsAction(diagram, items, {
                id: id,
            })
        }
    })
export const updateDescs = createAction('desc/updateAll',
    (diagram: DiagramRef, items: ItemsRef, descs: DescProps[]) => {
        return {
            payload: createItemsAction(diagram, items, {
                descs: descs,
            })
        }
    })

export function buildItems(builder: ActionReducerMapBuilder<EditorState>) {
    return builder
        .addCase(selectItems, (state, action) => {
            const {diagramId, itemIds} = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                return diagram.selectItems(itemIds);
            });
        })
        .addCase(removeItems, (state, action) => {
            const {diagramId, itemIds} = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const set = DiagramItemSet.createFromDiagram(itemIds, diagram);
                let removedRelationshipIds: string[] = [];
                for (const item of set.nested.values()) {
                    const relation = diagram.relationships.values
                        .filter(r => r.source == item.id || r.target == item.id);
                    if (!relation) {
                        continue;
                    }
                    removedRelationshipIds = [...removedRelationshipIds, ...relation.map(r => r.id)];
                }
                for (const relationshipId of removedRelationshipIds) {
                    diagram = diagram.removeRelationship(relationshipId);
                }
                return diagram.removeItems(set!);
            });
        })
        .addCase(lockItems, (state, action) => {
            const {diagramId, itemIds} = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const set = DiagramItemSet.createFromDiagram(itemIds, diagram);

                return diagram.updateItems([...set.nested.keys()], item => {
                    return item.lock();
                });
            });
        })
        .addCase(unlockItems, (state, action) => {
            const {diagramId, itemIds} = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const set = DiagramItemSet.createFromDiagram(itemIds, diagram);

                return diagram.updateItems([...set.nested.keys()], item => {
                    return item.unlock();
                });
            });
        })
        .addCase(renameItems, (state, action) => {
            const {diagramId, itemIds, name} = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                return diagram.updateItems(itemIds, item => {
                    return item.rename(name);
                });
            });
        })
        .addCase(pasteItems, (state, action) => {
            const {diagramId, json, offset} = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const set = Serializer.deserializeSet(JSON.parse(json));

                diagram = diagram.addItems(set);

                diagram = diagram.updateItems([...set.nested.keys()], item => {
                    const boundsOld = item.bounds(diagram);
                    const boundsNew = boundsOld.moveBy(new Vec2(offset, offset));

                    return item.transformByBounds(boundsOld, boundsNew);
                });

                diagram = diagram.selectItems(set.rootIds);

                return diagram;
            });
        })
        .addCase(addShape, (state, action) => {
            const {
                diagramId,
                appearance,
                id,
                position,
                renderer,
                size,
                type,
            } = action.payload;

            return state.updateDiagram(diagramId, diagram => {
                const rendererInstance = RendererService.get(renderer);

                if (!rendererInstance) {
                    throw new Error(`Cannot find renderer for ${renderer}.`);
                }

                const {
                    size: defaultSize,
                    appearance: defaultAppearance,
                    ...other
                } = rendererInstance.createDefaultShape();

                const initialSize = size || defaultSize;
                const initialProps = {
                    ...other,
                    id,
                    transform: new Transform(
                        new Vec2(
                            (position?.x || 0) + 0.5 * initialSize.x,
                            (position?.y || 0) + 0.5 * initialSize.y),
                        new Vec2(
                            initialSize.x,
                            initialSize.y),
                        Rotation.ZERO),
                    appearance: {...defaultAppearance || {}, ...appearance},
                    type: type ? type : 'Components',
                };

                const shape = DiagramItem.createShape(initialProps);

                return diagram.addShape(shape).selectItems([id]);
            });
        })
        .addCase(addDesc, (state, action) => {
            const {
                diagramId,
                itemIds,
                desc,
                id,
            } = action.payload;
            return state.updateDiagram(diagramId, diagram => {
                return diagram.updateItems(itemIds, item => {
                    const descId = id ? id : MathHelper.nextId();
                    return item.addDescription(descId, desc);
                })
            });
        })
        .addCase(removeDesc, (state, action) => {
            const {
                diagramId,
                itemIds,
                id,
            } = action.payload;
            return state.updateDiagram(diagramId, diagram => {
                return diagram.updateItems(itemIds, item => {
                    return item.removeDescription(id);
                })
            });
        })
        .addCase(updateDescs, (state, action) => {
            const {
                diagramId,
                itemIds,
                descs,
            } = action.payload;
            return state.updateDiagram(diagramId, diagram => {
                return diagram.updateItems(itemIds, item => {
                    const itemsMap = descs.reduce((a, v) => ({ ...a, [v.id]: v}), {})
                    const descsMap: ImmutableMap<DescProps> = ImmutableMap.of(itemsMap);
                    return item.updateDescriptions(descsMap);
                })
            });
        });
}

export function calculateSelection(items: ReadonlyArray<DiagramItem>, diagram: Diagram, isSingleSelection?: boolean, isCtrl?: boolean): ReadonlyArray<string> {
    if (!items) {
        return [];
    }

    let selectedItems: DiagramItem[] = [];

    function resolveGroup(item: DiagramItem, stop?: DiagramItem) {
        while (true) {
            const group = diagram.parent(item.id);

            if (!group || group === stop) {
                break;
            } else {
                item = group;
            }
        }

        return item;
    }

    if (isSingleSelection) {
        if (items.length === 1) {
            const single = items[0];

            if (single) {
                const singleId = single.id;

                if (isCtrl) {
                    if (!single.isLocked) {
                        if (diagram.selectedIds.has(singleId)) {
                            return diagram.selectedIds.remove(singleId).values;
                        } else {
                            return diagram.selectedIds.add(resolveGroup(single).id).values;
                        }
                    } else {
                        return diagram.selectedIds.values;
                    }
                } else {
                    const group = diagram.parent(single.id);

                    if (group && diagram.selectedIds.has(group.id)) {
                        selectedItems.push(resolveGroup(single, group));
                    } else {
                        selectedItems.push(resolveGroup(single));
                    }
                }
            }
        }
    } else {
        const selection: { [id: string]: DiagramItem } = {};

        for (let item of items) {
            if (item) {
                item = resolveGroup(item);

                if (!selection[item.id]) {
                    selection[item.id] = item;
                    selectedItems.push(item);
                }
            }
        }
    }

    if (selectedItems.length > 1) {
        selectedItems = selectedItems.filter(i => !i.isLocked);
    }

    return selectedItems.map(i => i.id);
}
