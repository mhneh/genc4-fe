/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { Renderer } from './Renderer.ts';
import {CreatedShape} from "@app/wireframes/interface/shape/created-shape.ts";
import {ShapeSource} from "@app/wireframes/interface/shape/source/shape-source.ts";

export module RendererService {
    const REGISTERED_RENDERER: { [id: string]: Renderer } = {};

    export function all() {
        return Object.entries(REGISTERED_RENDERER);
    }

    export function get(id: string): Renderer | undefined {
        return REGISTERED_RENDERER[id];
    }

    export function addRenderer(renderer: Renderer) {
        REGISTERED_RENDERER[renderer.identifier()] = renderer;
    }

    export function createShapes(sources: ReadonlyArray<ShapeSource>): CreatedShape[] {
        const result: CreatedShape[] = [];

        for (const source of sources) {
            for (const [, renderer] of all()) {
                const plugin = renderer.plugin();

                if (plugin.create) {
                    const shape = plugin.create(source);

                    if (shape) {
                        result.push(shape);
                        break;
                    }
                }
            }
        }

        return result;
    }
}
