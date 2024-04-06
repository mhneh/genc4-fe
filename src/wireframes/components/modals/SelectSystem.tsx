import {memo, useState} from "react";
import {Image, Menu, Modal} from "antd";
import {selectSystem, useAppDispatch} from "@app/wireframes/redux/store.ts";
import {loadDiagramFromFile, saveDiagramToServer} from "@app/wireframes/redux/thunk/loading.ts";
import Icon from "@ant-design/icons";
import blogSystemJson from "./blog-system.json";

export const SelectSystem = memo(() => {
    const dispatch = useAppDispatch();
    const [isOpen, setOpen] = useState(true);

    return (
        <Modal title={"Select System"} open={isOpen} onCancel={() => null} onOk={() => null}>
            <Menu mode={'horizontal'} theme={"light"} style={{margin: "10px"}}>
                <Menu.Item key={"blog"} style={{width: "40%"}}>
                    <div style={{
                        padding: "10px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                         onClick={async () => {

                             const file: File = new File([JSON.stringify(blogSystemJson)], "");
                             await dispatch(loadDiagramFromFile({file}));
                             await dispatch(saveDiagramToServer({ navigate: true }));
                             await dispatch(selectSystem("blog"));
                             setOpen(false);
                         }}>
                        <Image
                            src="./blog.jpg"
                            preview={false}
                        />
                        <p style={{fontWeight: "bold"}}>Blog System</p>
                    </div>
                </Menu.Item>

                <Menu.Item key={"other"} style={{width: "50%"}}>
                    <div style={{
                        padding: "10px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                        onClick={() => {
                            dispatch(selectSystem("other"));
                            setOpen(false);
                        }}
                    >
                        <Image
                            src="./other.png"
                            preview={false}
                        />
                        <p style={{fontWeight: "bold"}}>Create new one <Icon component={() => <i className={'icon-new'} />} /></p>
                    </div>
                </Menu.Item>
            </Menu>
        </Modal>
    )
});