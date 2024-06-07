import {Diagram, DiagramItem, InitialDiagramProps} from "@app/wireframes/model";
import {ImmutableMap} from "@app/core";

export module SpecsService {
    const SPECIFICATIONS: {[id: string]: Diagram} = {};

    export function all() {
        return Object.entries(SPECIFICATIONS);
    }

    export function get(id: string): Diagram | undefined {
        return SPECIFICATIONS[id];
    }

    export function addSpecs(id: string, specs: Diagram) {
        SPECIFICATIONS[id] = specs;
    }

    export function create(shape: DiagramItem): Diagram | undefined {
        const specs = get(shape.renderer);
        if (!specs) {
            return undefined;
        }
        const rootIds = specs?.items.values.map(item => item.id);
        const relationships = ImmutableMap.of(specs?.relationships);
        const data: InitialDiagramProps = {
            items: specs?.items,
            rootIds: rootIds,
            master: shape.id,
            title: shape.appearance.get("TITLE"),
            relationships: relationships,
            type: specs?.type,
            parentId: shape.id,
            mainSystem: false,
        };
        return Diagram.create(data);
    }
}