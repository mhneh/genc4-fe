import {memo, useCallback, useEffect, useMemo, useState} from "react";
import {Button, List, Modal, Input} from "antd";
import {useAppDispatch} from "@app/wireframes/redux/store.ts";
import {DeleteOutlined, FolderAddOutlined} from "@ant-design/icons";
import {
    DescProps,
    getDiagramId,
    getSelection,
    getShowDescModal,
    toggleDescModal,
    updateDescs,
    useStore
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

    const [currentDescs, setCurrentDescs] = useState<DescProps[]>([]);
    useEffect(() => {
        if (!selectedItem?.descriptions) {
            return;
        }
        setCurrentDescs(selectedItem?.descriptions.values);
    }, [selectionSet]);

    const closeModal = useCallback(() => {
        dispatch(toggleDescModal());
    }, []);

    const updateItemDescs = () => {
        if (!selectedDiagramId) {
            return;
        }
        if (!selectedItem) {
            return;
        }
        dispatch(updateDescs(selectedDiagramId, [selectedItem], currentDescs));
    };

    const changeDesc = (id: string, desc: string) => {
        const newDescs = currentDescs.map(item => {
            if (item.id != id) {
                return item;
            }
            return {
                ...item,
                description: desc
            }
        })
        setCurrentDescs(newDescs);
    };

    const removeDesc = (id: string) => {
        const newDescs = currentDescs.filter(item => item.id != id);
        setCurrentDescs(newDescs);
    };

    const onAddMore = () => {
        if (!selectedDiagramId) {
            return;
        }
        if (!selectedItem) {
            return;
        }
        const newDescId = MathHelper.nextId();
        setCurrentDescs([
            ...currentDescs,
            {
                id: newDescId,
                description: "",
                itemId: selectedItem.id,
            } as DescProps
        ]);
    };
    const AddMore = () => {
        return (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}>
                <Button type={"primary"} onClick={onAddMore}>
                    <FolderAddOutlined /> New
                </Button>
            </div>
        )
    }

    const RenderItem = useCallback((item: DescProps, index: number) => (
        <List.Item>
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <Button type="primary" shape="circle" disabled>
                    {index + 1}
                </Button>
                <div style={{width: "70%", margin: "15px 10px"}}>
                    <Input.TextArea
                        showCount
                        value={item.description}
                        onChange={e => changeDesc(item.id, e.target.value)}
                        placeholder={"Description"}
                        autoSize={{ minRows: 1, maxRows: 4 }}
                    />
                </div>
                <div>
                    <Button
                        type={"text"}
                        size={"small"}
                        onClick={() => removeDesc(item.id)}
                        danger>
                        <DeleteOutlined />
                    </Button>
                </div>
            </div>
        </List.Item>
    ), [currentDescs]);

    const Header = useCallback(() => {
        return (
            <div style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
            }}>
                <div style={{fontWeight: "bold"}}>Description</div>
                <div style={{fontWeight: "bold", width: "60%", margin: "0 10px"}}>
                    <p style={{textAlign: "center"}}>Content</p>
                </div>
                <div style={{fontWeight: "bold"}}>Action</div>
            </div>
        )
    }, []);

    const Title = () => {
        return (
            <p style={{
                color: "#fff",
                textAlign: "center",
                fontSize: "20px",
                backgroundColor: "#1168bd",
                borderRadius: "10px",
                width: "80%",
                margin: "0 auto",
                padding: "5px 0",
            }}>
                DESCRIBE YOUR IDEA
            </p>
        )
    }
    return (
        <Modal
            centered
                title={<Title/>}
               open={showDescModal}
               onCancel={closeModal}
               onOk={() => {
                   updateItemDescs();
                   closeModal();
               }}>
            <List
                header={<Header/>}
                loading={false}
                itemLayout={"vertical"}
                dataSource={currentDescs}
                renderItem={RenderItem}
            />
            <AddMore/>
        </Modal>
    )
});