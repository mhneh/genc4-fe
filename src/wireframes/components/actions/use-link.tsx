import {useAppDispatch} from "@app/wireframes/redux/store.ts";
import * as React from "react";
import {
    addDiagram,
    Diagram,
    DiagramItemSet,
    getDiagrams,
    getSelection,
    selectDiagram,
    useStore
} from "@app/wireframes/model";
import {UIAction} from "@app/wireframes/components/actions/shared.ts";
import {texts} from "@app/texts";
import {ExportOutlined} from "@ant-design/icons";
import {MathHelper, useEventCallback} from "@app/core";

export function useLink() {
    const dispatch = useAppDispatch();
    const diagrams = useStore(getDiagrams);
    const selectionSet = useStore(getSelection);

    const canLink = checkLinkable(selectionSet);

    const doLink = useEventCallback(() => {
        const selectedContainer = selectionSet.selectedItems.at(0);
        if (!selectedContainer) {
            return;
        }
        if (selectedContainer.type != "Containers") {
            return;
        }
        const child: Diagram | undefined = diagrams.values
            .find(d => d.parentId == selectedContainer.id);
        if (!child) {
            dispatch(addDiagram(MathHelper.nextId(),
                selectedContainer.appearance.get('TITLE'),
                selectedContainer.id,
                "Components"));

        } else {
            dispatch(selectDiagram(child.id))
        }
    })

    const link: UIAction = React.useMemo(() => ({
        disabled: !canLink,
        icon: <ExportOutlined />,
        label: texts.common.detail,
        tooltip: texts.common.copyTooltip,
        onAction: doLink,
    }), [canLink, doLink]);

    return {link};
}

function checkLinkable(selectionSet: DiagramItemSet) {
    if (selectionSet.selectedItems.length != 1) {
        return false;
    }
    const selectedContainer = selectionSet.selectedItems.at(0);
    if (!selectedContainer) {
        return false;
    }
    if (selectedContainer.type != "Containers") {
        return false;
    }
    return true;
}