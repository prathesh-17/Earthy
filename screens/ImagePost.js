import React,{useEffect,useState} from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback,TouchableOpacity,ScrollView,TextInput,Keyboard,Animated,
     View, Image,Button,Modal,Dimensions,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Entypo,MaterialCommunityIcons,AntDesign,MaterialIcons,Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';

import {mix,useTransition} from "react-native-redash";
import axios from 'axios'
const { width, height } = Dimensions.get("window");
import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system'
import {Avatar} from 'react-native-paper'
import ImageViewer from '../components/imageViewer';
import Spinner from 'react-native-loading-spinner-overlay';

const ImageSelector= ({themeDispatch,themeState,postModal,avatar,token,render}) => {
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
  const iurl='https://www.kindpng.com/picc/m/78-786207_user-avatar-png-user-avatar-icon-png-transparent.png';
  const [images,setImages]=useState([])
  const [len,setLen]=useState(0)

  const [imgInd,setImgInd] = useState(-1)
  useEffect(() => {
    themeDispatch({type:'HEIGHT'})
    arr=[]
    let keyboardDidShowListener=Keyboard.addListener('keyboardDidShow',keyboardDidShow)
    let keyboardDidHideListener=Keyboard.addListener('keyboardDidHide',keyboardDidHide)
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    }
}, [])
let keyboardHeight = new Animated.Value(0)
const [tp,setTp] = useState(0)
let arr = []
  const keyboardDidShow=(event)=>{
    setTp(130)
  }
  const keyboardDidHide=(event)=>{
    setTp(0)
  }


  useEffect(() => {
      (async()=>{
          const {status}=await ImagePicker.requestCameraRollPermissionsAsync()
          if(status!=='granted'){
            alert('sorry')
            setSt(true)
          }

      })();

  }, [])
  const removeImg = async(val)=>{
    console.log(images[val])
    const a = await FileSystem.deleteAsync(images[val].uri)
    const arr = images;
    arr.splice(val,1)
    setLen(len => len-1)

  }

  const selectPicture = async () => {
    if(len==4){
      Alert.alert('Sorry only 4 images allowed')
      return ;
    }
    let arr = []
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:ImagePicker.MediaTypeOptions.All,
      allowsEditing:true,
      aspect: [4,3],
      quality:1,
      allowsEditing: true,
    });
    
    if (!result.cancelled){
      result = await rescaleImage(result) 
      arr=images
      arr.push(result)
      setImages(arr)
      setLen(len => len+1)
    }
    console.log(images)
  };
 

  const rescaleImage = async(res)=>{
    let result;
    let ratio = res.width/res.height
    console.log(ratio)
    if((res.width>=800 || res.height>=1000)){
      console.log('running....')
      result = await ImageManipulator.manipulateAsync(
        res.uri,[{resize:{width:800,height:800/ratio}}],
        {compress:1.0,format:ImageManipulator.SaveFormat.JPEG}
      )
      console.log('rescale')
      console.log(result)
      const a = await FileSystem.deleteAsync(res.uri)
      res.uri = result.uri
      res.height = result.height
      res.width = result.width
    }
    return res
    
  }
  const createFormData = async () =>{
    console.log(len)
    let arr = [];
    if(len == 0){
      console.log('running1')
      handleSubmit()
      
    }
    else{
      console.log('running2')
      abc(0)
    }

  }

  const abc=(i=0)=>{   
    setpLoading(true) 
    
    const data = new FormData();
    // console.log(photo.uri.split('/'))
    
      const photo = images[i]
      let ext = photo.uri.split('.')[photo.uri.split('.').length-1]
      data.append(`file`,{
        name:photo.uri.split('/')[photo.uri.split('/').length-1],
        type:`image/${ext}`,
        uri:photo.uri
      })
    
      data.append('upload_preset','rzmgazma')
      data.append('cloud_name','earthy')
      // console.log(data)

      if(photo.uri){
        fetch(
          'https://api.cloudinary.com/v1_1/earthy/image/upload',
          {
            method:'post',
            body:data
          }
        )
        .then((res)=>res.json())
        .then(data => {arr.push(data.url);console.log(i,len);if(arr.length==len){handleSubmit()}else{abc(i+1)}})
        .catch(err => console.log(err))
      
    
  }
  
}
  const takePicture = async () => {
    if(len==4){
      Alert.alert('Sorry only 4 images allowed')
      return ;
    }
    setModalVisible(false)
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });
    console.log(result)
    
    if(!result.cancelled){
      result = await rescaleImage(result) 
      console.log(result)
      let arr=images
      arr.push(result)
      setImages(arr)
      setLen(len => len+1)
    }


  };
  const [ploading,setpLoading] = useState(false)

  const handleSubmit=async()=>{
    console.log(title,body,arr)

    setpLoading(true)
    if(title.trim()&&body.trim()){
      axios.post('https://pra-blog-app.herokuapp.com/blogs',{
        title:title,
        body:body,
        images:arr,
        token:token
      }).then(()=>{
        setTitle('')
        setBody('')
        postModal()
        arr=[]
        setpLoading(false)
        render()
      })
      .catch(()=>{
        Alert.alert('Error Fetching Data')
      })
    }
    else{
      Alert.alert('Type something');
      setpLoading(false)
      return ;
    }
  }
  const [viewImg,setViewImg] = useState(false)
  const [title,setTitle] = useState('')
  const [body,setBody] = useState('')
  const clearAll=async(i=0)=>{
    // console.log(images)
    if(i<len){
      // for (var i=0 ;i<len;i++){
        console.log('running')
        console.log(images[i].uri)
        FileSystem.deleteAsync(images[i].uri)
        .then(()=>{clearAll(i+1);if(i==len-1){setImages([])}})
    }
    else {
      console.log('running1')
      abcd()
    }
  }
  const abcd=()=>{
      // setImages([])
      setLen(len=>0)
    
    setTitle('')
    setBody('')
  }
  if(viewImg){
    return(
      
      <View style ={{position:'absolute',top:0,left:0,right:0}}>
        <ImageViewer uri = { images[imgInd].uri } im ={()=>{setViewImg(false);setImgInd(-1)}} />
        <MaterialIcons name="delete" size={30}  color='#fff' style={{position:'absolute',top:8,right:10}} 
          onPress={()=>{setViewImg(false);removeImg(imgInd)}}/>
      </View>
    )
  }
    return (
      <Animatable.View  style={{...styles.container,backgroundColor:themeState.dr}}>

          <View  style={{ flexDirection:'row',alignItems:'center', position: 'absolute',  top: 0,  left: 0,  right: 0,
            elevation:11,backgroundColor:themeState.pri,height:60 }}  >
            <Ionicons color={themeState.sec} name="ios-arrow-back" size={24} style={{padding:16}} 
              onPress={()=>{console.log('pressed');postModal()}}/>
            <Text style={{fontSize:23,fontWeight:'bold',color:themeState.sec}}>Post</Text>
          </View>

          <Animated.View style={{flexDirection:'row',width:width,top:tp,
            paddingLeft:15,alignSelf:'flex-start',height:height-120}} >
            <ScrollView showsVerticalScrollIndicator = {false} style = {{paddingTop:10}}>  
            <Avatar.Image size={50} source={{uri:avatar}}/>
            <View style={{flexDirection:'column'}}>
              <TextInput placeholder="Title" value={title} onChangeText={(val)=>{setTitle(val)}}
                style={{paddingLeft:8,color:"#777",fontSize:14,height:50,width:width/1.3}}/>
              <TextInput placeholder="Spread Positivity..." value={body} onChangeText={(val)=>{setBody(val)}}
                multiline style={{paddingTop:15,paddingLeft:8,color:"#777",fontSize:14,width:width/1.2}}/>
            </View>
          
          {len !=0 &&
            <ImageView  images = {images} themeState = {themeState} viewImg = {(val)=>{console.log('running');setViewImg(res => true);setImgInd(val)}} len = {len}/>
          }
          <View style ={{height:5}}/>
          </ScrollView>
          </Animated.View>

          <View style ={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:themeState.pri,width:width,height:55,elevation:20,justifyContent:'center'}}>  
              <View style = {{flexDirection:'row'}}>
              <TouchableWithoutFeedback onPress={()=>{clearAll()}}>
                <View style={{width:100,top:24,left:5,height:30,alignItems:'center',justifyContent:'center',
                    backgroundColor:themeState.sec,elevatin:20,borderRadius:20}}>
                  <Text style ={{fontWeight:"bold",color:themeState.pri}}>Clear All</Text>
                </View>
              </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={takePicture}>
                  <View style={{...styles.individualicon,position:'absolute',left:width/2-60}}>
                    <Entypo style={{justifyContent:'center'}} name="camera"  size={15} color="black"/>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={selectPicture}>
                  <View style={{...styles.individualicon,left:100}}>
                    <MaterialCommunityIcons name='folder-image' size={18} color="black"/>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress = { () => {console.log('clicked');createFormData()}}>
                  <View style={{width:100,top:24,height:30,alignItems:'center',justifyContent:'center',
                      position:'absolute',right:10,
                      backgroundColor:themeState.sec,elevatin:20,borderRadius:20}}>
                    <Text style ={{fontWeight:"bold",color:themeState.pri}}>Send</Text>
                  </View>
                </TouchableWithoutFeedback>
             
          </View>
          </View>
              
          <Spinner visible = {ploading} animation="fade" overlayColor="rgba(0,0,0,0)" color={themeState.sec}/>
          
        </Animatable.View>
    )
}  

