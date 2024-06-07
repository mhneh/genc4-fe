/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
 */

import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {Alert, Button, Layout, Spin, Tabs, TabsProps} from "antd";
import classNames from "classnames";
import * as React from "react";
import { useHistory, useRouteMatch } from "react-router";
import { ClipboardContainer, useEventCallback, usePrinter } from "@app/core";
import {
  ArrangeMenu,
  ClipboardMenu,
  EditorView,
  HistoryMenu,
  Icons,
  LoadingMenu,
  LockMenu,
  Pages,
  PrintView,
  Properties,
  SettingsMenu,
  Shapes,
  UIMenu,
} from "@app/wireframes/components";
import {
    EditorStateInStore, getLoadingStatus,
    loadDiagramFromServer,
    newDiagram,
    removeDiagram,
    selectDiagram,
    selectTab,
    showToast,
    toggleLeftSidebar,
    toggleRightSidebar, UIStateInStore,
    useStore,
} from "@app/wireframes/model";
import { useAppDispatch, useAppSelector } from "./wireframes/redux/store.ts";
import { texts } from "./texts";
import { CustomDragLayer } from "./wireframes/components/drag/CustomDragLayer.tsx";
import { PresentationView } from "./wireframes/components/presentation/PresentationView.tsx";
import { OverlayContainer } from "./wireframes/contexts/OverlayContext";
import { Components } from "@app/wireframes/components/assets/components/Components.tsx";
import { Contexts } from "@app/wireframes/components/assets/contexts/Contexts.tsx";
import { Containers } from "@app/wireframes/components/assets/containers/Containers.tsx";
import { SelectSystem } from "@app/wireframes/components/modals/SelectSystem.tsx";
import { DescriptionAppender } from "@app/wireframes/components/modals/DescriptionAppender.tsx";
import { Screens } from "./wireframes/components/assets/details/details.tsx";
import { RelationshipCreator } from "@app/wireframes/components/modals/RelationshipCreator.tsx";
import { C4Breadcrumb } from "@app/wireframes/components/breadcrumb/C4Breadcrumb.tsx";
import styled from "styled-components";

const SidebarTabs: TabsProps["items"] = [
  // {
  //   key: "Pages",
  //   label: texts.common.level,
  //   children: <Pages />,
  // },
  {
    key: "Contexts",
    label: texts.common.contexts,
    children: <Contexts />,
  },
  {
    key: "Containers",
    label: texts.common.containers,
    children: <Containers />,
  },
  {
    key: "Components",
    label: texts.common.components,
    children: <Components />,
  },
  {
    key: "Screens",
    label: texts.common.screens,
    children: <Screens />,
  },
  // {
  //   key: "Shapes",
  //   label: texts.common.shapes,
  //   children: <Shapes />,
  // },
  // {
  //   key: "Icons",
  //   label: texts.common.icons,
  //   children: <Icons />,
  // },
  // {
  //     key: 'outline',
  //     label: texts.common.outline,
  //     children: <Outline/>,
  // },
  // {
  //     key: 'recent',
  //     label: texts.common.recent,
  //     children: <Recent/>,
  // },
];

