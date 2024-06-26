import {
    DiagramItem,
    getDiagramId,
    getRelationships,
    getShouldConnectedItems,
    toggleRelationshipModal,
    useStore
} from "@app/wireframes/model";
import {ImmutableMap, useEventCallback} from "@app/core";
import {useMemo} from "react";
import {UIAction} from "@app/wireframes/components/actions/shared.ts";
import {texts} from "@app/texts";
import {removeRelationship} from "@app/wireframes/redux/reducers/relationships.ts";
import {useAppDispatch} from "@app/wireframes/redux/store.ts";
import {Relationship} from "@app/wireframes/model/relationship/relationship.ts";

export function useRelationship() {

    const dispatch = useAppDispatch();
    const selectedDiagramId = useStore(getDiagramId);
    const shouldConnectedItems = useStore(getShouldConnectedItems);
    const relationships = useStore(getRelationships);
    const canConnect = shouldConnectedItems != null;
    const canUnconnect = isAlreadyConnected(relationships, shouldConnectedItems);

    const doConnect = useEventCallback(() => {
        dispatch(toggleRelationshipModal());
    });

    const doUnconnect = useEventCallback(() => {
        if (!shouldConnectedItems) {
            return;
        }
        if (selectedDiagramId != null) {
            dispatch(removeRelationship(selectedDiagramId,
                shouldConnectedItems?.source.id,
                shouldConnectedItems?.target.id));
        }
    });

    const connect: UIAction = useMemo(() => ({
        disabled: !canConnect,
        icon: 'icon-share',
        label: texts.common.relationship,
        shortcut: 'MOD + G',
        tooltip: texts.common.groupTooltip,
        onAction: doConnect,
    }), [canConnect, doConnect]);
    const unConnect: UIAction = useMemo(() => ({
        disabled: !canUnconnect,
        icon: 'icon-cut',
        label: texts.common.disConnect,
        shortcut: 'MOD + G',
        tooltip: texts.common.groupTooltip,
        onAction: doUnconnect,
    }), [canUnconnect, doUnconnect]);
    return {connect, unConnect};
}

function isAlreadyConnected(relationships: ImmutableMap<Relationship> | undefined,
                            shouldConnectedItems: { source: DiagramItem; target: DiagramItem } | null): boolean {
    if (!relationships) {
        return false;
    }
    if (shouldConnectedItems == null) {
        return false;
    }
    const present = relationships.values
        .filter(relationship => {
            return (relationship.source == shouldConnectedItems.source.id && relationship.target == shouldConnectedItems.target.id)
                || (relationship.source == shouldConnectedItems.target.id && relationship.target == shouldConnectedItems.source.id);
        });
    return present.length > 0;

}