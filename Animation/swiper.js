import React,{useEffect,useState} from "react";
import { Dimensions, Image, StyleSheet, View,Text,TouchableOpacity } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {add,clockRunning,cond,debug,divide,sub,eq,floor,not,set,useCode} from "react-native-reanimated";
import {snapPoint,timing,useClock,usePanGestureHandler,useValue,mix,useTransition} from "react-native-redash";
import axios from 'axios'
import {Avatar, TouchableRipple} from 'react-native-paper'
import { MaterialCommunityIcons,Ionicons,AntDesign,Entypo } from "@expo/vector-icons";
import ThemeContext from '../themeCntxt'
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex:1
  },

  pictures: {
    width: width*2.0 ,
    height:height,
    flexDirection: "row",
  },
  picture: {
    width,
    height,
    overflow: "hidden",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode:'contain'
  },
});

const News=({item})=>{
  const {themeState} = React.useContext(ThemeContext)

  while(item.body.split(' ').length > 170 ){
    item.body = item.body.slice(0,item.body.lastIndexOf('.',item.body.lastIndexOf('.')-2))
    if (item.body.split(' ').length <140){
      break
    }
  }
  
  // console.log('post : '+item.body.split(' ').length )
  return (
    <View style={{padding:0,width:width-20,margin:10,marginTop:5,marginBottom:height/15,borderRadius:20,
      backgroundColor:themeState.pst,elevation:10, height:115*height/143}}>
      <Image style={{width:width-20,borderTopLeftRadius:20,borderTopRightRadius:20,height:height/2.7}} source={{uri:item.imageUrl}}/>
      <Text style={{fontSize:20,fontWeight:'bold',color:themeState.txt,padding:9}}>{item.title}</Text>
      <Text style={{padding:10,fontSize:12,paddingTop:0,color:themeState.txt,maxHeight:height/2.5}}>{item.body}</Text>
    </View>
  )
}

const Swiper = (props) => {
  const {themeState} = React.useContext(ThemeContext)
  const [op,setOp] = useState(false)
  const transition = useTransition(op);
  const w = mix(transition,0,-180)
  const z = mix(transition,0,Math.PI)
  const [wid,setWid] = useState(40)
  const {setwid,same,inst} = props
  

  if(props.posts.length!=0){
    
    const snapPoints = props.posts.map((_, i) =>{ return i * -width});
    const trans = useTransition(same)
    const bt = mix(trans,0,-140)
    const trans1 = useTransition(inst)
    const bt1 = mix(trans1,0,-140)
    const clock = useClock();
    const index = useValue(0);
    const offsetX = useValue(0);
    const translateX = useValue(0)
    const {gestureHandler,state,velocity,translation,} = usePanGestureHandler();
    const to = snapPoint(translateX, velocity.x, snapPoints);
    const t = useValue(0);
    
    
      useCode(
        () => [                          
          cond(eq(state, State.ACTIVE), [
            
            set(translateX, add(offsetX, translation.x)),
            // debug('to',to)
          ]),
          cond(eq(state, State.END), [
            // debug('running',state),
            cond(eq(t,0),[
              set(translateX, timing({ clock, from: translateX, to })),
            ]),
            cond(eq(translateX,0),[set(t,add(0,0))]),
            cond(eq(t,1),[
              set(translateX,timing({clock,from:translateX,to:0})),
              cond(eq(translateX,0),[set(t,add(0,0))]),

              // debug('tr-',add(translateX,width)),
              // debug('tr',translateX),
              // debug('to',to)
            ]),
            set(offsetX, translateX),
            cond(not(clockRunning(clock)), [
              set(index, floor(divide(translateX, -width))),
              // debug('index',index)
            ]),
          ]),
        ],
        []
      );
      
    
    // console.log('swiper posts'+props.posts.length)
    return (
      <View style={styles.container}>
        <PanGestureHandler {...gestureHandler}>
          <Animated.View style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[styles.pictures, { transform: [{ translateX }]}]}
            >
            {props.posts.map(item=>(
              <News item={item} key={item._id }/>))}
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
        <Animated.View style={{position:'absolute',overflow:"hidden",alignItems:'center',flexDirection:'row',justifyContent:'space-around',backgroundColor:'rgb(255,215,0)',
            bottom:height/2-50,right:-180,width:220,height:100,borderBottomLeftRadius:25,borderTopLeftRadius:25,elevation:20,alignSelf:'flex-end',
            transform:[{translateX:w}]}}>
          
          <TouchableRipple onPress={()=>{setOp(!op)}}>
            <View style={{left:-12,width:50,height:100,alignItems:'center',justifyContent:'center',backgroundColor:themeState.sec}}>
              {/* {op?<Ionicons  color='rgb(255,215,0)' name="ios-arrow-forward" size={30} />
              : */}
              <Animated.View style={{transform:[{rotateZ:z}]}}>
                <Ionicons  color={themeState.pri} name="ios-arrow-back" size={30} />
              </Animated.View>  
            </View>
          </TouchableRipple>      
          <TouchableRipple onPress={()=>setwid()}>
          <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,0)',
            width:50,height:50,borderRadius:25,elevation:10}}>
            <MaterialCommunityIcons name="restart" size={30} color='rgb(255,215,0)' />
          </View></TouchableRipple>
          <TouchableRipple onPress = {()=>{t.setValue(1);setOp(false)}}>
          <View style={{alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,0)',
              width:50,height:50,borderRadius:25,elevation:10}}>
            <Entypo name="arrow-with-circle-up" size={30} color='rgb(255,215,0)'/>
          </View></TouchableRipple>
          
              </Animated.View>
        
         <Animated.View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,0)',
            alignItems:'center',flexDirection:'row',transform:[{translateY:bt}],
            bottom:-120,right:width/4,width:width/2,height:50,borderRadius:25,elevation:10}}>
          <MaterialCommunityIcons name="update" size={30} color='rgb(255,215,0)' />
          <Text style = {{fontWeight:'bold',color:('rgb(255,215,0)'),paddingLeft:10}}>Feed is up to date</Text>
        </Animated.View> 
        <Animated.View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(0,0,0)',
            alignItems:'center',flexDirection:'row',transform:[{translateY:bt1}],
            bottom:-120,right:width/4,width:width/2,height:50,borderRadius:25,elevation:10}}>
          <Text style = {{fontWeight:'bold',color:('rgb(255,215,0)'),paddingLeft:10}}>Swipe Left For More News</Text>
        </Animated.View> 
      </View>
    );
  }
  return null
};

export default Swiper;
