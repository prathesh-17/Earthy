import React,{useEffect,useState} from 'react';
import MapView from 'react-native-maps';
import Permissions from 'expo-permissions'
import { StyleSheet, Text, View, Dimensions ,Modal,Alert,FlatList,TouchableWithoutFeedback,Image,Animated as Ani,ImageBackground, AsyncStorage } from 'react-native';
import {Entypo,MaterialIcons,AntDesign,FontAwesome,Ionicons} from '@expo/vector-icons'
import * as Location from 'expo-location';
import * as Animatable from 'react-native-animatable';
import TokenContext from '../tokenCntxt'
import axios from 'axios'
import {receiveData} from '../Auth/asyncStorage'
import ThemeContext from '../themeCntxt'
import LocationScreen from './Location'
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
const {width,height}=Dimensions.get('window')
import Location1 from './Location1'
import Spinner from 'react-native-loading-spinner-overlay';

export default function ExploreScreen() {
  const {themeState} = React.useContext(ThemeContext) 
  const TokId=React.useContext(TokenContext)
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [latitude,setLatitude]=useState(null)
  const [longitude,setLongitude]=useState(null)
  const [done,setdone]=useState(false)
  const [doo,setdo]=useState(false)
  const [amap,setaMap]=useState(false)
  const [dmap,setdMap]=useState(false)
  const [del,setDel]=useState(false)
  const [ploading,setploading]=useState(false)
  const [inst,setInst] = useState(false)
  useEffect(() => {
    func()
  },[doo]);

  const func = async()=>{
    const a = await AsyncStorage.getItem('maps')

      if(a=='true'){
        console.log('a running')
        // setInst(false)
        
      setTimeout(async() => {
        setploading(true)
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setploading(false)
        }
        try{
          if(!location){
            let location = await Location.getCurrentPositionAsync({});
            console.log(location)
            setLocation(location);
            setLatitude(location.coords.latitude)
            setLongitude(location.coords.longitude)}
          setdone(true)
          setploading(false)
        }
        catch(err){
          console.log(err)
        }
      },1000)
    }
    else{
      setInst(true)
    }  
  }

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const AddLocation=async()=>{
    const TokId=await receiveData()
    Alert.alert("Add Location","Are You Sure ?",[{text:"Cancel",style:"cancel"},
    {test:"Ok",onPress:()=>{axios.post('https://pra-blog-app.herokuapp.com/location',{
        token:TokId.Token,
        latitude,longitude
      }).then(()=>Alert.alert('Done'))
     }
    }
   ])
  }
  let i=0
  let vr = ['Happy U R Here !!!','This Is Completely Safe,\nWe Ourself Don\'t Know Ur Location','Add Your Location:\nAdds Ur Current Location As \na Corona Zone',
            'View And Delete Corona Zones:\nClick On The Red Spot And Delete \nThem','Mark Corona Zones : \nClick Anywhere In The Map To Add Them As A Corona Zone',
            'Wanna Travel : \nUr Current Location Is By Default The Start Location\nClick Anywhere to decide Ur Destination And\nFind Ur Route'];
  const t = new Ani.Value(0)
  const tt = new Ani.Value(20)
  
  const modSet1=()=>{
      if(i==-(vr.length-1)){
        i = 0
        console.log('running')  
        Ani.sequence([
          Ani.timing(tt,{
            duration:2000,
            toValue:-width
          })
        ]).start(async ()=>{t.setValue(0);await AsyncStorage.setItem('maps','true');setdo(!doo);})
        
        return
      }
      
      t.setValue(i*100)
      Ani.sequence([
        Ani.delay(1000),
        Ani.timing(t,{
          toValue:--i*100,
          duration:500
        })
      ]).start()
  }

  // if(inst){
  //   return (
  //     <View style = {{flex:1,backgroundColor:'white'}}>
  //     <View style={{positon:'absolute',backgroundColor:themeState.pri,alignItems:'center',justifyContent:'center',flexDirection:'row' ,top:0,
  //         width:width,height:height/14,elevation:14}}>
  //         <MaterialIcons name="location-searching" style={{paddingTop:10}} color={themeState.sec} size={30}/>
  //       </View>
      
  //   </View>      
  //   )
  // }

  const UserLocation=()=>{
    return null;
  }
  const scry = new Animated.Value(0)
  const scry1 = Animated.diffClamp(scry,0,height/14)
  const ht = Animated.interpolate(scry1,{
    inputRange:[0,height/14],
    outputRange:[height/14,0],
    extrapolate:'clamp'
  })
  const ty = Animated.interpolate(scry1,{
    inputRange:[0,height/14],
    outputRange:[0,-height/14],
    extrapolate:'clamp'
  })
  const op = Animated.interpolate(scry,{
    inputRange:[0,75*height/182],
    outputRange:[1,0],
    extrapolate:'clamp'
  })
  const op2 = Animated.interpolate(scry,{
    inputRange:[0,75*height/182],
    outputRange:[0.3,0],
    extrapolate:'clamp'
  })
  const op1 = Animated.interpolate(scry,{
    inputRange:[0,50*height/182,75*height/182,150*height/182],
    outputRange:[0,1,1,0],
    extrapolate:'clamp'
  })
  const op3 = Animated.interpolate(scry,{
    inputRange:[0,50*height/182,75*height/182,150*height/182],
    outputRange:[0,0.4,0.4,0],
    extrapolate:'clamp'
  })
  const op4 = Animated.interpolate(scry,{
    inputRange:[50*height/182,150*height/182],
    outputRange:[0,1],
    extrapolate:'clamp'
  })
  const op5 = Animated.interpolate(scry,{
    inputRange:[75*height/182,150*height/182],
    outputRange:[0,0.4],
    extrapolate:'clamp'
  })
  const [tmap,settMap] = useState(false)
    return (
      <View>
        <Spinner visible={ploading} animation="fade" overlayColor="rgba(0,0,0,0.3)" color='black'/>

        <Animated.View style={{positon:'absolute',backgroundColor:themeState.pri,alignItems:'center',justifyContent:'center',flexDirection:'row' ,top:0,
          width:width,height:height/14,transform:[{translateY:ty}],elevation:14}}>
          <MaterialIcons name="location-searching" style={{paddingTop:10}} color={themeState.sec} size={30}/>
        </Animated.View>
        <ScrollView onScroll = {(e)=>{scry.setValue(e.nativeEvent.contentOffset.y)}} 
          style={{backgroundColor:themeState.dr,marginTop:-height/14}} showsVerticalScrollIndicator = {false} >
        <View style = {{width:width,height:height/14,backgroundColor:themeState.dr}}/>
        <View style={{width:width,backgroundColor:'white',alignItems:"center",justifyContent:'space-around'}}>
        <TouchableWithoutFeedback onPress={()=>{AddLocation()}}>
            <View style={{...styles.options,overflow:'hidden'}}>
              <ImageBackground source={require('../assets/travel.jpg')} imageStyle={{borderRadius:20,opacity:0.8}}
                style={{flex:1}}/>
              <Animated.Text style={{top:width/2+47,left:40,fontSize:22,position:'absolute',color:'#000',fontWeight:'bold',opacity:op}}> Add Your Location </Animated.Text>  
              <Animated.Text style={{top:width/2+67,left:40,fontSize:22,position:'absolute',transform:[{rotateZ:'180deg',rotateY:'180deg'}],color:'#000',fontWeight:'bold',opacity:op2}}> Add Your Location </Animated.Text>
              
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>setdMap(true)}>
            <View style={styles.options}>
              <ImageBackground source={require('../assets/wonders3.png')} imageStyle={{borderRadius:20,resizeMode:'cover'}}
                style={{flex:1,justifyContent:'center',opacity:0.8}}/>
              <Animated.Text style={{top:width/2-10,left:40,fontSize:22,position:'absolute',color:'#000',fontWeight:'bold',opacity:op1}}> View and Delete Corona Zones </Animated.Text>  
              <Animated.Text style={{top:width/2+10,left:40,fontSize:22,position:'absolute',transform:[{rotateZ:'180deg',rotateY:'180deg'}],color:'#000',fontWeight:'bold',opacity:op3}}> View and Delete Corona Zones </Animated.Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>{setaMap(true)}}>
            <View style={styles.options}>
              <ImageBackground source={require('../assets/wonders3.png')} imageStyle={{borderRadius:20}}
                style={{flex:1,justifyContent:'center',opacity:0.8}}/>
              <Animated.Text style={{top:width/2-20,left:40,fontSize:22,position:'absolute',color:'#000',fontWeight:'bold',opacity:op4}}> Mark Corona Zones </Animated.Text>  
              <Animated.Text style={{top:width/2,left:40,fontSize:22,position:'absolute',transform:[{rotateZ:'180deg',rotateY:'180deg'}],color:'#000',fontWeight:'bold',opacity:op5}}> Mark Corona Zones </Animated.Text>
              </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={()=>{settMap(true)}}>
            <View style={styles.options}>
              <ImageBackground source={require('../assets/travel.jpg')} imageStyle={{borderRadius:20}}
                style={{flex:1,justifyContent:'center',opacity:0.8}}/>
              <Animated.Text style={{top:width/2+50,left:40,fontSize:22,position:'absolute',color:'#fff',fontWeight:'bold',opacity:op4}}> Wanna Travel </Animated.Text>  
              <Animated.Text style={{top:width/2+70,left:40,fontSize:22,position:'absolute',transform:[{rotateZ:'180deg',rotateY:'180deg'}],color:'#fff',fontWeight:'bold',opacity:op5}}> Wanna Travel </Animated.Text>
              </View>
          </TouchableWithoutFeedback>
        </View>

        <View style ={{width:width,height:height/15,marginTop:10,backgroundColor:themeState.dr}} />
        
        </ScrollView>

        {
          inst &&
          <Ani.View style={{flexDirection:'row',alignItems:'center',width:width/1.1,height:100,borderRadius:30,backgroundColor:'rgb(220,20,60)',
            elevation:20,justifyContent:'center',top:height/2-50,left:tt,position:'absolute'
            }}>
            <Ani.Image source = {require('../assets/smile.png')} style = {{width:100,height:100,left:5,top:-10}} />
            <View style={{overflow:'hidden',width:width/1.3,height:100}}>
              <Ani.View style ={{height:vr.length*100,justifyContent:'space-around',top:t}}> 
              {vr.map((item,ind) => {return (  
                  <View key={item} style ={{height:80,padding:5,justifyContent:'center'}}>
                  <Text  style ={{textAlignVertical:'center',fontWeight:'bold',fontSize:(ind==vr.length-1?11:16)}} >{item}</Text>
                  </View>
                )} )}
              </Ani.View>
            </View>
            <Ionicons name = 'ios-arrow-dropright-circle' style={{left:-30}} size = {30} onPress = {()=>{ modSet1() }} />
          </Ani.View>
        }
        <Modal animation="slide" visible={amap}><LocationScreen type="add"  back={()=>{setaMap(false)}} cur={{latitude,longitude}}/></Modal>
        <Modal animation="slide" visible={dmap}><LocationScreen type="delete" back={()=>{setdMap(false)}} cur={{latitude,longitude}}/></Modal>
        <Modal animation="slide" visible={tmap}><Location1 type="travel" back={()=>{settMap(false)}} cur={{latitude,longitude}}/></Modal>
      </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  options:{
    height:75*height/182,
    padding:5,
    width:width,
    borderRadius:20,
    marginTop:8,
    elevation:20,
    backgroundColor:'white'
  },
  modal:{
    backgroundColor:'#eee',
    position:'absolute',
    bottom:0,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    width:width,
    elevation:20,
    height:height/3
  },
  close:{
    position:'absolute',
    top:-30,
    backgroundColor:'black',
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

});
