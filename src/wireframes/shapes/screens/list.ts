import { ShapePlugin } from "@app/wireframes/interface/shape/shape-plugin.ts";
import {
  ConfigurableFactory,
  DefaultAppearance,
  Rect2,
} from "@app/wireframes/interface";
import { RenderContext } from "@app/wireframes/interface/renderer/render-context.ts";
import { ShapeProperties } from "@app/wireframes/interface/shape/properties/shape-properties.ts";
import { CommonTheme } from "@app/wireframes/shapes/neutral/_theme.ts";
import { AssetType } from "@app/wireframes/interface/common/asset-type.ts";

const SHAPE = "SHAPE";
const SHAPE_RECTANGLE = "Rectangle";
const SHAPE_ROUNDED_RECTANGLE = "Rounded Rectangle";
const SHAPE_ELLIPSE = "Ellipse";
const SHAPE_TRIANGLE = "Triangle";
const SHAPE_RHOMBUS = "Rhombus";

const DEFAULT_APPEARANCE = {
  [DefaultAppearance.BACKGROUND_COLOR]: 0xFFFFFF,
  [DefaultAppearance.TEXT_DISABLED]: true,
  [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
  [DefaultAppearance.FOREGROUND_COLOR]: 0xccc,
  [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
  [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
  [DefaultAppearance.TEXT_ALIGNMENT]: "center",
  [DefaultAppearance.TEXT]: "List Screen",
  [DefaultAppearance.TITLE]: "List Screen",
  [DefaultAppearance.DESC]: "Screen displays all existing data in component.",
  [DefaultAppearance.TECH]: "List Screen",
  [DefaultAppearance.ACTION]: "list",
  [SHAPE]: "Rectangle",
};

const OFFSET = { left: 4, top: 70, right: 4, bottom: 15 };

const REFRESH_CODE = String.fromCharCode(0xf021);

export class ListScreen implements ShapePlugin {

  public identifier(): string {
    return "ListScreen";
  }

  public defaultAppearance() {
    return DEFAULT_APPEARANCE;
  }

  public defaultSize() {
    return { x: 250, y: 250 };
  }

  public configurables(factory: ConfigurableFactory) {
    return [
      factory.selection(SHAPE, "Shape", [
        SHAPE_RECTANGLE,
        SHAPE_ROUNDED_RECTANGLE,
        SHAPE_ELLIPSE,
        SHAPE_TRIANGLE,
        SHAPE_RHOMBUS,
      ]),
    ];
  }

  type(): AssetType {
    return "Screens";
  }

  public render(ctx: RenderContext) {
    this.createWindow(ctx);

    if (ctx.rect.width >= 50 && ctx.rect.height > 200) {
      this.createInner(ctx);
      this.createSearch(ctx);
      this.createButtons(ctx);
      this.createIcon(ctx);
    }

    this.createTitleShape(ctx);
    this.createTechShape(ctx);
    this.createDescShape(ctx);
  }

  private createWindow(ctx: RenderContext) {
    const windowRect = new Rect2(-OFFSET.left, -OFFSET.top, ctx.rect.width + OFFSET.left + OFFSET.right, ctx.rect.height + OFFSET.top + OFFSET.bottom);

    ctx.renderer2.rectangle(1, 0, windowRect, p => {
      p.setBackgroundColor(CommonTheme.CONTROL_BACKGROUND_COLOR);
      p.setStrokeColor(CommonTheme.CONTROL_BORDER_COLOR);
    });
  }

  private createInner(ctx: RenderContext) {
    ctx.renderer2.rectangle(0, 0, ctx.rect, p => {
      p.setBackgroundColor(ctx.shape);
    });
  }

  private createSearch(ctx: RenderContext) {
    const searchRect = new Rect2(50, -34, ctx.rect.width - 50, 30);

    ctx.renderer2.rectangle(1, 15, searchRect, p => {
      p.setBackgroundColor(0xffffff);
      p.setStrokeColor(CommonTheme.CONTROL_BORDER_COLOR);
    });
  }

  private createIcon(ctx: RenderContext) {
    const iconRect = new Rect2(5, -34, 30, 30);

    ctx.renderer2.text({ fontSize: 20, text: REFRESH_CODE, alignment: 'center' }, iconRect, p => {
      p.setForegroundColor(0x555555);
      p.setFontFamily('FontAwesome');
    });
  }

  private createButtons(ctx: RenderContext) {
    ctx.renderer2.ellipse(0, new Rect2(10, -50, 12, 12), p => {
      p.setBackgroundColor(0xff0000);
    });

    ctx.renderer2.ellipse(0, new Rect2(30, -50, 12, 12), p => {
      p.setBackgroundColor(0xffff00);
    });

    ctx.renderer2.ellipse(0, new Rect2(50, -50, 12, 12), p => {
      p.setBackgroundColor(0x00ff00);
    });
  }

  public render_old(ctx: RenderContext) {
    this.createShape(ctx);

    this.createTitleShape(ctx);
    this.createTechShape(ctx);
    this.createDescShape(ctx);
    // this.createText(ctx);
  }

  private createTitleShape(ctx: RenderContext) {
    const w = ctx.rect.width;
    const h = 30;
    const y = ctx.rect.bottom + 20;

    const bounds = new Rect2(0, y, w, h);

    ctx.renderer2.text(ctx.shape, bounds.deflate(4), (p) => {
      p.setText(ctx.shape.getAppearance(DefaultAppearance.TITLE));
      p.setForegroundColor(ctx.shape);
      p.setFontSize(20);
      p.setStrokeWidth(5);
    });
  }

  private createTechShape(ctx: RenderContext) {
    const w = ctx.rect.width;
    const h = 30;
    const y = ctx.rect.bottom + 20 + 30;

    const bounds = new Rect2(0, y, w, h);
    ctx.renderer2.text(
        ctx.shape,
        bounds.deflate(4),
        (p) => {
          p.setForegroundColor("0x8fbbfb");
          p.setText(
              ctx.shape.getAppearance(DefaultAppearance.TECH)
                  ? "[" + ctx.shape.getAppearance(DefaultAppearance.TECH) + "]"
                  : ""
          );
          p.setFontSize(16);
        },
        true
    );
  }

  private createDescShape(ctx: RenderContext) {
    const w = ctx.rect.width;
    const h = 80;
    const y = 60;

    const bounds = new Rect2(0, y, w, h);
    ctx.renderer2.rectangle(ctx.shape, 10, bounds, (p) => {
      this.styleShape(ctx, p);
      p.setStrokeColor("0xFFFFFF");
    });
    ctx.renderer2.textMultiline(
        ctx.shape,
        bounds.deflate(4),
        (p) => {
          p.setForegroundColor(ctx.shape);
          p.setText(ctx.shape.getAppearance(DefaultAppearance.DESC));
          p.setFontSize(16);
        },
        true
    );
  }

  private createShape(ctx: RenderContext) {
    ctx.renderer2.rectangle(ctx.shape, 10, ctx.rect, (p) => {
      this.styleShape(ctx, p);
    });
  }

  private styleShape(ctx: RenderContext, p: ShapeProperties) {
    p.setStrokeColor(ctx.shape);
    p.setBackgroundColor(ctx.shape);
  }

  isOpen(): boolean {
    return false;
  }
}
