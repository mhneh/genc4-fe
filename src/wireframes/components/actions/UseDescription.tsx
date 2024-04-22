import {useAppDispatch} from "@app/wireframes/redux/store.ts";
import {useMemo} from "react";
import {getSelection, toggleDescModal, useStore} from "@app/wireframes/model";
import {UIAction} from "@app/wireframes/components/actions/shared.ts";
import {texts} from "@app/texts";
import {ExportOutlined} from "@ant-design/icons";
import {useEventCallback} from "@app/core";

export function useDescription() {
    const dispatch = useAppDispatch();
    const selectionSet = useStore(getSelection);
    const canDescribe = selectionSet.selectedItems.length == 1;

    const doDescribe = useEventCallback(() => {
        dispatch(toggleDescModal());
    })

    const describe: UIAction = useMemo(() => ({
        disabled: !canDescribe,
        icon: <ExportOutlined />,
        label: texts.common.describe,
        tooltip: texts.common.describeTooltip,
        onAction: doDescribe,
    }), [canDescribe, doDescribe]);

    return {describe: describe};
}