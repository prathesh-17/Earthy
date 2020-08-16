import React,{useState,useContext,useEffect} from 'react';
import { View, StyleSheet,Alert,Image,Dimensions,TouchableWithoutFeedback } from 'react-native';
import {Avatar,Title,Caption,Paragraph,Drawer,Text,TouchableRipple,Switch,Modal} from 'react-native-paper';
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer';
import {receiveData,removeItem} from '../Auth/asyncStorage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios'
import  AuthContext  from '../context'
import TokenContext from '../tokenCntxt'

import ThemeContext from '../themeCntxt'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const {width,height} = Dimensions.get('window')

let TokId;
let avatar;
const DrawerContents=(props)=> {
    const {themeState,themeDispatch} = useContext(ThemeContext)
    const {logOut}=React.useContext(AuthContext)
    const [loading,setLoading]=useState(false)
    const [upvoteModal,setUpvoteModal]=useState(false)
    const [userloading,setUserLoading]=useState(false)
    const [user,setUser]=useState({})
    const [id,setId]=useState('')
    const [token,setToken]=useState('')
    // const [avatar,setAvatar]=useState('')
    const [render,setRender]=useState(false)
    useEffect(() => {
        getData()
        return () => {

        }
    }, [render])

    const getData=async()=>{
      TokId=await receiveData()
      let id,token
      if(props.id){
        id=props.id
        token=props.token
      }
      else{
        id=props.Id
        token=props.Token
      }
      setTimeout(()=>{
        if(TokId&&TokId.Token){
          console.log('props token : ',id,token)
          setUserLoading(true)
          axios.get(`https://pra-blog-app.herokuapp.com/users/me`,{
            headers:{
              authorization:`Bearer ${token}`
            }
          })
          .then((res)=>{
            // console.log(res.data)
            setUser({...res.data.user,upvotes:res.data.upvotes})
            avatar=res.data.user.avatar

            // console.log('avatar',avatar)
            // console.log('user avatar',user.avatar)
            if(avatar==null){
              setRender(!render)
            }

            setUserLoading(false)
          })
          .catch(err=>console.log(err))
        }
      },1000)
  }
    const signOut=()=>{
      let id,token;
      if(props.id){
        token=props.token
      }
      else{
        token=props.Token
      }
      console.log(token)
      setLoading(true)
      axios.post('https://pra-blog-app.herokuapp.com/users/logout',{
        token:token
      }).then(async()=>{
        Alert.alert('Logout Successful')
        await logOut()
        setLoading(false)
      })
      .catch((err)=>{
        console.log(err)
        Alert.alert('signout Failed')
      })


    }

    return(
        <View style={{flex:1,backgroundColor:themeState.dr,width:width/1.2}}>

                    
                      <View style={{...styles.userInfoSection,height:0.15*height}}>
                          
                          <View style={{...styles.row}}>
                              <View style={styles.section}>
                                  <Text style={{fontSize:25,fontWeight:'700'}}>{user.upvotes}</Text>
                                  <Icon name="arrow-up-circle" size={25} />
                              </View>
                          </View>
                      </View>
                    
                      <View style = {{position:'absolute',elevation:10,top:0.15*height-65,left:width/1.2/2-60,width:120,height:120,borderRadius:120,borderWidth:3,borderColor:'#000'}}>
                        <Image source={{uri:avatar}} style={{width:undefined,height:undefined,flex:1,borderRadius:60}} />
                      </View>  
                       

                    <View style={{backgroundColor:'rgb(255,215,0)',top:-5,height:height-0.39*height}}>
                      <View style={{...styles.drawerSection,borderTopLeftRadius:60,
                        height:height-0.39*height,
                        backgroundColor:themeState.dr,top:0,left:0,paddingTop:35}}>
                        <View style={{alignItems:'center',justifyContent:'center',marginTop: 25}}>
                            {/* <Spinner visible={userloading}/> */}

                          
                          <View style={{alignItems:'center',paddingBottom:20,paddingTop:10}}>
                              <Title style={{...styles.title,color:themeState.txt}}>{user.name}</Title>
                              <Caption style={{color:themeState.txt,opacity:0.7}}>{user.email}</Caption>

                          </View>
                      </View>
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="home-outline" color='#666' size={size}/>
                            )}
                            label="Home"
                            labelStyle={{color:'#666'}}
                            onPress={() => {props.navigation.navigate('Home')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="account-outline"  color='#666' size={size}/>
                            )}
                            label="Profile"
                            labelStyle={{color:'#666'}}
                            onPress={() => {props.navigation.navigate('Profile')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon  name="arrow-up-circle-outline"  color='#666'  size={size}/>
                            )}
                            label="Upvotes"
                            labelStyle={{color:'#666'}}
                            onPress={() => {props.navigation.navigate('UpvoteScreen',{user:user})}}
                        />
                        
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon  name="account-check-outline"  color='#666'  size={size}/>
                            )}
                            label="Support"
                            labelStyle={{color:'#666'}}
                            onPress={() => {props.navigation.navigate('SupportScreen')}}
                        />
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon  name="account-search"  color='#666'  size={size}/>
                            )}
                            label="Search"
                            labelStyle={{color:'#666'}}
                            onPress={() => {props.navigation.navigate('SearchScreen',{user:user})}}
                        />
                    </View>
                    </View>          
              
                <View style={{heigth:height*0.24,backgroundColor:'black'}}>
                  <View style={{height:height*0.12,backgroundColor:themeState.dr,borderBottomRightRadius:60}}/>
                  <View style = {{height:height*0.12,backgroundColor:themeState.dr}} >
                    <View style={{flex:1,backgroundColor:'black',justifyContent:'center',borderTopLeftRadius:60,padding:20}}>
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon
                                name="exit-to-app"
                                color='#666'
                                size={size}
                                />
                            )}
                            label="Sign Out"
                            labelStyle={{color:'#666'}}
                            onPress={() => {signOut()}}
                        />
                    </View>
                  </View>
                </View>
              <View style = {{width:60,height:60,borderRadius:60,backgroundColor:themeState.sec,elevation:20, 
                  alignItems:'center',justifyContent:'center',position:'absolute',bottom:height*0.15+10,left:10}}> 
                  
                  {themeState.txt == '#000'?                  
                  <Icon name = 'lightbulb' size = {35} onPress={()=>{console.log('pressed');themeDispatch({type:'DARK'})}} color='rgb(255,215,0)'/>
                  :
                  <Icon name = 'lightbulb-on' size = {35} onPress={()=>{console.log('pressed');themeDispatch({type:'LIGHT'})}} />
                  }
              </View>
            {/* <Spinner visible={loading || userloading} animation="fade" overlayColor="rgba(0,0,0,0.3)" color="black"/> */}
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      padding: 20,
      backgroundColor:'rgb(255,215,0)',top:-5,
      // flex:0.3,

      borderBottomRightRadius:60
    },
    drawerSection: {
      padding:15,
      borderTopLeftRadius:60,
      
    },
    bottomDrawerSection: {  
        flex:0.2
    },
    title: {
      fontSize: 20,
      marginTop: 5,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 15,
      lineHeight: 20,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom:10,
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });

export default DrawerContents
