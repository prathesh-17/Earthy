import React,{useState,useEffect} from 'react';
import { View, Text, Button, StyleSheet,Image,Dimensions,FlatList,TouchableOpacity,Modal } from 'react-native';
import {AntDesign,Entypo,MaterialIcons,FontAwesome,Feather,EvilIcons,Ionicons} from '@expo/vector-icons'
import axios from 'axios'
const {width,height}=Dimensions.get('screen')
import {Placeholder,PlaceholderMedia,PlaceholderLine,ShineOverlay} from 'rn-placeholder'
import {Caption} from 'react-native-paper'
import ProfileScreenOthers from './ProfileScreenOthers'
import ThemeContext from '../themeCntxt';


const hmx = 80;
const hmn = 70;
const pmx = 80;
const pmn = 40;


const User=({item,changeId,themeState})=>{
  const {user}=item
  const {name,email,avatar,_id}=user
  return(
    <TouchableOpacity onPress={()=>{changeId(_id)}}>
      <View style={{...styles.post,flexDirection:'row',padding:10,alignItems:'center',backgroundColor:themeState.pst}}>
        <View style = {{marginLeft:-10,borderBottomLeftRadius:40,borderTopLeftRadius:40,width:50,height:55,backgroundColor:'rgb(220,20,60)'}}></View>
        <View
          style={{height: 80,  width: 80,elevation:11,  borderRadius: 40,  borderColor: 'rgb(0,0,0)',  borderWidth: 3.5, 
                    marginLeft:-10}}>
          <Image  source={{uri:avatar}}  style={{ backgroundColor:'white',flex: 1, width: null, height: null,borderRadius:40 }}/>
        </View>
        <View style={{left:14,flexDirection:'column'}}>
          <Text style={{fontWeight:'bold',fontSize:16,color:themeState.txt}}>{name}</Text>
          <Caption style={{color:themeState.txt,opacity:0.7}} >{email} </Caption>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const UpvoteScreen = ({route,navigation}) => {
    const {themeState} = React.useContext(ThemeContext)
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
          // console.log(res.data)
          setLoading(false)
        })
    }
    return (
      <View style={{flex:1,backgroundColor:'#eee'}}>
        <View  style={{  position: 'absolute',elevation:10,  top: 0,  left: 0,  right: 0,  backgroundColor: themeState.pri,height:hmx }}  >
          <AntDesign name="closecircle" size={24} style={{padding:6}} color={themeState.sec} onPress={()=>{navigation.goBack()}}/>
        </View>
        <View
          style={{  height: pmx,  width: pmx,elevation:11,  borderRadius: pmx/2,  borderColor: 'white',  borderWidth: 3, marginLeft: width/2-pmx/2-6,marginTop:hmx-pmx/2
          }}>
          <Image  source={{uri:user.avatar}}  style={{ backgroundColor:themeState.txt,flex: 1, width: null, height: null,borderRadius:pmx/2 }}/>
        </View>
        <View style={{...styles.posts,backgroundColor:(themeState.pri == '#000'?'#444':'#eee' )}}>
          {/* {loading&&(<View style={{width:width}}><Ph/><Ph/><Ph/><Ph/><Ph/></View>)} */}

          <FlatList  data={users}   renderItem={({item})=><User navigation={navigation}
            changeId={(val)=>{setUid(val);setuserModal(true)}} item={item} themeState = {themeState}/>}
            keyExtractor={item=>item.user._id.toString()}
            refreshing={loading}
            onRefresh={getUsers}
          />
          {!loading & users.length==0?(<View style={{position:'absolute',left:width/4,margin:20}}>
                        <Text style={{fontSize:16,color:'#999'}}>No Upvotes</Text>
                     </View>):null}
          </View>
          <Modal visible={userModal}><ProfileScreenOthers  changeUser={()=>{setuserModal(false)}} id={uid}/></Modal>
      </View>
    );
};

const styles=StyleSheet.create({
  posts:{
    height:height-120,
    top:-100,
    paddingTop:60,
    height:height/1.1,
    padding:20,
    marginBottom:100
  },
  post:{
    backgroundColor:'white',
    padding:15,
    margin:10,
    marginTop:35,
    marginBottom:10,
    height:55,
    marginBottom:25,
    borderRadius:40,
    elevation:5
  }
})

export default UpvoteScreen;
