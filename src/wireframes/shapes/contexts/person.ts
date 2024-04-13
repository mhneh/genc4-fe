import {ShapePlugin} from "@app/wireframes/interface/shape/shape-plugin.ts";
import {ConfigurableFactory, DefaultAppearance, Rect2, Vec2} from "@app/wireframes/interface";
import {RenderContext} from "@app/wireframes/interface/renderer/render-context.ts";
import {ShapeProperties} from "@app/wireframes/interface/shape/properties/shape-properties.ts";
import {CommonTheme} from "@app/wireframes/shapes/neutral/_theme.ts";
import {AssetType} from "@app/wireframes/interface/common/asset-type.ts";

const SHAPE = 'SHAPE';
const SHAPE_RECTANGLE = 'Rectangle';
const SHAPE_ROUNDED_RECTANGLE = 'Rounded Rectangle';
const SHAPE_ELLIPSE = 'Ellipse';
const SHAPE_TRIANGLE = 'Triangle';
const SHAPE_RHOMBUS = 'Rhombus';

const RECT_RADIUS = 35;

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0x08427b,
    [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
    [DefaultAppearance.FOREGROUND_COLOR]: 0xFFFFFF,
    [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
    [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
    [DefaultAppearance.TEXT_ALIGNMENT]: 'center',
    [DefaultAppearance.TEXT]: 'PersonalOwner',
    [DefaultAppearance.TITLE]: 'Personal Owner',
    [DefaultAppearance.DESC]: 'Single user of this blog system.',
    [DefaultAppearance.TECH]: 'Person',
    [SHAPE]: 'PERSON',
};

export class PersonalOwner implements ShapePlugin {

    public identifier(): string {
        return 'PersonalOwner';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return {x: 250, y: 160};
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
        return "Contexts";
    }

    public render(ctx: RenderContext) {
        this.createShape(ctx);


        this.createHead(ctx);
        this.createTitleShape(ctx);
        this.createTechShape(ctx);
        this.createDescShape(ctx);

        // this.createText(ctx);
    }

    private createHead(ctx: RenderContext) {
        const radius = 100;
        const x = ctx.rect.width / 2 - radius / 2;
        const y = 0 - 5 * radius / 6;
        ctx.renderer2.ellipse(0, new Rect2(x, y, radius, radius), p => {
            p.setBackgroundColor(ctx.shape);
            p.setStrokeColor(0x08427b);
        });
    }

    private createTitleShape(ctx: RenderContext) {
        const w = ctx.rect.width;
        const h = 30;
        const y = 10;

        const bounds = new Rect2(0, y, w, h);
        ctx.renderer2.rectangle(ctx.shape, RECT_RADIUS, bounds, p => {
            this.styleShape(ctx, p);
            p.setStrokeColor('0xFFFFFF');
        });
        ctx.renderer2.text(ctx.shape, bounds.deflate(4), p => {
            p.setText(ctx.shape.getAppearance(DefaultAppearance.TITLE));
            p.setForegroundColor(ctx.shape);
        });
    }

    private createTechShape(ctx: RenderContext) {
        const w = ctx.rect.width;
        const h = 25;
        const y = 41;

        const bounds = new Rect2(0, y, w, h);
        ctx.renderer2.rectangle(ctx.shape, RECT_RADIUS, bounds, p => {
            this.styleShape(ctx, p);
            p.setStrokeColor('0xFFFFFF');
        });
        ctx.renderer2.text(ctx.shape, bounds.deflate(4), p => {
            p.setText(ctx.shape.getAppearance(DefaultAppearance.TECH)
                ? '[' + ctx.shape.getAppearance(DefaultAppearance.TECH) + ']'
                : '');
            p.setFontSize(12);
        }, true);
    }

    private createDescShape(ctx: RenderContext) {
        const w = ctx.rect.width;
        const h = 80;
        const y = 70;

        const bounds = new Rect2(0, y, w, h);
        ctx.renderer2.rectangle(ctx.shape, RECT_RADIUS, bounds, p => {
            this.styleShape(ctx, p);
            p.setStrokeColor('0xFFFFFF');
        });
        ctx.renderer2.textMultiline(ctx.shape, bounds.deflate(4), p => {
            p.setForegroundColor(ctx.shape);
            p.setText(ctx.shape.getAppearance(DefaultAppearance.DESC));
            p.setFontSize(12);
        }, true);
    }

    private createShape(ctx: RenderContext) {
        ctx.renderer2.rectangle(ctx.shape, RECT_RADIUS, ctx.rect, p => {
            this.styleShape(ctx, p);
        });
    }

    private styleShape(ctx: RenderContext, p: ShapeProperties) {
        p.setStrokeColor(ctx.shape);
        p.setBackgroundColor(ctx.shape);
    }

}