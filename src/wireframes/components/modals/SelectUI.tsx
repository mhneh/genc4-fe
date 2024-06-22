import { memo, useCallback, useEffect, useState } from "react";
import { Image, Input, Menu, Modal } from "antd";
import { selectSystem, useAppDispatch } from "@app/wireframes/redux/store.ts";
import {
  loadDiagramFromFile,
  saveDiagramToServer,
} from "@app/wireframes/redux/thunk/loading.ts";
import Icon, { SearchOutlined } from "@ant-design/icons";
import blogSystemJson from "../../../specs/blog-system.json";
import { texts } from "@app/texts";
import { Grid } from "@app/core";
import * as React from "react";

const SelectUI = memo(() => {
  const dispatch = useAppDispatch();
  const [isOpen, setOpen] = useState(false);
  const [searchingUI, setSearchingUI] = useState("");
  const [ui, setUI] = useState("");

  const doSelectUI = useCallback(() => {
    dispatch(null);
  }, []);

  return (
    <Modal
      title={"Select System"}
      open={isOpen}
      onCancel={() => null}
      onOk={doSelectUI}
    >
      <div className="asset-shapes-search">
        <Input
          value={searchingUI}
          onChange={(e) => setSearchingUI(e.target.value)}
          placeholder={texts.common.findShape}
          prefix={<SearchOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
        />
      </div>

      <Grid
        className="asset-shapes-list"
        renderer={cellRenderer}
        columns={2}
        items={shapesFiltered}
        keyBuilder={keyBuilder}
      />
    </Modal>
  );
});