export const App = () => {
  const system = useStore((s) => s.editor.present.system);
  const diagrams = useAppSelector(
    (state: EditorStateInStore) => state.editor.present.diagrams
  );
  const dispatch = useAppDispatch();
  const route = useRouteMatch<{ token?: string }>();
  const routeToken = route.params.token || null;
  const routeTokenSnapshot = React.useRef(routeToken);
  const selectedTab = useStore((s) => s.ui.selectedTab);
  const showLeftSidebar = useStore((s) => s.ui.showLeftSidebar);
  const showRightSidebar = useStore((s) => s.ui.showRightSidebar);
  const [presenting, setPresenting] = React.useState(false);
  const history = useHistory();
  const isLoading = useAppSelector((state: UIStateInStore) => state.ui.isLoading);
  const [print, printReady, isPrinting, ref] = usePrinter();
  React.useEffect(() => {
    dispatch(selectTab("Contexts"));
    const contextDiagram = diagrams.values.find(
      (item, _) => item.type === "Contexts"
    );
    contextDiagram && dispatch(selectDiagram(contextDiagram));
  }, []);

  React.useEffect(() => {
    const token = routeTokenSnapshot.current;

    if (token && token.length > 0) {
      dispatch(loadDiagramFromServer({ tokenToRead: token, navigate: false }));
    } else {
      dispatch(newDiagram(false));
    }
  }, [dispatch]);

  React.useEffect(() => {
    if (isPrinting) {
      dispatch(showToast(texts.common.printingStarted));
    }
  }, [dispatch, isPrinting]);

  const doSelectTab = useEventCallback((key: string) => {
    dispatch(selectTab(key));
  });

  const doToggleLeftSidebar = useEventCallback(() => {
    dispatch(toggleLeftSidebar());
  });

  const doToggleRightSidebar = useEventCallback(() => {
    dispatch(toggleRightSidebar());
  });

  const doEdit = useEventCallback(() => {
    setPresenting(false);
  });

  const doPresent = useEventCallback(() => {
    setPresenting(true);
  });

  const openHomepage = () => {
    history.push("/");
  };

  if (!system && !routeToken) {
    return <SelectSystem />;
  }

  return (
    <OverlayContainer>
      <ClipboardContainer>
        <Layout className="screen-mode">
          <Layout.Header>
            <div className="top-menu">
              <Logo
                className="logo"
                src="/c4-logo.png"
                alt="C4"
                onClick={openHomepage}
              />

              <div>
                <HistoryMenu />
                <span className="menu-separator" />

                <LockMenu />
                <span className="menu-separator" />

                <ArrangeMenu />
                <span className="menu-separator" />

                <ClipboardMenu />
                <span className="menu-separator" />

                <UIMenu onPlay={doPresent} />
                <span className="menu-separator" />

                <SettingsMenu onPrint={print} />
              </div>

              <div>
                <LoadingMenu />
              </div>
            </div>
          </Layout.Header>
          <Layout className="content">
            <Layout.Sider
              width={300}
              className="sidebar-left"
              collapsed={!showLeftSidebar}
              collapsedWidth={0}
            >
              <Tabs
                type="card"
                activeKey={selectedTab}
                defaultActiveKey={"Contexts"}
                items={SidebarTabs}
                onTabClick={(activeKey) => {
                  if (activeKey === "Components" || activeKey === "Screens") {
                    dispatch(removeDiagram(""));
                    return;
                  }
                  if (activeKey === "Contexts") {
                    const contextDiagram = diagrams.values.find(
                      (item, _) => item.type === "Contexts"
                    );
                    contextDiagram && dispatch(selectDiagram(contextDiagram));
                    return;
                  }
                  if (activeKey === "Containers") {
                    const contextDiagram = diagrams.values.find(
                      (item, _) => item.type === "Containers"
                    );
                    contextDiagram && dispatch(selectDiagram(contextDiagram));
                    return;
                  }
                }}
                onChange={doSelectTab}
                destroyInactiveTabPane={true}
              />
            </Layout.Sider>

            <Layout.Content className="editor-content">
              <C4Breadcrumb />
              <EditorView spacing={20} />
            </Layout.Content>

            <Layout.Sider
              width={400}
              className="sidebar-right"
              collapsed={!showRightSidebar}
              collapsedWidth={0}
            >
              <Properties />
            </Layout.Sider>

            <Button
              icon={showLeftSidebar ? <LeftOutlined /> : <RightOutlined />}
              className={classNames("toggle-button-left", {
                visible: showLeftSidebar,
              })}
              size="small"
              shape="circle"
              onClick={doToggleLeftSidebar}
            />

            <Button
              icon={showRightSidebar ? <RightOutlined /> : <LeftOutlined />}
              className={classNames("toggle-button-right", {
                visible: showRightSidebar,
              })}
              size="small"
              shape="circle"
              onClick={doToggleRightSidebar}
            />
          </Layout>
        </Layout>

        {presenting && <PresentationView onClose={doEdit} />}

        {isPrinting && (
          <div className="print-mode" ref={ref}>
            <PrintView onRender={printReady} />
          </div>
        )}

        <CustomDragLayer />
      </ClipboardContainer>

            <DescriptionAppender/>
            <RelationshipCreator/>

            <Spin tip="Loading..." spinning={isLoading} fullscreen={true} size={"large"} />
        </OverlayContainer>
    );
};

const Logo = styled.img`
  &:hover {
    cursor: pointer;
  }
`;
