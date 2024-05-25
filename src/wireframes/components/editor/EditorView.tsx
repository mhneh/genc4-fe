/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import { Dropdown } from "antd";
import { MouseEvent, useRef, useState } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import { findDOMNode } from "react-dom";
import {
  loadImagesToClipboardItems,
  MathHelper,
  sizeInPx,
  useClipboard,
  useEventCallback,
} from "@app/core";
import { useAppDispatch } from "@app/wireframes/redux/store.ts";
import {
  addDiagram,
  addShape,
  changeItemsAppearance,
  Diagram,
  DiagramRef,
  getDiagram,
  getDiagramId,
  getDiagrams,
  getEditor,
  getMasterDiagram,
  getSelection,
  ItemsRef,
  RendererService,
  selectDiagram,
  selectItems,
  selectTab,
  Transform,
  transformItems,
  useStore,
} from "@app/wireframes/model";
import { Editor } from "@app/wireframes/renderer/editor/Editor.tsx";
import { useContextMenu } from "../context-menu";
import "./EditorView.scss";
import { ShapeSource } from "@app/wireframes/interface/shape/source/shape-source.ts";
import { addRelationship } from "@app/wireframes/redux/reducers/relationships.ts";

export interface EditorViewProps {
  // The spacing.
  spacing: number;
}

export const EditorView = (props: EditorViewProps) => {
  const diagram = useStore(getDiagram);

  if (!diagram) {
    return null;
  }

  return <EditorViewInner {...props} diagram={diagram} />;
};

