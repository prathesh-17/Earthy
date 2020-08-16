import React from 'react'
import {View,Text,Image,TouchableOpacity,Dimensions} from 'react-native'

const {width,height} =Dimensions.get('window')
const ImageView = ({images,len,viewImg,themeState,wd,imgs}) =>{
    const  wid = width/wd
    // console.log(images)
    const ht = width/1.5
    // console.log(images.length)
    if(len==0){
        return null
    }
    return (
      <View style = {{width:wid,height:ht,borderRadius:25,marginTop:15,backgroundColor:themeState.dr,overflow:'hidden'}}>
          
        
        {
          len == 1 && 
          <TouchableOpacity  onPress = {()=>{imgs(0)}}>
            <Image source={{uri:images[0]}} style = {{width:wid,height:ht,resizeMode:'cover'}}  />
          </TouchableOpacity>
        }
        {
          len == 2 && 
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity  onPress = {()=>{imgs(0)}}>
              <Image source={{uri:images[0]}} style = {{width:wid/2-1,height:ht,resizeMode:'cover'}}  />
            </TouchableOpacity>
            <TouchableOpacity  onPress = {()=>{imgs(1)}}>
              <Image source={{uri:images[1]}} style = {{width:wid/2-1,height:ht,resizeMode:'cover'}}  />
            </TouchableOpacity>
          </View> 
        }
        {
          len == 3 && 
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <TouchableOpacity  onPress = {()=>{imgs(0)}}>
              <Image source={{uri:images[0]}} style = {{width:wid/2-1,height:ht,resizeMode:'cover'}}  />
            </TouchableOpacity>
  
            <View style ={{justifyContent:'space-between'}}>
              <TouchableOpacity  onPress = {()=>{imgs(1)}}>
                <Image source={{uri:images[1]}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
              </TouchableOpacity>
              <TouchableOpacity onPress = {()=>{imgs(2)}} >
              <Image source={{uri:images[2]}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
              </TouchableOpacity>
            </View>
          </View> 
        }
        {
          len == 4 && 
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style ={{justifyContent:'space-between'}}>
              <TouchableOpacity onPress = {()=>{imgs(0)}} >
                <Image source={{uri:images[0]}} style = {{width:wid/2-1,height:ht/2-1,resizeMode:'cover'}}  />
              </TouchableOpacity>
              <TouchableOpacity onPress = {()=>{imgs(1)}} >
                <Image source={{uri:images[1]}} style = {{marginTop:3,width:wid/2-1,height:ht/2-2,resizeMode:'cover'}}  />
              </TouchableOpacity>
            </View>
            <View style ={{justifyContent:'space-between'}}>
              <TouchableOpacity onPress = {()=>{imgs(2)}} >
               <Image source={{uri:images[2]}} style = {{width:wid/2-2,height:ht/2-1,resizeMode:'cover'}}  />
              </TouchableOpacity>
              <TouchableOpacity onPress = {()=>{imgs(3)}} >
                <Image source={{uri:images[3]}} style = {{width:wid/2-2,height:ht/2-1,resizeMode:'cover'}}  />
              </TouchableOpacity>
            </View>
          </View> 
        }
      </View>
    )
  }

  export default ImageView