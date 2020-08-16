import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet,Button,Platform,Alert,BackHandler,TouchableWithoutFeedback,Image,
  Dimensions,TouchableHighlight,TouchableOpacity } 
  from 'react-native';
import Animated from 'react-native-reanimated'
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {receiveData} from '../Auth/asyncStorage'
import axios from 'axios'
import  MapView,{Polyline}  from 'react-native-maps'
import Loader from '../Loader'
import Spinner from 'react-native-loading-spinner-overlay';
import { TextInput,  ScrollView } from 'react-native-gesture-handler';
import { useTransition,mix } from 'react-native-redash'

const {width,height}=Dimensions.get('window')

export default function LocationScreen({cur,back,type}) {
  const [pos,setPos] = useState(false)
  const trans = useTransition(pos)
  const ty = mix(trans,0,-height/2.2+50)
  const rot = mix(trans,0,Math.PI)

  const [locations,setLocations]=useState([])
  const {latitude,longitude}=cur
  const [loading,setLoading]=useState(false)
  const [search,setSearch] = useState(false)
  const _map = React.useRef(null)

  const [start,setStart] = useState({})
  const [l,setL] = useState('')
  const [dest,setDest] = useState({})
  const [loc,setLoc] = useState('')
  const [sr,setSr] = useState(false)
  const [res,setRes] = useState([])
  const [coords,setCoords] = useState([])
  const [render,setRender] = useState(false)
  const [prope,setProp] = useState({distance:6000,duration:500})
  const [step,setStep] = useState([1,2,3,4,5,6,6,67])
  useEffect(() => {
      getUser()
      setStart({latitude,longitude})
      setCoords([])
      setPos(false)
      setL('')
      setDest({})
      setStep([])
      setProp({})
      if(_map.current){
        _map.current.animateCamera(
          {
            center:{
              latitude:parseFloat(latitude),
              longitude:parseFloat(longitude)
            },
            zoom:12
          },
          1000
        )
      }
  }, [])
  const getUser=async()=>{
    const TokId=await receiveData()
    axios.get('https://pra-blog-app.herokuapp.com/location')
      .then((res)=>{setLocations(res.data);
        
      })
  }

  const addLocation=(val)=>{
    
    setL(val)
    // setLocations([...locations,res.data])
    
  }
  const req = ()=>{
    setLoading(true)
    axios.get(`https://nominatim.openstreetmap.org/search?q=+${loc},India&format=json`)
    .then(res =>{return res.data})
    .then(res =>{
      setRes(res)
      // anim()
      setLoading(false)
    })   
  }
  // setLoading(false)
  let arr = [];
  const [colen,setColen] = useState(0)
  const req1 = async() =>{
      setLoading(true)
    getDirections(`${start.longitude},${start.latitude}`,`${dest.longitude},${dest.latitude}`)
        .then(cods => {setCoords(cods);setColen(cods.length);arr = cods;setCoords(cods);setLoading(false)})
        .catch(err=>{console.log('something went wrong')})
  }
  const chngTxt = (e) => {
    
    setLoc(e)
    if(res.length != 0){
      setRes([])
    }
    if(e.trim().length>2){
      setSr(true)
    }
    else{
      setSr(false)
    }
  }

  const moveMap=(val)=>{
    const {lat,lon} = val
    _map.current.animateCamera(
      {
        center:{
          latitude:parseFloat(lat),
          longitude:parseFloat(lon)
        },
        zoom:12
      },
      1000
    )
    // setRes([])
  }
  
  const getDirections = async(startLoc, destinationLoc) => {
    try {
      const KEY = "5b3ce3597851110001cf6248bb50c9e97f6a410cad9c3b18e837ddd9";
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${KEY}&start=${startLoc}&end=${destinationLoc}`
      // console.log(url)
      const res = await axios.get(url)
      let points = res.data.features[0].geometry.coordinates
      const {distance,duration,steps} = res.data.features[0].properties.segments[0]
      let coords = points.map((point, index) => {
          return {
            latitude: point[1],
            longitude: point[0]
          };
          });
      setCoords(coords)
      console.log(distance,duration,steps[0])
      if(duration){
        console.log('running')
        setStep(steps)
        setProp({distance,duration})
      }
      return coords
      
    } catch (error) {
      console.log(error)
    }
  };
  const CustomMarker = ({name}) =>{
    if(name == 'green')
    return (
      <View style = {{width:90,backgroundColor:'#fff',borderRadius:20,height:35,elevation:10,padding:8,flexDirection:'row',alignItems:'center'}}>
        <Image source = {require('../assets/corona2.png')} style={{width:25,height:25}}/>
        <Text style={{fontSize:12,fontWeight:'bold'}}> U R Here </Text>
      </View>
    )
    if(name == 'red')
    return (
      <View style = {{width:23,height:23,elevation:10,resizeMode:'cover'}}>
        <Image source = {require('../assets/virus.png')} style={{width:23,height:23}}/>
        
      </View>
    )
    if(name == 'start')
    return (
      <View style = {{width:70,backgroundColor:'#fff',borderRadius:20,overflow:'hidden',height:30,elevation:10,flexDirection:'row',alignItems:'center'}}>
        <View style={{width:25,height:30,backgroundColor:'rgb(0,140,140)',padding:1}}>
        <MaterialCommunityIcons name = "source-commit-start" size = {25} /></View>
        <Text style={{fontSize:12,fontWeight:'bold',paddingLeft:2}}> Start</Text>
      </View>
    )
    if(name == 'dest')
    return (
      <View style = {{width:75,backgroundColor:'#fff',borderRadius:20,overflow:'hidden',height:30,elevation:10,flexDirection:'row',alignItems:'center'}}>
        <View style={{width:25,height:30,backgroundColor:'rgb(0,140,140)',padding:1}}>
        <MaterialCommunityIcons name = "source-commit-start" size = {25} /></View>
        <Text style={{fontSize:12,fontWeight:'bold',paddingLeft:2}}> Destiny</Text>
      </View>
    )
  }

  if(latitude!=null&&longitude!=null&&locations.length!=0){
    return (
      <View style={{flex:1}}>
        <View style={{ height:height/13,flexDirection:'row',justifyContent:'flex-start',backgroundColor:'rgb(250,215,0)',alignItems:'center',elevation:5}}>
          <Ionicons name="ios-arrow-back" size={25} style={{left:10}} onPress={()=>{back()}}/>
          <View style={{width:40}}/>

            <View style={{alignItems:'center',elevation:10,backgroundColor:'#eee',borderRadius:20,height:32,marginTop:6,
                flexDirection:'row',width:285}}>
            
            <TextInput placeholderTextColor="rgba(0,0,0,0.7)" placeholder="Search Location..."  value={loc}
              style = {{paddingVertical:3,width:250,paddingLeft:20}}
              onChangeText = {(e)=>{chngTxt(e)} } />
            
              <MaterialIcons  name="location-searching" size={25}  /></View>
            

        </View>
       
        <View style={styles.container}>
          <MapView  style={styles.map} ref={_map} onPress={(e)=>addLocation(e.nativeEvent.coordinate)} showUserLocation initialRegion={{latitude,longitude,latitudeDelta:0.1321,longitudeDelta:0.1321}}>
          <MapView.Marker   coordinate={{latitude,longitude}} title={"Ur Location"} description={"hi there"}>
            <CustomMarker name='green' />
          </MapView.Marker>
           {start.hasOwnProperty('latitude')&&(
              start.latitude != latitude &&
                <MapView.Marker   coordinate={start} title={"start"} description={"start"}>
                  <CustomMarker name = 'start' />
                </MapView.Marker>  )}
          {dest.hasOwnProperty('latitude') ?  
            <MapView.Marker  coordinate={dest} title={"dest"} description={"dest"}>
              <CustomMarker name = 'dest'/>
            </MapView.Marker>
            :null} 
          
          { locations.map((item,index)=>{
            return <MapView.Marker key={item._id}  coordinate={{latitude:item.latitude,longitude:item.longitude}}
              title='Corona Zone' description={"Be Careful"}>
                  <CustomMarker name="red" />
                </MapView.Marker>
                }
          )}

            {coords.length > 0 && <Polyline coordinates={coords} strokeWidth={3} />}
          </MapView>
        </View>
        
        <Spinner visible={loading} animation="fade" overlayColor="rgba(0,0,0,0)" color='black'/>
        {sr&&
        <View style={{position:'absolute',top:80,right:20,width:50,
          alignItems:'center',justifyContent:'center',
          height:50,borderRadius:25,backgroundColor:'rgb(255,215,0)',elevation:25}}>
            
            <MaterialCommunityIcons name="map-search" size={30} onPress={()=>{req()}}/>
            
        </View>
        }

        <ScrollView stickyHeaderIndices={[1]} showsVerticalScrollIndicator={false} style={{width:width,position:'absolute',top:height/13}}>
          {res.length != 0  &&
            <TouchableOpacity onPress = {()=>{setRes([])}}>
              <View style ={{backgroundColor:'#eee',elevation:20,alignItems:'center',marginVertical:5,alignSelf:'center',
                justifyContent:'center',width:35,height:35,borderRadius:20}}>
                <MaterialCommunityIcons name="sword-cross" size = {18} />
              </View>
            </TouchableOpacity>}
          <View style={{alignItems:'center',justifyContent:'center'}}>
            {res.map((item,ind) =>{
              return (
                <TouchableOpacity underlayColor='rgba(0,140,140,0.2)' activeOpacity={0.8} key={Math.random().toString()} onPress={()=>{ moveMap(item) }} >
                  <View  style={{width:width-10,height:55,alignItems:'center',
                    backgroundColor:'rgb(0,140,140)',elevation:5,borderRadius:30,marginVertical:2,overflow:'hidden'}} >

                    <View style={{width:width-30,elevation:10,backgroundColor:'#222',justifyContent:'center',padding:10,height:55,
                      borderRadius:42}}>
                      <Text style={{paddingLeft:10,color:'white',fontSize:10}}>{item.display_name}</Text>
                    </View>

                  </View>
                </TouchableOpacity>
              )
            })

            }
          </View>
        </ScrollView>
       
        {l.hasOwnProperty('latitude') ?
        <View style={{position:'absolute',top:height/13,alignItems:'center',right:0,left:0,height:200,width:width,height:height,
            justifyContent:'center',backgroundColor:'rgba(0,0,0,0.2)'}}>
                <View style ={{flexDirection:'row'}}> 
                    <TouchableOpacity onPress = {()=>{setStart(l);setCoords([]);setL({})}}>
                        <View style = {{backgroundColor:'rgb(220,20,60)',elevation:10,width:width/3,height:30,borderRadius:30,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'white'}}> Start </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{width:25}}/>
                    <TouchableOpacity onPress = {()=>{setL('')}} >
                      <View style={{width:35,height:35,top:-5,backgroundColor:'black',elevation:5,alignItems:'center',justifyContent:'center',borderRadius:35}} >
                        <MaterialCommunityIcons name ="close" size = {25} color='white' />
                      </View>
                    </TouchableOpacity>
                    <View style={{width:25}}/>
                    <TouchableOpacity onPress = {()=>{setDest(l);setCoords([]);setL({})}}>
                        <View style = {{backgroundColor:'rgb(0,0,160)',width:width/3,elevation:10,height:30,borderRadius:30,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'white'}}> Dest </Text>
                        </View>
                    </TouchableOpacity> 
                </View>
            
        </View>:null}
        
        {dest.hasOwnProperty('latitude')?
            <View style={{position:'absolute',top:150,right:20,width:50,
            alignItems:'center',justifyContent:'center',
            height:50,borderRadius:25,backgroundColor:'rgb(255,215,0)',elevation:25}}>
                
                <MaterialCommunityIcons name="draw" size={30} onPress={()=>{req1()}}/>
                
            </View>
          :null
        }
        <TouchableWithoutFeedback onPress = {()=>{console.log('pressed');moveMap({lat:latitude,lon:longitude})}}>
        <View style={{position:'absolute',width:100,height:40,borderRadius:20,backgroundColor:'rgb(255,215,0)',
          top:85,left:10,elevation:10,padding:5,
          flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <MaterialCommunityIcons name = 'navigation' size = {20} />
          <Text style={{fontSize:10,fontWeight:'bold',letterSpacing:1.5}}>RECENTER</Text>
        </View></TouchableWithoutFeedback>

        {coords.length > 0 &&
          <Animated.View style = {{width:35,height:35,alignItems:'center',borderRadius:35,position:'absolute',elevation:25,top:140,backgroundColor:'#222',
            justifyContent:'center',transform:[{rotateZ:rot}],
            left:10}}>
            <Animated.View >
              <MaterialIcons onPress={()=>{console.log('clicked');setPos(pos => !pos)}} name = "arrow-drop-up" size={30} color='rgb(220,20,60)' />
            </Animated.View>
          </Animated.View>
         }
         {coords.length>0 &&

          <Animated.View style={{width:width,paddingTop:20,height:height/2.2,alignItems:'center',backgroundColor:'rgb(220,20,60)',
            transform:[{translateY:ty}],
            elevaion:10,borderRadius:20,position:'absolute',bottom:-height/2.2+60}} >
            <Animated.View style={{flexDirection:'row'}}>
              <Text style={{fontSize:20,left:5,fontWeight:'bold'}}>{Math.round(prope.distance/100)/10}</Text>
              <Text style={{alignSelf:'flex-end'}}>  Km</Text>
            <Animated.View style = {{width:width/1.5}}/>
              <Text style={{fontSize:20,left:5,fontWeight:'bold'}}>{3+Math.round(prope.duration/60)}</Text>
              <Text style={{alignSelf:'flex-end'}}>  Min</Text>
            </Animated.View>
            <Animated.View style={{width:width,overflow:'hidden',height:height/2.3,backgroundColor:'#222',elevation:20,borderRadius:10,marginTop:5}}>
              <Animated.ScrollView style = {{width:width,padding:5}} showsVerticalScrollIndicator={false} >
                {
                  step.map(item => {
                    return(
                      <Animated.View key ={Math.random().toString()} style={{width:width-10,height:65,elevation:5,borderRadius:20,
                        marginVertical:8,padding:5,justifyContent:'center',alignItems:'center',
                        backgroundColor:'rgb(255,215,0)'}}>
                          <Animated.View >
                            <Animated.Text style={{fontSize:15,fontWeight:'bold'}}>
                              {item.instruction}
                            </Animated.Text>
                          </Animated.View>
                      </Animated.View>
                    )
                  })
                }
                <Animated.View style={{widht:width,height:70,backgroundColor:'#222'}}/>
              </Animated.ScrollView>
            </Animated.View>
          </Animated.View>

        } 
      </View>
    );
  }
  return (<Loader/>)

}

const styles = StyleSheet.create({
  container: {
    flex: 13,
    backgroundColor:'rgb(250,215,0)',
    alignItems:'center',
    justifyContent:'center'
  },
  map:{
    position:'absolute',
    top:0,
    left:0,
    bottom:0,
    right:0
  }
});

 
