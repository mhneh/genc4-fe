/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as svg from '@svgdotjs/svg.js';
import {memo, useEffect, useMemo, useRef} from 'react';
import {ImmutableList, Subscription} from '@app/core';
import {Diagram, DiagramItem, RendererService} from '@app/wireframes/model';
import {PreviewEvent} from '../common/preview.ts';
import {ShapeRef} from './ref/ShapeRef.ts';
import {RelationshipRef} from "@app/wireframes/renderer/render/ref/RelationshipRef.ts";
import {Relationship} from "@app/wireframes/model/relationship/relationship.ts";

export interface RenderLayerProps {
    // The selected diagram.
    diagram?: Diagram;

    // The container to render on.
    diagramLayer: svg.Container;

    // The preview subscription.
    preview?: Subscription<PreviewEvent>;

    // True when rendered.
    onRender?: () => void;
}

const showDebugOutlines = false;

export const RenderLayer = memo((props: RenderLayerProps) => {
    const {
        diagram,
        diagramLayer,
        preview,
        onRender,
    } = props;

    const shapesRendered = useRef(onRender);
    const shapeRefsById = useRef<{ [id: string]: ShapeRef }>({});
    const relationshipRefsById = useRef<{ [id: string]: RelationshipRef }>({});

    const itemIds = diagram?.rootIds;
    const items = diagram?.items;
    const relationships = diagram?.relationships;

    const orderedShapes = useMemo(() => {
        const flattenShapes: DiagramItem[] = [];

        if (items && itemIds) {
            const handleContainer: (itemIds: ImmutableList<string>) => any = itemIds => {
                for (const id of itemIds.values) {
                    const item = items.get(id);

                    if (item) {

                        if (item.type !== 'Group') {
                            flattenShapes.push(item);
                        }

                        if (item.type === 'Group') {
                            handleContainer(item.childIds);
                        }
                    }
                }
            };
            handleContainer(itemIds);
        }

        return flattenShapes;
    }, [itemIds, items]);

    const orderedRelationships = useMemo(() => {
        const flattenShapes: Relationship[] = [];
        if (relationships) {
            for (const relationship of relationships.values) {
                flattenShapes.push(relationship);
            }
        }
        return flattenShapes;
    }, [relationships]);

    useEffect(() => {
        const references = relationshipRefsById.current;
        for (const ref of Object.values(references)) {
            ref.remove();
        }
        for (const relationship of orderedRelationships) {
            if (!references[relationship.id]) {
                const relationshipRenderer = RendererService.get('Relationship');
                if (!relationshipRenderer) {
                    throw new Error(`Cannot find renderer for relationship.`);
                }
                const sourceShape = findDiagramItem(orderedShapes, relationship.source);
                const targetShape = findDiagramItem(orderedShapes, relationship.target);
                if (!sourceShape || !targetShape) {
                    return;
                }
                references[relationship.id] = new RelationshipRef(diagramLayer, relationshipRenderer,
                    {
                        source: sourceShape,
                        target: targetShape,
                    });
            }
        }
        const shapeRefs = shapeRefsById.current;
        for (const relationship of orderedRelationships) {
            references[relationship.id].render(relationship);

            const sourceShape = findDiagramItem(orderedShapes, relationship.source);
            const targetShape = findDiagramItem(orderedShapes, relationship.target);
            if (!sourceShape || !targetShape) {
                return;
            }

            shapeRefs[sourceShape.id]?.render(sourceShape);
            shapeRefs[targetShape.id]?.render(targetShape);

        }
    }, [diagramLayer, orderedRelationships]);

    useEffect(() => {
        const allShapesById: { [id: string]: boolean } = {};
        const allShapes = orderedShapes;

        allShapes.forEach(item => {
            allShapesById[item.id] = true;
        });

        const references = shapeRefsById.current;

        // Delete old shapes.
        for (const [id, ref] of Object.entries(references)) {
            if (!allShapesById[id]) {
                ref.remove();

                delete references[id];
            }
        }

        // Create missing shapes.
        for (const shape of allShapes) {
            if (!references[shape.id]) {
                const rendererInstance = RendererService.get(shape.renderer);

                if (!rendererInstance) {
                    throw new Error(`Cannot find renderer for ${shape.renderer}.`);
                }

                references[shape.id] = new ShapeRef(diagramLayer, rendererInstance, showDebugOutlines);
            }
        }

        let hasIdChanged = false;

        for (let i = 0; i < allShapes.length; i++) {
            if (!references[allShapes[i].id].checkIndex(i)) {
                hasIdChanged = true;
                break;
            }
        }

        // If the index of at least once shape has changed we have to remove them all to render them in the correct order.
        if (hasIdChanged) {
            for (const ref of Object.values(references)) {
                ref.remove();
            }
        }

        for (const shape of allShapes) {
            references[shape.id].render(shape);
        }

        if (shapesRendered.current) {
            shapesRendered.current();
        }
    }, [diagramLayer, orderedShapes]);

    useEffect(() => {
        return preview?.subscribe(event => {

            if (event.type === 'Update') {
                if (orderedRelationships) {
                    for (const shape of Object.values(event.items)) {
                        if (!shape) {
                            continue;
                        }

                        const affectedRelationships = findRelationship(orderedRelationships, shape.id);
                        if (!affectedRelationships || affectedRelationships.length == 0) {
                            continue;
                        }
                        for (const relationship of affectedRelationships) {
                            relationshipRefsById.current[relationship.id]?.setPreview(relationship, shape);
                        }

                    }
                }

                for (const item of Object.values(event.items)) {
                    shapeRefsById.current[item.id]?.setPreview(item);
                }

            } else {
                for (const reference of Object.values(relationshipRefsById.current)) {
                    reference.setPreview(null, null);
                }
                for (const reference of Object.values(shapeRefsById.current)) {
                    reference.setPreview(null);
                }
            }
        });
    }, [preview, diagram]);

    return null;
});

function findDiagramItem(orderedShapes: DiagramItem[], itemId: string): DiagramItem | undefined {
    return orderedShapes.find(shape => shape.id == itemId);
}

function findRelationship(relationships: Relationship[], shapeId: string) {
    return relationships.filter(relationship => {
        if (relationship.source == shapeId) {
            return true;
        }
        return relationship.target == shapeId;

    });
}
