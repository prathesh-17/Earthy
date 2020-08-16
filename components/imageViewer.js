import React,{useState,useEffect} from 'react'
import {View,Image,Dimensions,StatusBar,StyleSheet} from 'react-native'
import {AntDesign,Entypo,MaterialIcons,FontAwesome,Feather,EvilIcons,Ionicons,MaterialCommunityIcons} from '@expo/vector-icons'
import {useTransition,mix, useVector,pinchActive,pinchBegan,timing,translate,onGestureEvent,
  pinchEnd, vec, transformOrigin} from 'react-native-redash'
import {PinchGestureHandler, State} from 'react-native-gesture-handler'
import Animated,{block,cond,eq,set,useCode,debug} from 'react-native-reanimated'
import Spinner from 'react-native-loading-spinner-overlay'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system'

const {width,height} = Dimensions.get('window')
const SIZE =width

const  ImageViewer=({uri,visible,im,imgv})=>{
  const [state1,setState] = useState(0)
    const [st,setSt] = useState(false)
    const trans = useTransition(st)
    const wd = mix(trans,0,width)
    const wd1 = mix(trans,0,width)
    const sz = mix(trans,0,1)
    const [loading,setLoading] = React.useState(false)
      
      const [originx,setOriginx] = useState(0)
      const [originy,setOriginy] = useState(0)
      const [focalx,setfocalx] = useState(0)
      const [focaly,setfocaly] = useState(0)
                                                              
      const pinchx = new Animated.Value(0)
      const pinchy = new Animated.Value(0)

      const scale1 = new Animated.Value(1);
      const numberOfPointers1 = new Animated.Value(0);
      
      // const pinchGestureHandler = onGestureEvent({numberOfPointers1,scale1,state,focalX: focal1.x,focaly: focal1.y,})
      
      // const zIndex = cond(eq(state, State.ACTIVE), 3, 0);
      const shareImg = async() => {
        if(!(await Sharing.isAvailableAsync())){
          alert('sharing is n\'t available in ur devicce')
          return
        }
        setLoading(true)
        FileSystem.downloadAsync(
          uri,
          FileSystem.documentDirectory + 'abc.jpg'
        )
          .then(async({uri})=>{
            console.log(uri)
            setLoading(false)
            await Sharing.shareAsync(uri)
            await FileSystem.deleteAsync(FileSystem.documentDirectory+'abc.jpg')     
          })
          .catch(err=>{
            alert('Something Went Wrong')
            setLoading(false)
          })
       }
      const handleGesture=(e)=>{
        const {focalX,focalY,numberOfPointers,scale,oldState,state} = e.nativeEvent
        // setfocalx(focalX - SIZE/2)
        // setfocaly(focalY - SIZE/2)
        scale1.setValue(scale)
        numberOfPointers1.setValue(numberOfPointers)
        
        if(state1 == State.ACTIVE){
          pinchx.setValue(-(originx-focalX+SIZE/2))
          pinchy.setValue(-(originy-focalY+SIZE/2))
        }
      }
      const handleStateChange = (e)=>{
        const {focalX,focalY,state,oldState} = e.nativeEvent
        setState(state)
        // console.log(e.nativeEvent)
        if(oldState == State.BEGAN){
          setOriginx(focalX-SIZE/2)
          setOriginy(focalY-SIZE/2)
        }
        if(state == State.END){
          Animated.spring(scale1,{
            toValue:1,
            useNativeDriver:true
          }).start
        }
      }

   
    useEffect(() => {
        setSt(true)
        setTimeout(() => {
          setSt(true)
          console.log('img view st '+ st)
        }, 1000);
        return () => {
            setSt(false)
        }
    }, [])
    return(
        (st&&
         
        <Animated.View style = {{position:'absolute',justifyContent:'center',
        top:0,left:0,right:0,width:width,height:height,backgroundColor:'black',  
        flex:1,left:-width,transform:[{translateX:wd1}]}}>
            <StatusBar hidden={true} />
            <View style = {{position:'absolute',top:10,left:10}}>
                <Ionicons name="md-arrow-back" color="white" size={30} onPress={()=>{setLoading(true);setTimeout(() => {
                  setSt(false);im();setLoading(false)
                }, 500);}} />
            </View>
            <View style = {{width:35,height:35,borderRadius:35,position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(255,215,0)',
              bottom:20,right:10}}>
                <MaterialIcons name="share" size={25} style={{left:-1}} onPress={()=>{shareImg()}} />
            </View>
        {st&&
        <Animated.View style = {{elevation:20}}>
          <Animated.View style={{ width: SIZE, height: SIZE,elevation:10 }}>
            <PinchGestureHandler  onHandlerStateChange = {(e)=>{handleStateChange(e)}} onGestureEvent = {(e)=>{handleGesture(e)}}>
              <Animated.View style={StyleSheet.absoluteFill}>
                {loading?
                <Spinner visible={loading} animation="fade" overlayColor="rgba(0,0,0,0)" color='blue' /> 
                :
                <Animated.Image
                  style={[styles.image,{transform: [...transformOrigin({x:originx,y:originy},{scale:scale1}),...translate({x:pinchx,y:pinchy})]  } ]}
                  source = {{uri:uri}}
                />}
              </Animated.View>
            </PinchGestureHandler>
          </Animated.View>
        </Animated.View>}
        
       </Animated.View>)
    )
    

    
}

const styles = StyleSheet.create({
  image :{
    ...StyleSheet.absoluteFillObject,
    width:undefined,
    height:undefined,
    resizeMode:'cover'
  }
})

export default ImageViewer;