import React,{useState,useEffect} from 'react';
import {Ionicons,MaterialIcons} from '@expo/vector-icons'
import { StyleSheet, View,Text,Image,Dimensions,AsyncStorage } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import MainApp from './MainApp'
const {width,height}=Dimensions.get('window')
import {firstLaunch} from './api/checkExpoNotification'


import Loader from './Loader.js'

const slides = [
  {
    key: 1,
    title: 'Title 1',
    text:'Daily News' ,
    image: require('./assets/news.png'),
    backgroundColor: 'rgb(255,135,0)',
  },
  {
    key: 2,
    title: 'Rocket guy',
    text: 'Stay Home ',
    image: require('./assets/corona2.png'),
    backgroundColor: 'rgb(0,140,250)',
  },
  {
    key: 3,
    title: 'Title 2',
    text: 'View Mark Delete Locations',
    image: require('./assets/location4.png'),
    backgroundColor: '#febe29',
    width:width/2,
    height:height/3
  },{
    key:4,
    text:'',
    image:require('./assets/inst.jpeg'),
    backgroundColor:'rgb(220,20,60)'
  },
  {
    key:5,
    text:'Stay Safe',
    image:require('./assets/corona3.png'),
    backgroundColor:'rgb(250,215,0)'
  }
];


const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  image:{
    width:width/2,
    height:height/2.5,
    borderRadius:20,
    resizeMode:'contain'
  },
});

const App=()=> {
  const [first,setFirst]=useState(true)
  const [loaded,setLoaded]=useState(false)
  let theme
  useEffect(()=>{
      getData()
  },[])
  const getData=async()=>{
    const val = await AsyncStorage.getItem('Launched')
    if(val==null){
      setFirst(true)
      setLoaded(true)
      await AsyncStorage.setItem('Launched','true')
    }
    else{
      setFirst(false)
      setLoaded(true)
    }
  }
  const renderItem = ({ item }) => {
    return (
      <View style={{...styles.slide,backgroundColor:item.backgroundColor}}>

        <Image source={item.image} style={{...styles.image}} />
        <Text style={{...styles.text,color:"#222",fontWeight:'bold'}}>{item.text}</Text>
      </View>
    );
  }
  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-arrow-round-forward"
          color="rgba(255, 255, 255, .9)"
          size={24}
        />
      </View>
    );
  };
  const renderSkipButton=()=>{
    return (
      <View style={styles.buttonCircle}>
        <MaterialIcons
          name="navigate-next"
          color="rgba(255,255,255,0.9)"
          size={34}
        />
      </View>
    )
  }
  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Ionicons
          name="md-checkmark"
          color="rgba(255, 255, 255, .9)"
          size={24}
          onPress={()=>{setFirst(false)}}
        />
      </View>
    );
  };
  if(!loaded && theme){
    <Loader />
    
  }
  if(loaded&&first){
    return (
      <AppIntroSlider
        data = {slides}
        renderItem = {renderItem}
        activeDotStyle = {{backgroundColor:'black'}}
        showSkipButton = {true}
        keyExtractor = {(item)=>item.key.toString()}
        renderDoneButton = {renderDoneButton}
        renderNextButton = {renderNextButton}
        renderSkipButton = {renderSkipButton}
      />
    );
  }
  if(loaded&&!first){
    // console.log('first',first)
    return <MainApp/>
  }
  return null
}
export default App
