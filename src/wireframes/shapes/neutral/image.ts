/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import {
  ConfigurableFactory,
  DefaultAppearance,
} from "@app/wireframes/interface";
import { CommonTheme } from "./_theme";
import { RenderContext } from "@app/wireframes/interface/renderer/render-context.ts";
import { ShapePlugin } from "@app/wireframes/interface/shape/shape-plugin.ts";
import { AssetType } from "@app/wireframes/interface/common/asset-type.ts";

const IMAGE_URL = "URL";
const IMAGE_ASPECT_RATIO = "ASPECT_RATIO";

const DEFAULT_APPEARANCE = {
  [DefaultAppearance.BACKGROUND_COLOR]: 0xffffff,
  [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
  [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
  [DefaultAppearance.TEXT_DISABLED]: true,
  [IMAGE_ASPECT_RATIO]: true,
  [IMAGE_URL]: "other.png",
};

export class Image implements ShapePlugin {
  type(): AssetType {
    return "Shape";
  }
  public identifier(): string {
    return "Image";
  }

  public defaultAppearance() {
    return DEFAULT_APPEARANCE;
  }

  public defaultSize() {
    return { x: 100, y: 100 };
  }

  public configurables(factory: ConfigurableFactory) {
    return [
      factory.text(IMAGE_URL, "Url"),
      factory.toggle(IMAGE_ASPECT_RATIO, "Preserve aspect ratio"),
    ];
  }

  public render(ctx: RenderContext) {
    const url = ctx.shape.getAppearance(IMAGE_URL);

    if (url) {
      const aspectRatio = ctx.shape.getAppearance(IMAGE_ASPECT_RATIO);

      ctx.renderer2.raster(url, ctx.rect, aspectRatio);
    } else {
      this.createBorder(ctx);
      this.createCross(ctx);
    }
  }

  private createCross(ctx: RenderContext) {
    const l = ctx.rect.left + 0.5;
    const r = ctx.rect.right - 0.5;
    const t = ctx.rect.top + 0.5;
    const b = ctx.rect.bottom - 0.5;

    const path = `M${l},${t} L${r},${b} M${l},${b} L${r},${t}`;

    ctx.renderer2.path(ctx.shape, path, (p) => {
      p.setStrokeColor(ctx.shape);
      p.setStrokeStyle("butt", "butt");
    });
  }

  private createBorder(ctx: RenderContext) {
    ctx.renderer2.rectangle(ctx.shape, 0, ctx.rect, (p) => {
      p.setBackgroundColor(ctx.shape);
      p.setStrokeColor(ctx.shape);
    });
  }
}
