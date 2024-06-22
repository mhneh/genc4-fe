/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import {GithubOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {Button, Modal} from 'antd';
import {MenuProps} from 'antd/lib';
import * as React from 'react';
import {MarkerButton, Title, useEventCallback} from '@app/core';
import text from '@app/legal.html?raw';
import {texts} from '@app/texts';
import {useStore} from '@app/wireframes/model';
import {ActionDropdownButton, ActionMenuButton, buildMenuItem, useLoading} from './../actions';

export const LoadingMenu = React.memo(() => {
    const forLoading = useLoading();
    // const editor = useStore(s => s.editor);
    const tokenToRead = useStore(s => s.loading.tokenToRead);
    // const tokenToWrite = useStore(s => s.loading.tokenToWrite);
    // const saveTimer = React.useRef<any>();
    const saveAction = React.useRef(forLoading.saveDiagram);

    saveAction.current = forLoading.saveDiagram;

    const saveMenuItems: MenuProps['items'] = [
        buildMenuItem(forLoading.saveDiagramToFile, 'save'),
    ];

    return (
        <>
            <CustomTitle token={tokenToRead}/>

            <ActionMenuButton displayMode='IconLabel' action={forLoading.newDiagram}/>
            <ActionMenuButton displayMode='Icon' action={forLoading.openDiagramAction}/>

            <ActionDropdownButton className='menu-dropdown' displayMode='IconLabel' action={forLoading.saveDiagram}
                                  type='dashed' menu={{items: saveMenuItems}} size={"small"}/>

            <ActionMenuButton
                displayMode='IconLabel' action={forLoading.genCode} type="primary" size={"large"}/>

            <Button className='menu-item' href='https://github.com/mydraft-cc/ui' target='_blank'
                    icon={<GithubOutlined/>}/>
        </>
    );
});

const CustomTitle = React.memo(({token}: { token?: string | null }) => {
    const system = useStore(store => store.editor.present.system);

    const prefix = (system === "blog") ? "Blog System - " : "";
    const title = token && token.length > 0 ?
        prefix + ` Diagram ${token}` :
        prefix + ` C4 - Diagram ${texts.common.unsaved}`;

    return (
        <Title text={title}/>
    );
});
