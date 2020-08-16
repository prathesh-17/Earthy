import React,{useEffect,useState} from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback,TouchableOpacity, View, Image,Button,Modal,Dimensions,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Entypo,MaterialCommunityIcons,AntDesign } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';
import Animated from 'react-native-reanimated';
import {mix,useTransition} from "react-native-redash";

const { width, height } = Dimensions.get("window");

//
const ImageSelector= ({urlSet}) => {
  const fadeIn = {
    0: {
      opacity: 0,
    },
    0.8: {
      opacity: 0.2,
    },
    1.0: {
      opacity: 1.0,
    },
  };
  const [modalVisible,setModalVisible]=useState(false);
  const [modVisible,setModVisible]=useState(false);
  
  const trans = useTransition(modVisible)
  const ty = mix(trans,0,1)

  const iurl='https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png';
  const [image,setImage]=useState(iurl)
  
  useEffect(() => {
      (async()=>{
          // const { status } =await Permissions.getAsync(Permissions.CAMERA_ROLL)
          // if(status!=='granted'){
          //   alert('sorry we need camera permission')
          // }
          // console.log(status)
          const {status}=await ImagePicker.requestCameraRollPermissionsAsync()
          if(status!=='granted'){
            alert('sorry')
          }
          // console.log(status)
      })();

  }, [])
  const cancelPicture=()=>{
    setModalVisible(false);
    setImage(iurl);
  }
  const selectPicture = async () => {
    setModalVisible(false)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      aspect: [4,3],
      quality:1,
      allowsEditing: true,
    });
    console.log(result)
    if (!result.cancelled){ setImage(result.uri );
      urlSet(result.uri);
    }
    console.log(image)
  };

  const takePicture = async () => {
    setModalVisible(false)
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
    });
    if(!result.cancelled){setImage( result.uri );urlSet(result.uri);}
    console.log(image)

  };

    return (
        <Animatable.View  style={styles.container}>
          <Image source={{ uri: image }} style={styles.image}  />
          <TouchableWithoutFeedback onPress={()=>{setModalVisible(true);}}>
            <Animated.View style={styles.row} >
              <Entypo style={{padding:6}}name="camera" size={24} color="black" />
            </Animated.View>
            </TouchableWithoutFeedback>

          {/* <Modal animationType="fadeIn" transparent={true} visible={modalVisible} > */}
            {modalVisible?
              <Animatable.View animation="swing" style={{...styles.modal}}>
                
                <Animatable.View  style={{...styles.icons,top:-30}} >
                  <TouchableWithoutFeedback onPress={cancelPicture}>
                    <View style={styles.individualicon}>
                      <MaterialCommunityIcons style={{justifyContent:'center'}} name="folder-remove"  size={25} color="black"/>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={takePicture}>
                    <View style={styles.individualicon}>
                      <Entypo style={{justifyContent:'center'}} name="camera"  size={22} color="black"/>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback onPress={selectPicture}>
                    <View style={styles.individualicon}>
                      <MaterialCommunityIcons name='folder-image' size={25} color="black"/>
                    </View>
                  </TouchableWithoutFeedback>

                  <TouchableWithoutFeedback onPress={()=>setModalVisible(false)}>
                    <View style={styles.individualicon}>
                      <MaterialCommunityIcons name='sword-cross' size={25} color="black"/>
                    </View>
                  </TouchableWithoutFeedback>
                </Animatable.View>
              </Animatable.View>
            :null}
            {/* </Modal> */}
        </Animatable.View>
    );

}
const styles = StyleSheet.create({
  text: {
    fontSize: 21,
  },
  row: {
    position:'relative',
    marginTop:-30,
    height:40,
    alignItems:'center',
    width:40,
    borderRadius:40,
    backgroundColor:'rgb(220,20,60)'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius:100,
    borderWidth:4,
    borderColor:'rgb(0,0,0)',
    backgroundColor: '#eee' },
  button: {
    padding: 13,
    margin: 15,
    backgroundColor: '#dddddd',
  },
  container: {
    marginBottom:20,
    padding:10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal:{
    position:'absolute',
    bottom:0,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    width:width/1.5,
    height:height/4
  },
  close:{
    position:'absolute',
    top:-30,
    backgroundColor:'white',
    color:'black',
    borderRadius:50,
    width:50,
    height:50,
    margin:5,
    alignItems:'center',
    justifyContent:'center',
    padding:6,
    elevation:10,
    alignSelf:'center',
    textAlign:'center'
  },
  icons:{
    marginTop:height/14,
    justifyContent:'space-around',
    flexDirection:'row'
  },
  individualicon:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'rgb(220,20,60)',
    marginVertical:25,
    width:40,
    height:40,
    elevation:20,
    shadowOffset:{width:0,height:4},
    borderRadius:90
  }
});

export default ImageSelector
