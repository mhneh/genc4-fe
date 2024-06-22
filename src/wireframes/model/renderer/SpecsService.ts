import {Diagram, DiagramItem, InitialDiagramProps} from "@app/wireframes/model";
import {ImmutableMap} from "@app/core";

export module SpecsService {
    const SPECIFICATIONS: {[id: string]: Diagram[]} = {};

    export function all() {
        return Object.entries(SPECIFICATIONS);
    }

    export function get(id: string): Diagram[] | undefined {
        return SPECIFICATIONS[id];
    }

    export function addSpecs(id: string, specs: Diagram[]) {
        SPECIFICATIONS[id] = specs;
    }

    export function create(shape: DiagramItem): Diagram[] | undefined {
        const specs = get(shape.renderer);
        if (!specs) {
            return undefined;
        }
        let diagrams: Diagram[] = [];
        const directChild = specs[0];
        const firstDig: InitialDiagramProps = {
            items: directChild?.items,
            rootIds: directChild?.items.values.map(item => item.id),
            master: shape.id,
            title: shape.appearance.get("TITLE"),
            relationships: ImmutableMap.of(directChild?.relationships),
            type: directChild?.type,
            mainSystem: false,
            parentId: shape.id,
        };
        diagrams.push(Diagram.create(firstDig));
        for (let i = 1; i < specs.length; ++i) {
            const sample = specs[i];
            const rootIds = sample?.items.values.map(item => item.id);
            const relationships = ImmutableMap.of(sample?.relationships);
            const data: InitialDiagramProps = {
                items: sample?.items,
                rootIds: rootIds,
                master: sample.parentId,
                title: sample.title,
                relationships: relationships,
                type: sample?.type,
                mainSystem: false,
                parentId: sample.parentId,
            };
            diagrams.push(Diagram.create(data));
        }
        return diagrams;
    }
}