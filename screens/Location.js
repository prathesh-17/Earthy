import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet,Button,Platform,Alert,BackHandler,TouchableWithoutFeedback,Dimensions,Image,TouchableHighlight,TouchableOpacity,Animated } 
  from 'react-native';
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {receiveData} from '../Auth/asyncStorage'
import axios from 'axios'
import  MapView  from 'react-native-maps'
import Loader from '../Loader'
import Spinner from 'react-native-loading-spinner-overlay';
import { TextInput,  ScrollView } from 'react-native-gesture-handler';
import {divide} from 'react-native-reanimated'
const {width,height}=Dimensions.get('window')

export default function LocationScreen({cur,back,type}) {
  const [locations,setLocations]=useState([])
  const {latitude,longitude}=cur
  const [loading,setLoading]=useState(false)
  const [search,setSearch] = useState(false)
  const _map = React.useRef(null)
  useEffect(() => {
      getUser()
  }, [])
  const getUser=async()=>{
    const TokId=await receiveData()
    axios.get('https://pra-blog-app.herokuapp.com/location')
      .then((res)=>{setLocations(res.data)})
  }

  const deleteLocation=(id)=>{
    console.log('delete running',type,id)
    if(type=="add"){
      return
    }
    Alert.alert("Delete Location","Are You Sure ?",[{text:"Cancel",style:"cancel"},{test:"Ok",onPress:()=>{dlt(id)}}])
    const dlt=(id)=>{
      console.log(id)
      setLoading(true)
      axios.get(`https://pra-blog-app.herokuapp.com/location/remove/${id}`)
        .then(()=>{
          setLocations(locations.filter((item)=>{return item._id!=id}))
          setLoading(false)
          Alert.alert('Deletion Successful')
        })
        .catch(err=>{
          Alert.alert('Sorry something went wrong')
          setLoading(false)
        })
    }
  }
  const addLocation=(val)=>{
    if(type=="delete"){
      return
    }

    Alert.alert("Add Location","Are You Sure ?",[{text:"Cancel",style:"cancel"},{test:"Ok",onPress:()=>{addd(val)}}])
    const addd=async(val)=>{
      const TokId=await receiveData();
      setLoading(true)
      axios.post(`https://pra-blog-app.herokuapp.com/location`,
        {
          token:TokId.Token,
          latitude:val.latitude,
          longitude:val.longitude
        }
      )
        .then((res)=>{
          setLocations([...locations,res.data])
          setLoading(false)
          Alert.alert('Zone Added Successfully')
        })
        .catch(err=>{
          setLoading(false)
          Alert.alert('Sorry something went wrong')
        })
    }
  }
  const [loc,setLoc] = useState('')
  const [sr,setSr] = useState(false)
  const [res,setRes] = useState([])
  const req = ()=>{
    // console.log(loc)
    setLoading(true)
    axios.get(`https://nominatim.openstreetmap.org/search?q=+${loc},India&format=json`)
    .then(res =>{return res.data})
    .then(res =>{
      setRes(res)
      anim()
      setLoading(false)
    })   
  }
  const chngTxt = (e) => {
    // console.log(e)
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
  const op = new Animated.Value(0)
  const anim = (i=0)=>{
    if(i==res.length-1){
      return
    }
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(op,{
        toValue:i+1,
        duration:200
      }).start(()=>{anim(i+1)})
    ])
  }

  const moveMap=(val)=>{
    // console.log('run moveMap')
    const {lat,lon} = val
    // console.log('lat,long:',lat,lon)
    _map.current.animateCamera(
      {
        center:{
          latitude:parseFloat(lat),
          longitude:parseFloat(lon)
        },
        zoom:15
      },
      5000
    )
    // setRes([])
  }
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
  }
  if(latitude!=null&&longitude!=null&&locations.length!=0){
    return (
      <View style={{flex:1}}>
        <View style={{ height:height/13,flexDirection:'row',justifyContent:'flex-start',backgroundColor:'rgb(250,215,0)',alignItems:'center',elevation:5}}>
          <Ionicons name="ios-arrow-back" size={25} style={{left:10}} onPress={()=>{console.log('running');back()}}/>
          <View style={{width:30}}/>
          
            <View style={{alignItems:'center',elevation:10,backgroundColor:'#eee',borderRadius:20,height:40,
                flexDirection:'row',width:285}}>
            
            <TextInput placeholderTextColor="rgba(0,0,0,0.7)" placeholder="Search Location..."  value={loc}
              style = {{paddingVertical:3,width:250,paddingLeft:20}}
              onChangeText = {(e)=>{chngTxt(e)} } />
                            
              <MaterialIcons  name="location-searching" size={25}  /></View>
        
        </View>
        <View style={styles.container}>
          <MapView  style={styles.map} ref={_map} onPress={(e)=>addLocation(e.nativeEvent.coordinate)} showUserLocation initialRegion={{latitude,longitude,latitudeDelta:0.0321,longitudeDelta:0.0321}}>
          <MapView.Marker   coordinate={{latitude,longitude}} title={"Ur Location"} description={"hi there"}>
            <CustomMarker name = 'green'/>
          </MapView.Marker>
          { locations.map((item,index)=>{
            return <MapView.Marker key={item._id} onPress={()=>{deleteLocation(item._id)}} pinColor={"red"} coordinate={{latitude:item.latitude,longitude:item.longitude}}
              title={`${item.latitude} ${item.longitude}`} description={"Be Careful"}>
                  <CustomMarker name = 'red' />
                </MapView.Marker>
                }
          )}

          </MapView>
        </View>
        <Spinner visible={loading} animation="fade" overlayColor="rgba(0,0,0,0)" color='black'/>
        {sr&&
        <View style={{position:'absolute',bottom:20,right:20,width:50,
          alignItems:'center',justifyContent:'center',
          height:50,borderRadius:25,backgroundColor:'rgb(255,215,0)',elevation:25}}>
            
            <MaterialCommunityIcons name="map-search" size={30} onPress={()=>{req()}}/>
            
        </View>
        }
        <TouchableWithoutFeedback onPress = {()=>{console.log('pressed');moveMap({lat:latitude,lon:longitude})}}>
        <View style={{position:'absolute',width:100,height:40,borderRadius:20,backgroundColor:'rgb(255,215,0)',
          bottom:25,left:10,elevation:10,padding:5,
          flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <MaterialCommunityIcons name = 'navigation' size = {20} />
          <Text style={{fontSize:10,fontWeight:'bold',letterSpacing:1.5}}>RECENTER</Text>
        </View></TouchableWithoutFeedback>
        <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false} style={{width:width,position:'absolute',top:height/13}}>
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
                <TouchableOpacity underlayColor='rgba(0,140,140,0.2)' activeOpacity={0.8} key={Math.random().toString()} onPress={()=>{setRes([]); moveMap(item) }} >
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
