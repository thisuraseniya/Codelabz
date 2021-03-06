import React, { useEffect } from "react";
import { Drawer, Space, Row, Col, Divider, Button, message } from "antd";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined, LoadingOutlined } from "@ant-design/icons";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTutorialImagesReducer,
  remoteTutorialImages,
  uploadTutorialImages,
} from "../../../store/actions";
import { CopyToClipboard } from "react-copy-to-clipboard";

const ImageDrawer = ({ onClose, visible, owner, tutorial_id, imageURLs }) => {
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const uploading = useSelector(
    ({
      tutorials: {
        images: { uploading },
      },
    }) => uploading
  );

  const uploading_error = useSelector(
    ({
      tutorials: {
        images: { uploading_error },
      },
    }) => uploading_error
  );

  const deleting = useSelector(
    ({
      tutorials: {
        images: { deleting },
      },
    }) => deleting
  );

  const deleting_error = useSelector(
    ({
      tutorials: {
        images: { deleting_error },
      },
    }) => deleting_error
  );

  useEffect(() => {
    if (uploading === false && uploading_error === false) {
      message.success(`Image(s) uploaded successfully`);
    } else if (uploading === false && uploading_error) {
      message.error(uploading_error);
    }
  }, [uploading, uploading_error]);

  useEffect(() => {
    if (deleting === false && deleting_error === false) {
      message.success(`Image deleted successfully`);
    } else if (deleting === false && deleting_error) {
      message.error(deleting_error);
    }
  }, [deleting, deleting_error]);

  useEffect(() => {
    clearTutorialImagesReducer()(dispatch);
    return () => {
      clearTutorialImagesReducer()(dispatch);
    };
  }, [dispatch]);

  const props = {
    name: "file",
    multiple: true,
    beforeUpload(file, files) {
      uploadTutorialImages(owner, tutorial_id, files)(
        firebase,
        firestore,
        dispatch
      );
      return false;
    },
  };

  const deleteFile = (name, url) =>
    remoteTutorialImages(
      owner,
      tutorial_id,
      name,
      url
    )(firebase, firestore, dispatch);

  return (
    <Drawer
      title="Images"
      placement="right"
      closable={true}
      onClose={onClose}
      visible={visible}
      getContainer={true}
      style={{ position: "absolute" }}
      width="400px"
      className="image-drawer"
      destroyOnClose={true}
      maskClosable={false}
    >
      <div className="col-pad-24">
        <Dragger {...props}>
          {uploading ? (
            <>
              <LoadingOutlined /> Please wait...
              <p className="ant-upload-hint mt-8">Uploading image(s)...</p>
            </>
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag images to here to upload
              </p>
            </>
          )}
        </Dragger>
        <Divider />
        {imageURLs &&
          imageURLs.length > 0 &&
          imageURLs.map((image, i) => (
            <Row className="mb-24" key={i}>
              <Col xs={24} md={8}>
                <img src={image.url} alt="" />
              </Col>
              <Col xs={24} md={16} className="pl-8" style={{}}>
                <h4 className="pb-8">{image.name}</h4>
                <Space style={{ float: "right" }}>
                  <CopyToClipboard
                    text={`![alt=image; scale=1.0](${image.url})`}
                    onCopy={() =>
                      message.success(`Image URL copied to clipboard`)
                    }
                  >
                    <Button type="primary">Copy URL</Button>
                  </CopyToClipboard>

                  <Button
                    loading={deleting}
                    onClick={() => deleteFile(image.name, image.url)}
                    type="ghost"
                    danger
                  >
                    Delete
                  </Button>
                </Space>
              </Col>
            </Row>
          ))}

        <Divider />
      </div>
    </Drawer>
  );
};

export default ImageDrawer;
