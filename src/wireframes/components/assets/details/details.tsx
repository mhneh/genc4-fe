import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@app/wireframes/redux/store.ts";
import { useStore as useReduxStore } from "react-redux";
import {
  addShape,
  filterShapes,
  getComponentsFilter,
  getDiagramId,
  getFilteredComponents,
  ShapeInfo,
  useStore,
} from "@app/wireframes/model";
import * as React from "react";
import { ShapeImage } from "@app/wireframes/components/assets/shapes/ShapeImage.tsx";
import { Grid, useEventCallback } from "@app/core";
import { Input } from "antd";
import { texts } from "@app/texts";
import { SearchOutlined } from "@ant-design/icons";
import { useCallback } from "react";

const keyBuilder = (shape: ShapeInfo) => {
  return shape.name;
};

export const Screens = () => {
  const dispatch = useAppDispatch();
  const store = useReduxStore<RootState>();
  const detailsFiltered = useAppSelector((state) => state.assets.details);

  const cellRenderer = useCallback(
    (shape: ShapeInfo) => {
      const doAdd = () => {
        const selectedDiagramId = getDiagramId(store.getState());

        if (selectedDiagramId) {
          const shapePos = {
            position: {
              x: 100,
              y: 100,
            },
          };
          dispatch(addShape(selectedDiagramId, shape.name, shapePos));
        }
      };

      return (
        <div className="asset-shape">
          <div className="asset-shape-image-row" onDoubleClick={doAdd}>
            <ShapeImage shape={shape} />
          </div>

          <div className="asset-shape-title">{shape.displayName}</div>
        </div>
      );
    },
    [dispatch, store]
  );

  return (
    <Grid
      className="asset-shapes-list"
      renderer={cellRenderer}
      columns={2}
      items={detailsFiltered}
      keyBuilder={keyBuilder}
    />
  );
};
