import {memo, useCallback, useEffect, useState} from "react";
import {Button, Divider, Form, Input, Modal} from "antd";
import {useAppDispatch} from "@app/wireframes/redux/store.ts";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {
    DiagramItem,
    getDiagramId,
    getRelationships,
    getShouldConnectedItems,
    getShowRelationshipModal,
    toggleRelationshipModal,
    useStore,
} from "@app/wireframes/model";
import {ImmutableMap, useEventCallback} from "@app/core";
import {addRelationship, updateRelationship} from "@app/wireframes/redux/reducers/relationships.ts";
import {Relationship} from "@app/wireframes/model/relationship/relationship.ts";
import {texts} from "@app/texts";

export const RelationshipCreator = memo(() => {
    const dispatch = useAppDispatch();
    const showRelationshipModal = useStore(getShowRelationshipModal);
    const [form] = Form.useForm();
    const selectedDiagramId = useStore(getDiagramId);

    const shouldConnectedItems = useStore(getShouldConnectedItems);
    const relationships = useStore(getRelationships);
    const canUnconnect = isAlreadyConnected(relationships, shouldConnectedItems);

    const [desc, setDesc] = useState<string>("");
    useEffect(() => {
        if (!relationships) {
            return;
        }
        if (shouldConnectedItems == null) {
            return;
        }
        const present = relationships.values
            .filter(relationship => {
                return (relationship.source == shouldConnectedItems.source.id && relationship.target == shouldConnectedItems.target.id)
                    || (relationship.source == shouldConnectedItems.target.id && relationship.target == shouldConnectedItems.source.id);
            });
        if (present.length <= 0) {
            return
        }
        const relationship = present.at(0);
        if (relationship?.description) {
            setDesc(relationship.description);
        }
        console.log(relationship);
    }, [relationships]);

    const doConnect = useEventCallback((d: string) => {
        if (!selectedDiagramId) {
            return;
        }

        if (canUnconnect) {
            dispatch(updateRelationship(selectedDiagramId, shouldConnectedItems?.source.id,
                shouldConnectedItems?.target.id, d));
            return;
        }
        const title = shouldConnectedItems?.source.appearance.get('TITLE') + ' -> '
            + shouldConnectedItems?.target.appearance.get('TITLE');
        const relationshipProps: any = {
            title: title,
            description: d,
            source: shouldConnectedItems?.source.id,
            target: shouldConnectedItems?.target.id,
        }
        dispatch(addRelationship(selectedDiagramId, relationshipProps));
    });

    const closeModal = useCallback(() => {
        dispatch(toggleRelationshipModal());
    }, []);

    const onFinish = (values: any) => {
        doConnect(values.description);
        form.resetFields();
        closeModal();
    };

    const Title = () => {
        return (
            <p
                style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: "20px",
                    backgroundColor: "#1168bd",
                    borderRadius: "10px",
                    width: "40%",
                    margin: "0 auto",
                    padding: "5px 0",
                }}
            >
                Relationship
            </p>
        );
    };
    return (
        <Modal
            centered
            title={<Title/>}
            open={showRelationshipModal}
            onCancel={closeModal}
            // onOk={() => {
            //     closeModal();
            // }}
            footer={null}
        >
            <Divider/>

            <Form
                form={form}
                labelCol={{span: 8}}
                wrapperCol={{span: 32}}
                style={{maxWidth: 600}}
                onFinish={onFinish}
                layout="vertical" autoComplete="off">
                <div
                    style={{margin: 0, padding: 0, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Form.Item name="source" label={"Source"} style={{marginRight: '20px'}}>
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>}
                               placeholder={shouldConnectedItems?.source.appearance.get("TITLE")}
                               disabled={true}/>
                    </Form.Item>
                    <Form.Item name="target" label={"Target"}>
                        <Input prefix={<LockOutlined className="site-form-item-icon"/>}
                               placeholder={shouldConnectedItems?.target.appearance.get("TITLE")}
                               disabled={true}/>
                    </Form.Item>
                </div>
                <div>
                    <Form.Item name={"description"} label="Description">
                        <Input.TextArea placeholder={desc ? desc : texts.common.emptyRel}
                                        value={desc ? desc : texts.common.emptyRel}/>
                    </Form.Item>
                </div>
                <Form.Item wrapperCol={{offset: 16, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

        </Modal>
    );
});

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
