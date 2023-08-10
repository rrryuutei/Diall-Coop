import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Share,
  TouchableOpacity,
} from "react-native";
import Colors from "../components/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Avatar, Button, Card, Text } from "react-native-paper";
import { ActivityIndicator } from "react-native-paper";
import { Video, ResizeMode } from "expo-av";
import { getVideos } from "../firebase/firestore";

export default function Com({ navigation, route }) {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "This video is very good",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const [cacheData, setCacheData] = useState([]);
  const [isFirst, setIsFirst] = useState(true);
  const [data, setData] = useState(cacheData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(null);
  const videoRefs = useRef([]);
  const [videoRefArr, setVideoRefArr] = useState([]);
  useEffect(() => {
    let newVideoRefArr = [];
    data.forEach((v, i) => {
      newVideoRefArr[i] =  React.createRef(null);
    })
    setVideoRefArr(newVideoRefArr);
  }, [data])

  useEffect(() => {
    console.log("videoRefArr = ", videoRefArr)
  }, [videoRefArr])


  useEffect(() => {
    videoRefs.current = Array(data.length)
      .fill()
      .map((_, index) => videoRefs.current[index] || React.createRef());
  }, [data]);
  const [isPlaying, setIsPlaying] = useState(true);
  const getData = async () => {
    try {
      let res = await getVideos();
      console.log("list data = ", res);
      setCacheData(res);
      setData(res);
    } catch (error) {}
  };

  useEffect(() => {
    getData();
  }, [route]);

  useEffect(() => {
    const playCurrentVideo = async () => {
      const index = currentVideoIndex;
      if (index !== null) {
        await videoRefs.current[index].current.playAsync();
      }
    };

    const pauseOtherVideos = async () => {
      for (let i = 0; i < videoRefs.current.length; i++) {
        if (i !== currentVideoIndex && videoRefs.current[i].current) {
          await videoRefs.current[i].current.pauseAsync();
        }
      }
    };

    playCurrentVideo();
    pauseOtherVideos();
  }, [currentVideoIndex]);

  const playVideo = (index) => {
    setCurrentVideoIndex(index);
  };
  const handleScroll = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      if (!isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setData([...data, ...cacheData]);
          setIsLoading(false);
        }, 1000);
      }
    }
  };
  useEffect(() => {
    if (videoRefs?.current[0]?.current && isFirst) {
      playVideo(0);
      setIsFirst(false);
    }
  });
  return (
    <ScrollView
      onScroll={({ nativeEvent }) => handleScroll(nativeEvent)}
      scrollEventThrottle={400}
      style={styles.container}
    >
      <View style={styles.cardBox}>
        {data.length == 0 && (
          <Text
            style={{
              color: "#666",
            }}
          >
            no data
          </Text>
        )}
        {data.map((v, index) => {
          return (
            <Card
              key={index}
              style={{
                width: "80%",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "100%",
                  height: 200,
                  position: "relative",
                }}
                onPress={() => {
                  videoRefs.current[index].current
                    .getStatusAsync()
                    .then(async (res) => {
                      // console.log("res = ", res);
                      console.log("index = ", index);
                      if (res.isPlaying) {
                        await videoRefs.current[index].current.pauseAsync();
                        setIsPlaying(false);
                      } else {
                        if (currentVideoIndex == index) {
                          await videoRefs.current[index].current.playAsync();
                          setIsPlaying(true);
                        } else {
                          playVideo(index);
                          setIsPlaying(true);
                        }
                      }
                    });
                }}
              >
                {!(isPlaying && currentVideoIndex == index) && (
                  <AntDesign
                    style={{
                      position: "absolute",
                      zIndex: 5,
                      left: "50%",
                      top: "50%",
                      marginLeft: -12,
                      marginTop: -12,
                    }}
                    name="pausecircle"
                    size={24}
                    color="white"
                  />
                )}

                <Video
                  ref={videoRefs.current[index]}
                  style={{
                    width: "100%",
                    height: 200,
                    borderColor: "red",
                    // borderWidth: 1,
                  }}
                  // http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
                  source={{
                    uri: `https://firebasestorage.googleapis.com/v0/b/video-f9152.appspot.com/o/${v.url}?alt=media&token=7204f0c6-c46a-417e-8595-f0b0c596b760`,
                  }}
                  useNativeControls={false}
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
              </TouchableOpacity>
              <Card.Title title={v.title} subtitle={v.username} />
              <Card.Actions>
                <Button
                  onPress={() => {
                    onShare();
                  }}
                >
                  Share
                </Button>
              </Card.Actions>
            </Card>
          );
        })}
      </View>
      {isLoading && (
        <ActivityIndicator
          style={{
            marginVertical: 20,
          }}
          animating={true}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardBox: {
    alignItems: "center",
  },
  card: {
    width: "80%",
  },
  cardTop: {
    flexDirection: "row",
  },
  cardDate: {
    marginLeft: 5,
  },
  cardLeft: {},
  cardLeftTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cardRight: {
    flex: 1,
    marginLeft: 10,
  },
  noData: {
    color: Colors.textColor,
  },
  location: {
    fontSize: 10,
    paddingBottom: 5,
    color: Colors.grey,
  },
});
