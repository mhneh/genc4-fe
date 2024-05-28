import {Rect2} from "@app/wireframes/interface";
import {ShapeRenderer2} from "@app/wireframes/interface/shape/shape-renderer2.ts";
import {Shape} from "@app/wireframes/interface/shape/shape.ts";
import {Relationship} from "@app/wireframes/model/relationship/relationship.ts";
import {DiagramItem} from "@app/wireframes/model";

export interface RenderContext {
    readonly relationship: Relationship;
    readonly shape: Shape;
    readonly renderer2: ShapeRenderer2;
    readonly rect: Rect2;
    readonly form: {
        source: DiagramItem;
        target: DiagramItem;
    }
}