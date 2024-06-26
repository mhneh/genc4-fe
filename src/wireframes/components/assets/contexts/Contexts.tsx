import { RootState, useAppDispatch } from "@app/wireframes/redux/store.ts";
import { useStore as useReduxStore } from "react-redux";
import {
  addShape,
  filterShapes,
  getContextsFilter,
  getDiagramId,
  getFilteredContexts,
  ShapeInfo,
  useStore,
} from "@app/wireframes/model";
import * as React from "react";
import { ShapeImage } from "@app/wireframes/components/assets/shapes/ShapeImage.tsx";
import { Grid, useEventCallback } from "@app/core";
import { Input } from "antd";
import { texts } from "@app/texts";
import { SearchOutlined } from "@ant-design/icons";

const keyBuilder = (shape: ShapeInfo) => {
  return shape.name;
};

export const Contexts = () => {
  const dispatch = useAppDispatch();
  const store = useReduxStore<RootState>();
  const contextsFiltered = useStore(getFilteredContexts);
  const contextsFilter = useStore(getContextsFilter);

  const cellRenderer = React.useCallback(
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

  const doFilterShapes = useEventCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(filterShapes(event.target.value));
    }
  );

  return (
    <>
      <div className="asset-shapes-search">
        <Input
          value={contextsFilter}
          onChange={doFilterShapes}
          placeholder={texts.common.findShape}
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
        />
      </div>

      <Grid
        className="asset-shapes-list"
        renderer={cellRenderer}
        columns={2}
        items={contextsFiltered}
        keyBuilder={keyBuilder}
      />
    </>
  );
};
