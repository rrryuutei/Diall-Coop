import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import { AntDesign } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { storage } from "../firebase/firebase-setup";
import { ref, uploadBytes } from "firebase/storage";
import { writeToVideos } from "../firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

export default function Com({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [username, setUsername] = useState(
    route?.params?.username || "anonymous"
  );
  const [title, setTitle] = useState("");
  const [uri, setUri] = useState(
    ""
  );
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const cameraRef = useRef(null);

  const getImageBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob;
    } catch (err) {
      console.log("fetch image ", err);
    }
  };

  useEffect(() => {
    if (!modalVisible) {
      setIsFinish(false);
      setUri(false);
      setIsStart(false);
    }
  }, [modalVisible]);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");
      const { status: audioStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus === "granted");
    })();
    console.log("storage = ", storage);
  }, []);

  const startRecording = async () => {
    if (hasCameraPermission && hasAudioPermission && cameraRef.current) {
      try {
        const options = {
          maxDuration: 5,
          quality: Camera.Constants.VideoQuality["480p"],
        };
        const data = await cameraRef.current.recordAsync(options);
        setIsStart(false);
        setIsFinish(true);
        // console.log("Video recorded at: ", data.uri);
        setUri(data.uri);
      } catch (error) {
        console.error("Failed to record video: ", error);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <Pressable
          style={styles.modalContainer}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          {!isFinish && (
            <View
              style={{
                height: 300,
                width: "100%",
                borderColor: "red",
                borderWidth: 1,
              }}
            >
              <Camera
                ref={cameraRef}
                style={{ flex: 1 }}
                type={Camera.Constants.Type.back}
              />
            </View>
          )}

          {isFinish && (
            <TouchableOpacity
              style={{
                position: "absolute",
                left: 20,
                top: 50,
              }}
              onPress={() => {
                setUri("");
                setIsFinish(false);
                setIsStart(false);
              }}
            >
              <Ionicons name="ios-close" size={50} color="white" />
            </TouchableOpacity>
          )}
          <View>
            {!isFinish && (
              <Button
                mode="contained"
                buttonColor={isStart ? "red" : "purple"}
                onPress={() => {
                  if (isStart) {
                    setIsStart(false);
                    stopRecording();
                  } else {
                    setIsStart(true);
                    startRecording();
                  }
                }}
              >
                {isStart ? "End Recording" : "Start Recording"}
              </Button>
            )}
          </View>
          {isFinish && (
            <View
              style={{
                width: "80%",
              }}
            >
              <TextInput
                label="Title"
                value={title}
                multiline
                numberOfLines={4}
                style={{
                  marginBottom: 10,
                }}
                onChangeText={(text) => setTitle(text)}
              />

              <Button
                mode="contained"
                onPress={async () => {
                  if (!title) {
                    Alert.alert("Title can not be empty!");
                    return;
                  }
                  if (title.length > 40) {
                    Alert.alert("Title can be 40characters max!");
                    return;
                  }
                  let imgBlob = await getImageBlob(uri);
                  let uuid = moment().valueOf();
                  let video_name = `${uuid}_video`;
                  const storageRef = ref(storage, video_name);
                  uploadBytes(storageRef, imgBlob)
                    .then(async (snapshot) => {
                      console.log("Uploaded a blob!");
                      await writeToVideos({
                        username,
                        title,
                        url: video_name,
                      });
                      navigation.navigate("Watch", {
                        // username: v.username,
                      });
                      Alert.alert("Successfully sent!");
                    })
                    .catch((err) => {
                      console.log("err = ", err);
                    });
                }}
              >
                Send
              </Button>
            </View>
          )}
        </Pressable>
      </Modal>
      {hasCameraPermission === null || hasAudioPermission === null ? (
        <Text>Requesting permission...</Text>
      ) : !hasCameraPermission || !hasAudioPermission ? (
        <View>
          <Text>Can't access camera or record audio</Text>
          <TouchableOpacity
            onPress={() => Camera.requestMicrophonePermissionsAsync()}
          >
            <Text>Click here to grant permission</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={{
            alignItems: "flex-end",
            padding: 10,
          }}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <AntDesign name="infocirlce" size={50} color="#1890ff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    fontSize: 18,
    color: "blue",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Translucent black background
    position: "relative",
  },
  modalText: {
    fontSize: 20,
    color: "white",
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 18,
    color: "blue",
  },
});