export const EditorViewInner = ({
  diagram,
  spacing,
}: EditorViewProps & { diagram: Diagram }) => {
  const dispatch = useAppDispatch();
  const [menuVisible, setMenuVisible] = useState(false);
  const editor = useStore(getEditor);
  const editorColor = editor.color;
  const editorSize = editor.size;
  const masterDiagram = useStore(getMasterDiagram);
  const renderRef = useRef<any>();
  const selectedPoint = useRef({ x: 0, y: 0 });
  const selectedDiagramId = useStore(getDiagramId);
  const state = useStore((s) => s);
  const zoom = useStore((s) => s.ui.zoom);
  const zoomedSize = editorSize.mul(zoom);
  const contextMenu = useContextMenu(menuVisible);
  const diagrams = useStore(getDiagrams);

  const doChangeItemsAppearance = useEventCallback(
    (diagram: DiagramRef, visuals: ItemsRef, key: string, value: any) => {
      dispatch(changeItemsAppearance(diagram, visuals, key, value));
    }
  );

  const doSelectItems = useEventCallback(
    (diagram: DiagramRef, items: ItemsRef) => {
      dispatch(selectItems(diagram, items));
    }
  );

  const doTransformItems = useEventCallback(
    (
      diagram: DiagramRef,
      items: ItemsRef,
      oldBounds: Transform,
      newBounds: Transform
    ) => {
      dispatch(transformItems(diagram, items, oldBounds, newBounds));
    }
  );

  const doConnectItems = useEventCallback(
    (diagram: string, source: string, target: string) => {
      dispatch(addRelationship(diagram, { source, target }));
    }
  );

  const doSetPosition = useEventCallback((event: MouseEvent) => {
    selectedPoint.current = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
  });

  const doPaste = useEventCallback(
    (sources: ReadonlyArray<ShapeSource>, x: number, y: number) => {
      if (!selectedDiagramId) {
        return;
      }

      const shapes = RendererService.createShapes(sources);

      for (const shape of shapes) {
        const { appearance, renderer, size } = shape;
        const newShapeProps = {
          position: { x, y },
          size,
          appearance,
        };
        dispatch(addShape(selectedDiagramId, renderer, newShapeProps));

        x += 40;
        y += 40;
      }
    }
  );

  const doLink = useEventCallback((selectedId: string, title?: string) => {
    const child: Diagram | undefined = diagrams.values.find(
      (d) => d.parentId == selectedId
    );
    if (!child) {
      dispatch(
        addDiagram(MathHelper.nextId(), title, selectedId, "Components")
      );
    } else {
      dispatch(selectDiagram(child.id));
    }
    if (child?.type) {
      dispatch(selectTab(child?.type));
      if (child.type === "Contexts") {
        const contextDiagram = diagrams.values.find(
          (item, _) => item.type === "Contexts"
        );
        contextDiagram && dispatch(selectDiagram(contextDiagram));
        return;
      }
      if (child.type === "Containers") {
        const contextDiagram = diagrams.values.find(
          (item, _) => item.type === "Containers"
        );
        contextDiagram && dispatch(selectDiagram(contextDiagram));
        return;
      }
      if (child.type === "Components") {
        const contextDiagram = diagrams.values.find(
          (item, _) => item.type === "Components"
        );
        contextDiagram && dispatch(selectDiagram(contextDiagram));
        return;
      }
    }
  });

  useClipboard({
    onPaste: (event) => {
      if (!selectedDiagramId) {
        return;
      }

      const x = selectedPoint.current.x;
      const y = selectedPoint.current.y;

      doPaste(event.items, x, y);
    },
  });

  const [, drop] = useDrop({
    accept: [
      NativeTypes.URL,
      NativeTypes.FILE,
      NativeTypes.TEXT,
      "DND_ASSET",
      "DND_ICON",
    ],
    drop: async (item: any, monitor: DropTargetMonitor) => {
      if (!monitor || !renderRef.current || !selectedDiagramId) {
        return;
      }

      let offset = monitor.getSourceClientOffset();

      if (!offset) {
        offset = monitor.getClientOffset();
      }

      if (!offset) {
        return;
      }

      const componentRect = (findDOMNode(
        renderRef.current
      ) as HTMLElement)!.getBoundingClientRect();

      let x = ((offset?.x || 0) - spacing - componentRect.left) / zoom;
      let y = ((offset?.y || 0) - spacing - componentRect.top) / zoom;
      switch (monitor.getItemType()) {
        case "DND_ASSET":
          dispatch(
            addShape(selectedDiagramId, item["name"], {
              position: { x, y },
              type: item["plugin"].type(),
            })
          );
          break;
        case "DND_ICON":
          doPaste([{ type: "Icon", ...item }], x, y);
          break;
        case NativeTypes.TEXT:
          doPaste([{ type: "Text", ...item }], x, y);
          break;
        case NativeTypes.URL: {
          const urls: string[] = item.urls;

          doPaste(
            urls.map((url) => ({ type: "Url", url })),
            x,
            y
          );
          break;
        }
        case NativeTypes.FILE: {
          const files: FileList | File[] = item.files;

          doPaste(await loadImagesToClipboardItems(files), x, y);
          break;
        }
      }
    },
  });

  drop(renderRef);

  const zoomedOuterWidth = 2 * spacing + zoomedSize.x;
  const zoomedOuterHeight = 2 * spacing + zoomedSize.y;

  const w = sizeInPx(zoomedOuterWidth);
  const h = sizeInPx(zoomedOuterHeight);

  const padding = sizeInPx(spacing);

  return (
    <Dropdown
      menu={contextMenu}
      trigger={["contextMenu"]}
      onOpenChange={setMenuVisible}
    >
      <div className="editor-view" onClick={doSetPosition}>
        <div
          className="editor-diagram"
          style={{ width: w, height: h, padding }}
          ref={renderRef}
        >
          <Editor
            color={editorColor}
            diagram={diagram}
            masterDiagram={masterDiagram}
            onChangeItemsAppearance={doChangeItemsAppearance}
            onSelectItems={doSelectItems}
            onTransformItems={doTransformItems}
            onConnectItems={doConnectItems}
            selectionSet={getSelection(state)}
            viewSize={editor.size}
            zoom={zoom}
            zoomedSize={zoomedSize}
            isDefaultView={true}
            onLinkContainer={doLink}
          />
        </div>
      </div>
    </Dropdown>
  );
};
