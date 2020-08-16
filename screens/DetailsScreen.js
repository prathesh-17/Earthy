import React,{useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet,Dimensions, AsyncStorage } from 'react-native';
import Swiper from '../Animation/swiper'
import axios from 'axios'
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get("window");

const DetailsScreen = () => {
    const [posts,setPosts]=useState([])
    const [posts1,setPosts1] = useState([])
    const [wid,setWid] = useState(false)
    const [wid1,setWid1] = useState(false)
    const [same,setSame] = useState(false)
    const [inst,setInst] = useState(false)

    useEffect(()=>{
      getPosts()
    },[wid])
    const getPosts=async()=>{
      
      if(wid1){
        setPosts(posts1)
        setWid1(false)
      }
      else{
        axios.get('https://pra-blog-app.herokuapp.com/news')
        .then(async(res) =>{
          // console.log("post length "+posts.length)
          if(posts1.length != 0){
            console.log('inside running ...')
            if(res.data.news.length == posts1.length &  res.data.news[0].title == posts1[0].title ){
              console.log('same')
              setSame(true)
            }
          }
          // console.log('below running ....')
          // console.log(res.data.news.length)
          // setPosts(res.data.news)
          // setPosts1(res.data.news)
          setPosts(res.data.news)
          setPosts1(res.data.news)
          const a = await AsyncStorage.getItem('news')
          if(a){
          }
          else{
            // console.log('no news')
            setInst(true)
          }
        // console.log(posts)
        })
      }
    }
    if(inst){
      setTimeout(async()=>{
        setInst(false)
        await AsyncStorage.setItem('news','true')
      },2000)
    }
    if(same){
      setTimeout(() => {
        setSame(false)
      }, 2000);
      // return (
      //   <Animatable.View animation="fadeInUpBig" style = {{alignItems:'center',justifyContent:'center'}}>
      //     <Text style = {{fontWeight:'bold',fontSize:200,letterSpacing:13.0}}>NO</Text>
      //     <Text style = {{fontWeight:'bold',fontSize:80,backgroundColor:'rgb(0,0,0)',width:width/1.1,textAlign:'center',borderRadius:10,
      //       letterSpacing:3.0,color:'rgb(255,215,0)'}}>CHANGE</Text>
      //   </Animatable.View>
      // )
    }
    return (
        (posts.length!=0?
            <Swiper posts = {posts} setwid = {()=>{setWid(!wid);setPosts([]);}} same = {same} inst = {inst} />
            
          :
          <Spinner visible={posts.length == 0} animation="fade" overlayColor="rgba(0,0,0,0)" color="black" />)
    )
};

export default DetailsScreen;


            // 