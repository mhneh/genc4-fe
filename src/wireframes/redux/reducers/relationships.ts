import {ActionReducerMapBuilder, createAction} from "@reduxjs/toolkit";
import {Diagram, EditorState} from "@app/wireframes/model";
import {InitialRelationshipProps, Relationship} from "@app/wireframes/model/relationship/relationship.ts";
import {MathHelper} from "@app/core";

export const addRelationship = createAction('relationship/add',
    (diagramId: string, props: {
        id?: string,
        title?: string,
        description?: string,
        target?: string,
        source?: string,
    } = {}) => {
        return {
            payload: {
                id: props.id,
                diagramId: diagramId,
                title: props.title,
                description: props.description,
                target: props.target,
                source: props.source,
            }
        }
    })

export const removeRelationship = createAction(
    'relationship/remove',
    (digramId: string, target: string, source: string) => {
        return {
            payload: {
                diagramId: digramId,
                source: source,
                target: target,
            }
        }
    }
)

export const updateRelationship = createAction(
    'relationship/update',
    (digramId: string, target?: string, source?: string, description?: string) => {
        return {
            payload: {
                diagramId: digramId,
                source: source,
                target: target,
                description: description
            }
        }
    }
)

export function buildRelationships(builder: ActionReducerMapBuilder<EditorState>) {
    return builder
        .addCase(addRelationship, (state, action) => {
            const {
                id,
                title,
                description,
                diagramId,
                target,
                source,
            } = action.payload;
            return state.updateDiagram(diagramId, (diagram: Diagram) => {
                const initialProps = {
                    id: id ? id : MathHelper.nextId(),
                    title: title ? title : '',
                    description: description ? description : '',
                    diagramId: diagramId,
                    source: source,
                    target: target
                } as InitialRelationshipProps;
                const newRelationship = Relationship.create(initialProps);
                return diagram.addRelationship(newRelationship);
            });
        })
        .addCase(removeRelationship, (state, action) => {
            const {
                diagramId,
                source,
                target
            } = action.payload;
            return state.updateDiagram(diagramId, (diagram: Diagram) => {
                const relationship = diagram.findRelationship(source, target);
                if (!relationship) {
                    return diagram;
                }
                return diagram.removeRelationship(relationship.id);
            });
        })
        .addCase(updateRelationship, (state, action) => {
            const {
                diagramId: diagramId,
                source: source,
                target: target,
                description: description,
            } = action.payload;
            return state.updateDiagram(diagramId, (diagram) => {
                if (!source && !target) {
                    return diagram;
                }
                const relationship = diagram.findRelationship(source as string,
                    target as string);
                if (!relationship) {
                    return diagram;
                }
                return diagram.updateRelationship(relationship.id, rel => {
                   return rel.update({
                       description: description ? description : "",
                   });
                });
            })
        });
}