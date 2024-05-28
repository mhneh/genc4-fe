import {memo, useCallback, useEffect, useMemo, useState} from "react";
import {Button, List, Modal, Input, Divider} from "antd";
import {useAppDispatch} from "@app/wireframes/redux/store.ts";
import {ArrowDownOutlined, DeleteOutlined, FolderAddOutlined} from "@ant-design/icons";
import {
    DescProps,
    getDiagramId,
    getSelection,
    getShowDescModal,
    toggleDescModal,
    updateDescs,
    useStore,
} from "@app/wireframes/model";
import {MathHelper} from "@app/core";

export const DescriptionAppender = memo(() => {
    const dispatch = useAppDispatch();
    const showDescModal = useStore(getShowDescModal);
    const selectedDiagramId = useStore(getDiagramId);
    const selectionSet = useStore(getSelection);
    const selectedItem = useMemo(() => {
        if (selectionSet.selection.size === 1) {
            return selectionSet.selectedItems[0];
        }
        return null;
    }, [selectionSet]);

    const [currentDescriptions, setCurrentDescriptions] = useState<DescProps[]>([]);
    useEffect(() => {
        if (!selectedItem?.descriptions) {
            return;
        }
        setCurrentDescriptions(selectedItem?.descriptions.values);
    }, [selectionSet, showDescModal]);

    const closeModal = useCallback(() => {
        dispatch(toggleDescModal());
    }, []);

    const updateItemDescriptions = () => {
        if (!selectedDiagramId) {
            return;
        }
        if (!selectedItem) {
            return;
        }
        dispatch(updateDescs(selectedDiagramId, [selectedItem], currentDescriptions));
    };

    const changeDescription = (id: string, desc: string) => {
        const newDescriptions = currentDescriptions.map((item) => {
            if (item.id != id) {
                return item;
            }
            return {
                ...item,
                description: desc,
            };
        });
        setCurrentDescriptions(newDescriptions);
    };

    const removeDescription = (id: string) => {
        const newDescriptions = currentDescriptions.filter((item) => item.id != id);
        setCurrentDescriptions(newDescriptions);
    };

    const onAddMore = () => {
        if (!selectedDiagramId) {
            return;
        }
        if (!selectedItem) {
            return;
        }
        const newDescId = MathHelper.nextId();
        setCurrentDescriptions([
            ...currentDescriptions,
            {
                id: newDescId,
                description: "",
                itemId: selectedItem.id,
            } as DescProps,
        ]);
    };
    const AddMore = () => {
        return (
            <div
                style={{
                    textAlign: "center",
                    marginTop: 12,
                    height: 32,
                    lineHeight: "32px",
                }}
            >
                <Button type={"primary"} onClick={onAddMore}>
                    <FolderAddOutlined/> More
                </Button>
            </div>
        );
    };

    const RenderItem = useCallback(
        (item: DescProps, index: number) => (
            <div>
                <List.Item>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                        }}
                    >
                        <Button type="primary" shape="circle" disabled>
                            {index + 1}
                        </Button>
                        <div style={{width: "70%", margin: "15px 10px"}}>
                            <Input.TextArea
                                showCount
                                value={item.description}
                                onChange={(e) => changeDescription(item.id, e.target.value)}
                                placeholder={"Describe the function " + (index + 1)}
                                autoSize={{minRows: 2, maxRows: 4}}
                            />
                        </div>
                        <div>
                            <Button
                                type={"text"}
                                size={"small"}
                                onClick={() => removeDescription(item.id)}
                                danger
                            >
                                <DeleteOutlined/>
                            </Button>
                        </div>
                    </div>
                </List.Item>

                {index != currentDescriptions.length - 1 &&
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <ArrowDownOutlined style={{ fontSize: '20px' }}/>
                    </div>
                }
            </div>
        ),
        [currentDescriptions]
    );

    const Title = () => {
        return (
            <div>
                <p
                    style={{
                        color: "#fff",
                        textAlign: "center",
                        fontSize: "20px",
                        backgroundColor: "#1168bd",
                        borderRadius: "10px",
                        width: "80%",
                        margin: "0 auto",
                        padding: "5px 0",
                    }}
                >
                    DESCRIBE YOUR IDEA
                </p>

                <p style={{
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "normal"
                }}>Please describe the functions and flow of this screen as you wish.</p>
            </div>
        );
    };
    return (
        <Modal
            centered
            title={<Title/>}
            open={showDescModal}
            onCancel={closeModal}
            onOk={() => {
                updateItemDescriptions();
                closeModal();
            }}
        >
            <Divider/>
            <List
                header={null}
                loading={false}
                itemLayout={"vertical"}
                dataSource={currentDescriptions}
                renderItem={RenderItem}
                split={false}
                style={{margin: "0 0"}}
            />
            <AddMore/>
        </Modal>
    );
});
