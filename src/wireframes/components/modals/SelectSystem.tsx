import {memo, useEffect, useState} from "react";
import {Image, Menu, Modal} from "antd";
import {selectSystem, useAppDispatch} from "@app/wireframes/redux/store.ts";
import {loadDiagramFromFile, saveDiagramToServer} from "@app/wireframes/redux/thunk/loading.ts";
import Icon from "@ant-design/icons";
import blogSystemJson from "./blog-system.json";
import ecommerceSystemJson from "./ecommerce-system.json";
import customSystemJson from "./custom-system.json";

export const SelectSystem = memo(() => {
    const dispatch = useAppDispatch();
    const [isOpen, setOpen] = useState(true);

    // useEffect(async () => {
    //     const file: File = new File([JSON.stringify(blogSystemJson)], "");
    //     await dispatch(loadDiagramFromFile({file}));
    //     await dispatch(selectSystem("blog"));
    // }, []);

    return (
        <Modal title={"Please select system"}
               footer={null}
               open={isOpen} onCancel={() => null} onOk={() => null}>
            <Menu mode={'horizontal'} theme={"light"} style={{margin: "10px"}}>
                <Menu.Item key={"blog"} style={{width: "33%"}}>
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
                             await dispatch(selectSystem("blog"));
                             await dispatch(saveDiagramToServer({navigate: true}));
                             setOpen(false);
                         }}>
                        <Image
                            src="./blog.jpg"
                            preview={false}
                        />
                        <p style={{fontWeight: "bold"}}>Blog System</p>
                    </div>
                </Menu.Item>

                {/*<Menu.Item key={"ecommerce"} style={{width: "33%"}}>*/}
                {/*    <div style={{*/}
                {/*        padding: "10px",*/}
                {/*        borderRadius: "10px",*/}
                {/*        display: "flex",*/}
                {/*        flexDirection: "column",*/}
                {/*        justifyContent: "center",*/}
                {/*        alignItems: "center"*/}
                {/*    }}*/}
                {/*         onClick={async () => {*/}

                {/*             const file: File = new File([JSON.stringify(ecommerceSystemJson)], "");*/}
                {/*             await dispatch(loadDiagramFromFile({file}));*/}
                {/*             await dispatch(selectSystem("ecommerce"));*/}
                {/*             await dispatch(saveDiagramToServer({navigate: true}));*/}
                {/*             setOpen(false);*/}
                {/*         }}>*/}
                {/*        <Image*/}
                {/*            src="./ecommerce.png"*/}
                {/*            preview={false}*/}
                {/*        />*/}
                {/*        <p style={{fontWeight: "bold"}}>Ecommerce System</p>*/}
                {/*    </div>*/}
                {/*</Menu.Item>*/}

                <Menu.Item key={"other"} style={{width: "33%"}}>
                    <div style={{
                        padding: "10px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                         onClick={async () => {
                             const file: File = new File([JSON.stringify(customSystemJson)], "");
                             await dispatch(loadDiagramFromFile({file}));
                             await dispatch(selectSystem("custom"));
                             setOpen(false);
                         }}
                    >
                        <Image
                            src="./other.png"
                            preview={false}
                        />
                        <p style={{fontWeight: "bold"}}>Create new one <Icon
                            component={() => <i className={'icon-new'}/>}/></p>
                    </div>
                </Menu.Item>
            </Menu>
        </Modal>
    )
});