const ImageView = ({images,len,viewImg,themeState}) =>{
  const  wid = width/1.1
  const ht = width/1.5
  // console.log(images.length)
  return (
    <View style = {{width:wid,height:ht,borderRadius:25,marginTop:15,backgroundColor:themeState.dr,overflow:'hidden'}}>
      {
        len == 0 &&
        null
      }
      {
        len == 1 && 
        <TouchableOpacity  onPress={()=>{viewImg(0)}}>
          <Image source={{uri:images[0].uri}} style = {{width:wid,height:ht,resizeMode:'cover'}}  />
        </TouchableOpacity>
      }
      {
        len == 2 && 
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity  onPress={()=>{viewImg(0)}}>
            <Image source={{uri:images[0].uri}} style = {{width:wid/2-1,height:ht,resizeMode:'cover'}}  />
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=>{viewImg(1)}}>
            <Image source={{uri:images[1].uri}} style = {{width:wid/2-1,height:ht,resizeMode:'cover'}}  />
          </TouchableOpacity>
        </View> 
      }
      {
        len == 3 && 
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <TouchableOpacity  onPress={()=>{viewImg(0)}}>
            <Image source={{uri:images[0].uri}} style = {{width:wid/2-1,height:ht,resizeMode:'cover'}}  />
          </TouchableOpacity>

          <View style ={{justifyContent:'space-between'}}>
            <TouchableOpacity  onPress={()=>{viewImg(1)}}>
              <Image source={{uri:images[1].uri}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{viewImg(2)}}>
            <Image source={{uri:images[2].uri}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
            </TouchableOpacity>
          </View>
        </View> 
      }
      {
        images.length == 4 && 
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
          <View style ={{justifyContent:'space-between'}}>
            <TouchableOpacity  onPress={()=>{viewImg(0)}}>
              <Image source={{uri:images[0].uri}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{viewImg(1)}}>
              <Image source={{uri:images[1].uri}} style = {{marginTop:3,width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
            </TouchableOpacity>
          </View>
          <View style ={{justifyContent:'space-between'}}>
            <TouchableOpacity  onPress={()=>{viewImg(2)}}>
             <Image source={{uri:images[2].uri}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
            </TouchableOpacity>
            <TouchableOpacity  onPress={()=>{viewImg(3)}}>
              <Image source={{uri:images[3].uri}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
            </TouchableOpacity>
          </View>
        </View> 
      }
    </View>
  )
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
    paddingHorizontal:10,
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
  
  icons:{
    marginTop:height/14,
    justifyContent:'center',
    flexDirection:'row'
  },
  individualicon:{
    alignItems:'center',
    justifyContent:'center',
    marginHorizontal:10,
    backgroundColor:'rgb(220,20,60)',
    marginVertical:25,
    width:30,
    height:30,
    elevation:20,
    shadowOffset:{width:0,height:4},
    borderRadius:90
  }
});

export default ImageSelector
