/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { DefaultAppearance, Rect2 } from '@app/wireframes/interface';
import {RenderContext} from "@app/wireframes/interface/renderer/render-context.ts";
import {ShapePlugin} from "@app/wireframes/interface/shape/shape-plugin.ts";

const OFFSET = { left: 15, top: 50, right: 15, bottom: 25 };

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0xFFFFFF,
    [DefaultAppearance.TEXT_DISABLED]: true,
};

export class Tablet implements ShapePlugin {
    type(): string {
        return "";
    }
    public identifier(): string {
        return 'Tablet';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 640, y: 480 };
    }

    public previewSize() {
        return { x: 320, y: 240 };
    }

    public previewOffset() {
        return OFFSET;
    }

    public render(ctx: RenderContext) {
        this.createHull(ctx);

        if (ctx.rect.width >= 50 && ctx.rect.height > 200) {
            this.createScreen(ctx);
            this.createSpeaker(ctx);
        }
    }

    private createHull(ctx: RenderContext) {
        const hullRect = new Rect2(-OFFSET.left, -OFFSET.top, ctx.rect.width + OFFSET.left + OFFSET.right, ctx.rect.height + OFFSET.top + OFFSET.bottom);

        ctx.renderer2.rectangle(0, 20, hullRect, p => {
            p.setBackgroundColor(0);
        });
    }

    private createScreen(ctx: RenderContext) {
        ctx.renderer2.rectangle(0, 0, ctx.rect, p => {
            p.setBackgroundColor(ctx.shape);
        });
    }

    private createSpeaker(ctx: RenderContext) {
        const speakerRect = new Rect2((ctx.rect.width - 50) * 0.5, -25, 50, 4);

        ctx.renderer2.rectangle(0, 2, speakerRect, p => {
            p.setBackgroundColor(0x333333);
        });
    }
}
