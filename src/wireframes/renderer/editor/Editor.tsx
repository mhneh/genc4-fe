/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

/* eslint-disable react-hooks/exhaustive-deps */

import * as svg from "@svgdotjs/svg.js";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Color, Rect2, Subscription, SVGHelper, Vec2 } from "@app/core";
import {
  Diagram,
  DiagramItem,
  DiagramItemSet,
  toggleDescModal,
  Transform,
} from "@app/wireframes/model";
import { useOverlayContext } from "../../contexts/OverlayContext.tsx";
import { CanvasView } from "./CanvasView.tsx";
import { NavigateAdorner } from "@app/wireframes/renderer/adorner/navigate/NavigateAdorner.tsx";
import { QuickbarAdorner } from "@app/wireframes/renderer/adorner/quickbar/QuickbarAdorner.tsx";
import { RenderLayer } from "../render/RenderLayer.tsx";
import { SelectionAdorner } from "@app/wireframes/renderer/adorner/selection/SelectionAdorner.tsx";
import { TextAdorner } from "@app/wireframes/renderer/adorner/text/TextAdorner.tsx";
import { TransformAdorner } from "@app/wireframes/renderer/adorner/transform/TransformAdorner.tsx";
import { InteractionOverlays } from "../interaction/interaction-overlays.ts";
import { InteractionService } from "../interaction/interaction-service.ts";
import { PreviewEvent } from "../common/preview.ts";
import "./Editor.scss";
import { useAppDispatch } from "@app/wireframes/redux/store.ts";

export interface EditorProps {
  // The selected diagram.
  diagram: Diagram;

  // The master diagram.
  masterDiagram?: Diagram;

  // The selected items.
  selectionSet: DiagramItemSet;

  // The zoomed width of the canvas.
  zoomedSize: Vec2;

  // The color.
  color: Color;

  // The optional viewbox.
  viewBox?: Rect2;

  // The view size.
  viewSize: Vec2;

  // The zoom value of the canvas.
  zoom: number;

  // True, if it is the default view.
  isDefaultView: boolean;

  // True when rendered.
  onRender?: () => void;

  // A function to select a set of items.
  onSelectItems?: (diagram: Diagram, itemIds: ReadonlyArray<string>) => any;

  // A function to change the appearance of a visual.
  onChangeItemsAppearance?: (
    diagram: Diagram,
    visuals: ReadonlyArray<DiagramItem>,
    key: string,
    val: any
  ) => any;

  onConnectItems?: (diagramId: string, source: string, target: string) => any;

  // A function that is invoked when the user clicked a link.
  onNavigate?: (item: DiagramItem, link: string) => void;

  // A function to transform a set of items.
  onTransformItems?: (
    diagram: Diagram,
    items: ReadonlyArray<DiagramItem>,
    oldBounds: Transform,
    newBounds: Transform
  ) => any;

  onLinkContainer: (selectedId: string, title?: string) => void;
}

