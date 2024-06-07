import {Breadcrumb} from "antd";
import {AppstoreOutlined, HomeOutlined, RollbackOutlined, UserOutlined} from "@ant-design/icons";
import {selectDiagram} from "@app/wireframes/redux/reducers/diagrams.ts";
import {useAppDispatch, useAppSelector} from "@app/wireframes/redux/store.ts";
import {EditorStateInStore, getDiagram, selectTab, useStore} from "@app/wireframes/model";
import {useMemo} from "react";

export const C4Breadcrumb = () => {

    const diagrams = useAppSelector(
        (state: EditorStateInStore) => state.editor.present.diagrams
    );
    const dispatch = useAppDispatch();
    const selectedDiagram = useStore(getDiagram);
    const parentDiagram = useMemo(() => {
        return diagrams.values.find(d => d.items.values.find(item => item.id == selectedDiagram?.parentId));
    }, [diagrams, selectedDiagram])

    const onClick = (activeKey: string | undefined) => {
        console.log(activeKey)
        console.log(selectedDiagram)
        console.log(diagrams)
        if (!activeKey) {
            return
        }
        if (activeKey === "Contexts") {
            const contextDiagram = diagrams.values.find(
                (item, _) => item.type === "Contexts"
            );
            contextDiagram && dispatch(selectDiagram(contextDiagram)) && dispatch(selectTab("Contexts"));
            return;
        }
        if (activeKey === "Containers") {
            const contextDiagram = diagrams.values.find(
                (item, _) => item.type === "Containers"
            );
            contextDiagram && dispatch(selectDiagram(contextDiagram)) && dispatch(selectTab("Containers"));
            return;
        }
        if (activeKey == "Screens") {
            dispatch(selectDiagram(parentDiagram))
            && dispatch(selectTab(parentDiagram?.type ? parentDiagram?.type : "Components"))
            return
        }
    }

    const items = useMemo(() => {
        if (selectedDiagram?.type == "Contexts") {
            return [
                {
                    title: (<>
                        <UserOutlined/>
                        <span>Context</span>
                    </>)
                }
            ]
        }

        if (selectedDiagram?.type == "Containers") {
            return [
                {
                    title: (<>
                        <UserOutlined/>
                        <span>Context</span>
                    </>),
                    onClick: () => {
                        onClick("Contexts")
                        return;
                    }
                },
                {
                    title: (
                        <>
                            <HomeOutlined/>
                            <span>Container</span>
                        </>
                    )
                }
            ]
        }

        if (selectedDiagram?.type == "Components") {
            return [
                {
                    title: (<>
                        <UserOutlined/>
                        <span>Context</span>
                    </>),
                    onClick: () => {
                        onClick("Contexts")
                        return;
                    }
                },
                {
                    title: (
                        <>
                            <HomeOutlined/>
                            <span>Container</span>
                        </>
                    ),
                    onClick: () => onClick("Containers")
                },
                {
                    title: (
                        <>
                            <AppstoreOutlined />
                            <span>{selectedDiagram?.title}</span>
                        </>
                    )
                }
            ]
        }

        return [
            {
                title: (<>
                    <UserOutlined/>
                    <span>Context</span>
                </>),
                onClick: () => {
                    onClick("Contexts")
                    return;
                }
            },
            {
                title: (
                    <>
                        <HomeOutlined/>
                        <span>Container</span>
                    </>
                ),
                onClick: () => onClick("Containers")
            },
            {
                title: (
                    <>
                        <AppstoreOutlined/>
                        <span>{parentDiagram?.title}</span>
                    </>
                )
            },
            {
                title: (
                    <>
                        {selectedDiagram?.type != "Screens" ?
                        <>
                            <AppstoreOutlined />
                            <span>{selectedDiagram?.title}</span>
                        </>
                            : <>
                                <RollbackOutlined />
                                <span>{"Back"}</span>
                            </>
                        }

                    </>
                ),
                onClick: () => onClick(selectedDiagram?.type)
            }
        ]
    }, [selectedDiagram])
    return (
        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px"}}>
            <Breadcrumb
                items={items}
            />
        </div>
    )
}