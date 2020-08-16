import React,{useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet,Image,Dimensions,FlatList } from 'react-native';
import {AntDesign,Entypo,MaterialIcons,FontAwesome,Feather,EvilIcons,Ionicons} from '@expo/vector-icons'
import axios from 'axios'
const {width,height}=Dimensions.get('screen')
import {Placeholder,PlaceholderMedia,PlaceholderLine,ShineOverlay} from 'rn-placeholder'
import {Caption} from 'react-native-paper'
import ProfileScreenOthers from './ProfileScreenOthers'


const hmx = 80;
const hmn = 70;
const pmx = 80;
const pmn = 40;

const Ph=()=>{
    return (<View style={{...styles.post,width:width/1.2,height:150}}>
      <Placeholder
        Left={PlaceholderMedia}
        Right={PlaceholderMedia}
        Animation={ShineOverlay}>
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={70}/>
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
    </View>)
}
const User=({item})=>{
  const {email,name}=item
  return(
    <TouchableOpacity>
      <View style={{...styles.post,flexDirection:'row',padding:10,alignItems:'center'}}>
        <Image style={{width:80,height:80,borderRadius:40,marginLeft:20}} source={require('../assets/uicon.png')}/>
        <View style={{flexDirection:'column'}}>
          <Text style={{fontWeight:'bold',fontSize:16}}>{name}</Text>
          <Caption>{email} </Caption>
        </View>
      </View>
    </TouchableOpacity>
  )
}
  
const UpvoteScreen = ({route,navigation}) => {
    const {user}=route.params
    const [loading,setLoading]=useState(false)
    const [users,setUsers]=useState([])
    const [uid,setUid]=useState(null)
    const [userModal,setuserModal]=useState(false)
    useEffect(()=>{
      setLoading(true)
      getUsers()
    },[])
    const getUsers=()=>{
      axios.get(`https://pra-blog-app.herokuapp.com/users/upvote/${user._id}`)
        .then(res=>{
          setUsers(res.data)
          setLoading(false)
        })
    }
    return (
      <View style={{flex:1,backgroundColor:'#eee'}}>
        <View  style={{  position: 'absolute',elevation:10,  top: 0,  left: 0,  right: 0,  backgroundColor: 'rgb(250,215,0)',height:hmx }}  >
          <AntDesign name="closecircle" size={24} style={{padding:6}} onPress={()=>{navigation.goBack()}}/>
        </View>
        <View
          style={{  height: pmx,  width: pmx,elevation:11,  borderRadius: pmx/2,  borderColor: 'white',  borderWidth: 3, marginLeft: width/2-pmx/2-6,marginTop:hmx-pmx/2
          }}>
          <Image  source={{uri:user.avatar}}  style={{ backgroundColor:'white',flex: 1, width: null, height: null,borderRadius:pmx/2 }}/>
        </View>
        <View style={{...styles.posts}}>
          {loading&&(<View style={{width:width}}><Ph/><Ph/><Ph/><Ph/><Ph/></View>)}
          <FlatList  data={users}   renderItem={({item})=><User navigation={navigation} changeId={(val)=>{setUid(val);setuserModal(true)}} item={item}/>}
            keyExtractor={item=>item.id.toString()}
            refreshing={loading}
            onRefresh={getUsers}
          />
          </View>

      </View>
    );
};

const styles=StyleSheet.create({
  posts:{
    height:height-120,
    top:-60,
    padding:20,
    marginBottom:100
  },
  post:{
    backgroundColor:'white',
    padding:15,
    margin:10,
    marginTop:50,
    marginBottom:50,
    height:55,
    marginBottom:0,
    borderRadius:40,
    elevation:5
  }
})

export default UpvoteScreen;
