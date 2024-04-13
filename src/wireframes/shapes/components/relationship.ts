import {ShapePlugin} from "@app/wireframes/interface/shape/shape-plugin.ts";
import {ConfigurableFactory, DefaultAppearance, Rect2} from "@app/wireframes/interface";
import {RenderContext} from "@app/wireframes/interface/renderer/render-context.ts";
import {CommonTheme} from "@app/wireframes/shapes/neutral/_theme.ts";
import {AssetType} from "@app/wireframes/interface/common/asset-type.ts";

const SHAPE = 'SHAPE';
const SHAPE_RECTANGLE = 'Rectangle';
const SHAPE_ROUNDED_RECTANGLE = 'Rounded Rectangle';
const SHAPE_ELLIPSE = 'Ellipse';
const SHAPE_TRIANGLE = 'Triangle';
const SHAPE_RHOMBUS = 'Rhombus';

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0x1168bd,
    [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
    [DefaultAppearance.FOREGROUND_COLOR]: 0xFFFFFF,
    [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
    [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
    [DefaultAppearance.TEXT_ALIGNMENT]: 'center',
    [DefaultAppearance.TEXT]: 'EmailComponent',
    [DefaultAppearance.TITLE]: 'Email Component',
    [DefaultAppearance.DESC]: 'Sends e-mails to users.',
    [DefaultAppearance.TECH]: 'Spring Bean',
    [SHAPE]: SHAPE_ROUNDED_RECTANGLE,
};

export class Relationship implements ShapePlugin {

    public identifier(): string {
        return 'Relationship';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return {
            x: 250, y: 10
        };
    }

    public configurables(factory: ConfigurableFactory) {
        return [
            factory.selection(SHAPE, 'Shape', [
                SHAPE_RECTANGLE,
                SHAPE_ROUNDED_RECTANGLE,
                SHAPE_ELLIPSE,
                SHAPE_TRIANGLE,
                SHAPE_RHOMBUS,
            ]),
        ];
    }

    type(): AssetType {
        return "";
    }

    showInGallery(): boolean {
        return false;
    }

    public render(ctx: RenderContext) {
        const w = ctx.rect.width;
        const h = 30;
        const y = 0;

        const bounds = new Rect2(0, y, w, h);
        ctx.renderer2.rectangle(ctx.shape, 10, bounds, p => {
            p.setBackgroundColor('0x1168bd');
            p.setStrokeColor('0x1168bd');
        });
        ctx.renderer2.text(ctx.shape, bounds.deflate(4), p => {
            p.setForegroundColor(ctx.shape);
        });

        console.log(ctx.form)
        ctx.renderer2.drawLine(ctx.form.source.transform.position,
            ctx.form.target.transform.position,
            p => {
                p.setBackgroundColor('0x1168bd');
                p.setStrokeColor('0x1168bd');
            });
    }

}