export const Editor = memo((props: EditorProps) => {
  const dispatch = useAppDispatch();
  const {
    color,
    diagram,
    isDefaultView,
    masterDiagram,
    onChangeItemsAppearance,
    onNavigate,
    onRender,
    onSelectItems,
    onTransformItems,
    selectionSet,
    viewBox,
    viewSize,
    zoom,
    zoomedSize,
    onLinkContainer,
  } = props;

  const adornerSelectLayer = useRef<svg.Container>();

  const adornerTransformLayer = useRef<svg.Container>();

  const diagramTools = useRef<svg.Element>();

  const overlayContext = useOverlayContext();

  const overlayLayer = useRef<svg.Container>();

  const renderMainLayer = useRef<svg.Container>();

  const renderMasterLayer = useRef<svg.Container>();

  const [interactionMasterService, setInteractionMasterService] =
    useState<InteractionService>();

  const [interactionMainService, setInteractionMainService] =
    useState<InteractionService>();

  // Use a stream of preview updates to bypass react for performance reasons.
  const renderPreview = useRef(new Subscription<PreviewEvent>());

  const doInit = useCallback((doc: svg.Svg) => {
    // Create these layers in the correct order.
    diagramTools.current = doc.rect().fill("transparent");
    renderMasterLayer.current = doc.group().id("masterLayer");
    renderMainLayer.current = doc.group().id("parentLayer");
    adornerSelectLayer.current = doc.group().id("selectLayer");
    adornerTransformLayer.current = doc.group().id("transformLayer");
    overlayLayer.current = doc.group().id("overlaysLayer");

    setInteractionMainService(
      new InteractionService(
        [adornerSelectLayer.current, adornerTransformLayer.current],
        renderMainLayer.current,
        doc
      )
    );

    setInteractionMasterService(
      new InteractionService(
        [adornerSelectLayer.current, adornerTransformLayer.current],
        renderMasterLayer.current,
        doc
      )
    );

    if (isDefaultView) {
      overlayContext.overlayManager = new InteractionOverlays(
        overlayLayer.current
      );
    }
  }, []);

  useEffect(() => {
    if (!interactionMainService) {
      return;
    }

    const w = viewSize.x;
    const h = viewSize.y;

    SVGHelper.setSize(diagramTools.current!, w, h);
    SVGHelper.setSize(adornerSelectLayer.current!, w, h);
    SVGHelper.setSize(adornerTransformLayer.current!, w, h);
    SVGHelper.setSize(diagramTools.current!, 0.5, 0.5);
    SVGHelper.setSize(renderMasterLayer.current!, w, h);
    SVGHelper.setSize(renderMainLayer.current!, w, h);
  }, [viewSize, interactionMainService]);

  useEffect(() => {
    overlayContext.snapManager.prepare(diagram, viewSize);
  }, [diagram, overlayContext.snapManager, viewSize]);

  useEffect(() => {
    (overlayContext.overlayManager as any)["setZoom"]?.(zoom);
  }, [diagram, overlayContext.overlayManager, zoom]);

  return (
    <div
      className="editor"
      style={{ background: color.toString() }}
      ref={(element) => (overlayContext.element = element)}
    >
      <CanvasView
        onInit={doInit}
        viewBox={viewBox}
        viewSize={viewSize}
        zoom={zoom}
        zoomedSize={zoomedSize}
      />

      {interactionMainService && diagram && (
        <>
          <RenderLayer
            diagram={masterDiagram}
            diagramLayer={renderMasterLayer.current!}
            onRender={onRender}
          />

          <RenderLayer
            diagram={diagram}
            diagramLayer={renderMainLayer.current!}
            preview={renderPreview.current}
            onRender={onRender}
          />

          {onTransformItems && (
            <TransformAdorner
              adorners={adornerTransformLayer.current!}
              interactionService={interactionMainService}
              onTransformItems={onTransformItems}
              overlayManager={overlayContext.overlayManager}
              previewStream={renderPreview.current}
              selectedDiagram={diagram}
              selectionSet={selectionSet}
              snapManager={overlayContext.snapManager}
              viewSize={viewSize}
              zoom={zoom}
            />
          )}

          {onSelectItems && (
            <SelectionAdorner
              adorners={adornerSelectLayer.current!}
              interactionService={interactionMainService}
              onSelectItems={onSelectItems}
              previewStream={renderPreview.current}
              selectedDiagram={diagram}
              selectionSet={selectionSet}
              zoom={zoom}
            />
          )}

          {onChangeItemsAppearance && (
            <TextAdorner
              interactionService={interactionMainService}
              onChangeItemsAppearance={onChangeItemsAppearance}
              selectedDiagram={diagram}
              selectionSet={selectionSet}
              zoom={zoom}
              onLinkContainer={onLinkContainer}
              toggleDescModal={() => dispatch(toggleDescModal())}
            />
          )}

          {onTransformItems && (
            <QuickbarAdorner
              previewStream={renderPreview.current}
              selectedDiagram={diagram}
              selectionSet={selectionSet}
              viewSize={viewSize}
              zoom={zoom}
            />
          )}

          {/*{onConnectItems &&*/}
          {/*    <RelationshipAdorner*/}
          {/*        adorners={adornerRelationshipLayer.current!}*/}
          {/*        interactionService={interactionMainService}*/}
          {/*        overlayManager={overlayContext.overlayManager}*/}
          {/*        previewStream={renderPreview.current}*/}
          {/*        selectedDiagram={diagram}*/}
          {/*        selectionSet={selectionSet}*/}
          {/*        snapManager={overlayContext.snapManager}*/}
          {/*        onConnectItems={onConnectItems}*/}
          {/*    />*/}
          {/*}*/}

          {onNavigate && (
            <NavigateAdorner
              interactionService={interactionMainService}
              onNavigate={onNavigate}
            />
          )}

          {onNavigate && interactionMasterService && (
            <NavigateAdorner
              interactionService={interactionMasterService}
              onNavigate={onNavigate}
            />
          )}
        </>
      )}
    </div>
  );
});
