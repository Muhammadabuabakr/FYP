import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View,Button, TouchableOpacity, Pressable,Dimensions } from 'react-native';
// import styles from './styles';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from "react-native-easy-grid";
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Card } from 'react-native-elements';
import { ActivityIndicator, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);
export default function App({navigation}) {
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [toolbar, settoolbar] = useState(false);
  const [notLoading, setnotLoading] = useState(false);
  const [data, setData] = useState([]);
  const [visible, setvisible] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
      console.log(imagePermission.status);
      setGalleryPermission(imagePermission.status === 'granted');
    })();
  }, []);

  if (hasPermission === null && galleryPermission===null) {
    return <View />;
  }
  if (hasPermission === false && galleryPermission===false) {
    return <Text>No access to camera</Text>;
  }
  const __takePicture = async () => {
    if (!camera) return
    const photo = await camera.takePictureAsync()
    let result=photo
    setImageUri(result.uri);
    console.log(result.uri);
    setLoading(true);
    settoolbar(true);
      let filename = result.uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let form_data = new FormData();
      // form_data.append('image', result, filename);
      //psdt
      form_data.append('image', { uri: result.uri, name: filename, type });
      console.log(form_data);
      return axios.post("http://192.168.1.7:8000/controller/", form_data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
      .then(res => {
        console.log(res.data);
        setData(res.data);
        setLoading(false);
        setnotLoading(true);
        
      })
      .catch(err => console.log(err))
      //psdt


   
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result.uri);
    if (!result.cancelled) {
      setLoading(true);
      settoolbar(true);
      setImageUri(result.uri);
      let filename = result.uri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      let form_data = new FormData();
      // form_data.append('image', result, filename);
      form_data.append('image', { uri: result.uri, name: filename, type });
      console.log(form_data);
      // setCamera(null);
      return axios.post("http://192.168.1.7:8000/controller/", form_data, {
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
          .then(res => {
            console.log(res.data);
            setData(res.data);
            setLoading(false);
            setnotLoading(true);
            
          })
          .catch(err => console.log(err))
      }
    };
  const seting =() => {
    setnotLoading(false)
    settoolbar(false)
  };
  const Separator = () => (
    <View />
  );
  return (
    <View style={styles.container}>
      
      <Camera style={styles.container} type={type}
        ref={(ref) => setCamera(ref)}>
          
          <View style={styles.container}>
          {notLoading ?(<Card title="Local Modules" elevation={7}>
          {/*react-native-elements Card*/}
          <Text>
            {data}
          </Text>
          <Separator />
          <Pressable
            onPress={seting}
            // type="outline"
            // title="take another one"
            // color="#841584"
            // accessibilityLabel="Learn more about this purple button"
          >
            <Text>Take another one</Text>
          </Pressable>
          </Card>):null}
          {isLoading ?(<ActivityIndicator size="large" color="#00ff00" />):null}
          </View>
          
        <View style={styles.closeButton}>
        {/* <Toolbar/> */}
        {!toolbar ?(<Grid>
        <Row>
            <Col>
                <TouchableOpacity onPress={pickImage}>
                    <Ionicons
                        name="images"
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
            <Col size={2} >
            {/* capture button */}
            <View 
                style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center'
                
                }}
                >
                  
                    <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                    width: 70,
                    height: 70,
                    bottom: 0,
                    position: "absolute",
                    top: 600,
                    borderRadius: 50,
                    backgroundColor: '#fff'
                    }}
                    />
            </View>
            
            </Col>
            <Col>
                <TouchableOpacity onPress={() => {
                      setType(
                        type === Camera.Constants.Type.back
                          ? Camera.Constants.Type.front
                          : Camera.Constants.Type.back
                      );
                    }}>
                    <Ionicons
                        name="ios-camera-reverse-outline"
                        color="white"
                        size={30}
                    />
                </TouchableOpacity>
            </Col>
        </Row>
        </Grid>):null}
        </View>
        
      </Camera>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,

  },
  capture: {
    backgroundColor: "#f5f6f5",
    height: captureSize,
    width: captureSize,
    borderRadius: Math.floor(captureSize / 2),
    marginHorizontal: 31,
  },
});
