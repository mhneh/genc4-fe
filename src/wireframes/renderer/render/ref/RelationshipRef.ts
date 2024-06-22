/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as svg from '@svgdotjs/svg.js';
import {DiagramItem, Renderer} from '@app/wireframes/model';
import {Relationship} from "@app/wireframes/model/relationship/relationship.ts";

export class RelationshipRef {
    private previewShape: Relationship | null = null;
    private currentShape: Relationship | null = null;
    private currentIndex = -1;

    public renderedElement: svg.G | null = null;

    constructor(
        public readonly doc: svg.Container,
        public readonly renderer: Renderer,
        public readonly form: { source: DiagramItem, target: DiagramItem }
    ) {
    }

    public remove() {
        // Always remove them so we can add the shapes back in the right order.
        this.renderedElement?.remove();
    }

    public checkIndex(index: number) {
        const result = this.currentIndex >= 0 && this.currentIndex !== index;

        this.currentIndex = index;

        return result;
    }

    public setPreview(relationship: Relationship | null, change: DiagramItem | null) {
        if (!this.renderedElement) {
            return;
        }
        if (this.previewShape !== relationship || change != null) {
            const shapeToRender = relationship || this.currentShape;

            if (!shapeToRender) {
                return;
            }

            if (!change) {
                return;
            }
            if (change.id == this.form.source.id) {
                this.form.source = change;
            }

            if (change.id == this.form.target.id) {
                this.form.target = change;
            }
            const {
                source,
                target
            } = this.form;
            this.renderedElement.clear();
            this.renderedElement.line(
                source.transform.position.x, source.transform.position.y,
                target.transform.position.x, target.transform.position.y
            ).stroke({width: 2, color: '#c2c2c2', dasharray: '5'});
            const description = relationship?.description ? relationship?.description
                : '';
            const text = this.renderedElement.text(function (add) {
                add.tspan(description).fill('#c2c2c2')
                add.font({
                    size: 17,
                    anchor: 'middle',
                    leading: '1.5em'
                });
            });
            const desLength = description.length;
            const relX = (source.transform.position.x + target.transform.position.x) / 2 - desLength * 4;
            const relY = (source.transform.position.y + target.transform.position.y) / 2 - 25;
            text.move(relX, relY);

            this.previewShape = relationship;
        }
    }

    public render(relationship: Relationship) {
        const previousElement = this.renderedElement;

        if (this.currentShape === relationship && previousElement) {
            this.doc.add(this.renderedElement!);
            return;
        }
        this.renderedElement = new svg.G();
        const {
            source,
            target
        } = this.form;
        this.renderedElement.clear();

        const description = relationship?.description ? relationship?.description : '';
        const text = this.renderedElement.text(function (add) {
            add.tspan(description).fill('#c2c2c2')
            add.font({
                size: 17,
                anchor: 'middle',
                leading: '1.5em'
            });
        });
        const desLength = description.length;
        const relX = (source.transform.position.x + target.transform.position.x) / 2 - desLength * 4;
        const relY = (source.transform.position.y + target.transform.position.y) / 2 - 25;
        text.move(relX, relY);
        this.renderedElement.line(
            source.transform.position.x, source.transform.position.y,
            target.transform.position.x, target.transform.position.y
        ).stroke({width: 2, color: '#c2c2c2', dasharray: '5'});


        // Always update shape to keep a reference to the actual object, not the old object.
        (this.renderedElement!.node as any)['shape'] = relationship;

        // For new elements we might have to add them.
        if (!this.renderedElement!.parent()) {
            this.doc.add(this.renderedElement!);
        }

        this.currentShape = relationship;
    }
}
