import {RootState, useAppDispatch} from "@app/wireframes/redux/store.ts";
import {useStore as useReduxStore} from "react-redux";
import {
    addShape, filterComponents,
    filterShapes,
    getComponentsFilter,
    getDiagramId,
    getFilteredComponents, getSelection,
    ShapeInfo,
    useStore,
} from "@app/wireframes/model";
import * as React from "react";
import {ShapeImage} from "@app/wireframes/components/assets/shapes/ShapeImage.tsx";
import {Grid, useEventCallback} from "@app/core";
import {Collapse, Input} from "antd";
import {texts} from "@app/texts";
import {SearchOutlined, ShakeOutlined} from "@ant-design/icons";
import {useCallback} from "react";
import {CollapseProps} from "antd/lib";
import classNames from "classnames";


const keyBuilder = (shape: ShapeInfo) => {
    return shape.name;
};

export const Components = () => {
    const dispatch = useAppDispatch();
    const hasSelection = useStore(getSelection).selectedItems.length > 0;
    const store = useReduxStore<RootState>();
    const componentsFiltered = useStore(getFilteredComponents);
    const componentsFilter = useStore(getComponentsFilter);

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
                        <ShapeImage shape={shape}/>
                    </div>

                    <div className="asset-shape-title">{shape.displayName}</div>
                </div>
            );
        },
        [dispatch, store]
    );

    const systemComponents: CollapseProps['items'] = [
        {
            key: 'common',
            label: texts.common.common,
            children: <Grid
                className="asset-shapes-list"
                renderer={cellRenderer}
                columns={2}
                items={componentsFiltered}
                keyBuilder={keyBuilder}
            />
        },
        {
            key: 'blog',
            label: texts.common.blog,
            children: <Grid
                className="asset-shapes-list"
                renderer={cellRenderer}
                columns={2}
                items={componentsFiltered}
                keyBuilder={keyBuilder}
            />
        },
        {
            key: 'ecommerce',
            label: texts.common.ecommerce,
            children: <Grid
                className="asset-shapes-list"
                renderer={cellRenderer}
                columns={2}
                items={componentsFiltered}
                keyBuilder={keyBuilder}
            />
        },
    ];

    const doFilterComponents = useEventCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(filterComponents(event.target.value));
        }
    );

    return (
        <>
            <div className="asset-shapes-search">
                <Input
                    value={componentsFilter}
                    onChange={doFilterComponents}
                    placeholder={texts.common.findComponent}
                    prefix={<SearchOutlined style={{color: "rgba(0,0,0,.25)"}}/>}
                />
            </div>

            {/*<Collapse*/}
            {/*    className={(classNames({hidden: !hasSelection}))}*/}
            {/*    items={systemComponents}*/}
            {/*    bordered={false}*/}
            {/*    defaultActiveKey={['common']}*/}
            {/*    activeKey={['common', 'blog', 'ecommerce']}*/}
            {/*/>*/}


            <Grid
                className="asset-shapes-list"
                renderer={cellRenderer}
                columns={2}
                items={componentsFiltered}
                keyBuilder={keyBuilder}
            />
        </>
    );
};
