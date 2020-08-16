import React,{useEffect,useState,useContext} from 'react';
import { View, Button, StyleSheet,Dimensions,FlatList,Image,ScrollView,Modal,TextInput,TouchableOpacity,Alert,StatusBar } from 'react-native';
import {Avatar,Title,Caption,Paragraph,Drawer,Text,TouchableRipple,Switch} from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {AntDesign,Entypo,MaterialIcons,FontAwesome,Feather,EvilIcons,Ionicons,MaterialCommunityIcons} from '@expo/vector-icons'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import calendar from 'dayjs/plugin/calendar'
const {width,height}=Dimensions.get('window')
import {Placeholder,PlaceholderMedia,PlaceholderLine,ShineOverlay} from 'rn-placeholder'
import AuthContext from '../context'
import TokenContext from '../tokenCntxt'
import {receiveData} from '../Auth/asyncStorage'
import Spinner from 'react-native-loading-spinner-overlay';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated'
import { onScrollEvent } from 'react-native-redash'
import { TouchableWithoutFeedback, TouchableHighlight,TouchableOpacity as TO } from 'react-native-gesture-handler';
import ThemeContext from '../themeCntxt';
import Loader from '../Loader'
import ImageViewer from '../components/imageViewer'
import MultImgView from '../components/MultImgView'
import ImageView from './ImageView'
import urlRegex from 'url-regex'
let TokId;
const hmx = 110;
const hmn = 70;
const pmx = 80;
const pmn = 40;
const iurl=require('../assets/uicon.png')

const MIN_HEIGHT = 60 
const MAX_HEIGHT = height/2.9

const { Value,interpolate,Extrapolate } = Animated


const Comment=({item,redComment,closeBlog,owner,disModal,TokId})=>{
  const {themeState} = useContext(ThemeContext)

  const navigation=useNavigation()
  const {_id,userid,name,avatar,body,commentedBy}=item;

  const [userModal,setuserModal]=useState(false)

  const deleteComment=()=>{
    axios.post(`https://pra-blog-app.herokuapp.com/comment/remove/${_id}`,{token:TokId.Token})
      .then(res=>{
        Alert.alert('Comment Deleted')
        redComment(item)
      })
  }
  return (
    (TokId?
    <View style={{marginTop:6,padding:20}}>
    {TokId.Id===commentedBy?<MaterialIcons style={{position:'absolute',top:20,right:width/5}}name="delete" color="red" size={24} onPress={()=>deleteComment()}/>:null}
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity onPress={()=>{closeBlog();if(commentedBy==TokId.Id){navigation.navigate('Profile')}
          else if(owner==commentedBy){}
          else{disModal(commentedBy)}}}>
          <Avatar.Image source={{uri:avatar}} size={40}/>
        </TouchableOpacity>
        <Text style={{paddingLeft:7,fontSize:15,fontWeight:'bold',color:themeState.txt}}>{name}</Text>
      </View>
      <Text style={{paddingLeft:47,color:themeState.txt,fontSize:11}}>{body}</Text>
      <Modal visible={userModal}><ProfileScreenOthers changeUser={()=>{setuserModal(false)}} id={commentedBy}/></Modal>
    </View>
     :null)
  )
}

const Ph=()=>{
    return (<View style={{...styles.post,height:150}}>
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

const Post=({item,imgurl,imgv,imgs})=>{
  const {themeState} = useContext(ThemeContext)
  const {avatar,name,title,body,owner,createdAt,id,isLiked,images}=item;
  console.log(images)
  const [like,setLike]=useState(isLiked);
  const [commentModal,setCommentModal]=useState(false)
  const [blog,setBlog]=useState(false)
  const [likes,setLikes]=useState(0)
  const [ploading,setPloading]=useState(false)
  const [comment,setComment]=useState('')
  const [comments,setComments]=useState([])
  const [userModal,setUserModal]=useState(false)
  const [uid,setUid]=useState(null)
  const arr = images
  
  const deletePost=()=>{
    return (
      Alert.alert("Delete Post","Are You Sure?",
        [{text:"Cancel",onPress:()=>{console.log("Cancel")},style:{color:'red'}},
          {text:"Ok",onPress:()=>{console.log("Cancel")}}]
      )
    )
  }
  const redComment=(val)=>{
    setComments(comments.filter((item)=>{return item._id!=val._id}))
  }
  const indPost=(id)=>{
    setPloading(true)
    console.log(id)
    axios.get(`https://pra-blog-app.herokuapp.com/blogs/find/${id}`)
      .then((res)=>{
        console.log(id)
        console.log(res.data)
        setPloading(false)
        setComments(res.data.comments)
        setBlog(true)
        setLikes(res.data.likes)
        console.log(res.data.likes)
      })
      .catch(err=>{
        console.log(err)
      })
  }

  const hitLike=(id)=>{
    if(!like){
      axios.post(`https://pra-blog-app.herokuapp.com/like/${id}`,{token:TokId.Token})
        .then(()=>{
          setLike(!like)
          setLikes(likes+1)
        })
        .catch((err)=>{
          console.log(err);
        })
    }
    else{
      axios.post(`https://pra-blog-app.herokuapp.com/like/remove/${id}`,{token:TokId.Token})
        .then(()=>{
          setLike(!like)
          setLikes(likes-1)
        })
        .catch((err)=>{
          console.log(err);
        })
    }

  }
  const sendComment=()=>{
    console.log('comment run')
    setPloading(true)
    if(comment.trim()!=''){
      axios.post(`https://pra-blog-app.herokuapp.com/comment/${id}`,{
        comment:comment,
        token:TokId.Token
      })
      .then((res)=>{
        setComments([...comments,{_id:res.data._id,body:body,avatar:avatar,name:name}])
        Alert.alert('Comment Posted Successfully')
        indPost(id)
        setComment('')
        setPloading(false)
        setCommentModal(false)
        console.log(comments)
      })
    }
  }
  return (
    <View style={{...styles.post,backgroundColor:themeState.pst}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity onPress = {()=>{imgv(avatar)}}>
        <Avatar.Image source={{uri:avatar}} />
        </TouchableOpacity>
        <View style={{flexDirection:'column',paddingLeft:5}}>
          <Text style={{fontWeight:'bold',fontSize:18,color:themeState.txt}}>{name}</Text>
          <Caption style={{color:'#ccc'}}>{dayjs(createdAt).fromNow()}</Caption>
        </View>

      </View>
      
      <TouchableOpacity onPress={()=>{indPost(id)}}>
        <View style={{borderBottomWidth:0.5,borderBottomColor:'#777',marginVertical:15}}/>
          <Text style={{fontSize:18,fontWeight:'bold',color:themeState.txt}}>{title}</Text>
          <Text style = {{color:themeState.txt,fontSize:12,paddingTop:5}} selectable>{body}</Text>

          <ImageView images = {arr} scr = 'po' imgs = {(val)=>{imgs(arr,val)}} len = {arr.length} themeState = {themeState} wd = {1.15} />

        <View style={{borderBottomWidth:0.5,borderBottomColor:'#777',marginVertical:15}}/>
        <View style={{flexDirection:"row",justifyContent:'space-between'}}>
          <AntDesign name={like?'heart':'hearto'} size={20} color={like?'red':'#555'} onPress={()=>{hitLike(id)}}/>
          <EvilIcons name="comment" color='#555' size={28}  onPress={()=>setCommentModal(true)}/>
        </View>
      </TouchableOpacity>
      <Modal visible={commentModal} animationType="slide">
        <View  style={{ flexDirection:'row',alignItems:'center', position: 'absolute',
          top: 0,  left: 0,  right: 0,  backgroundColor: themeState.pri,height:60 }}  >
          <Ionicons name="ios-arrow-back" color={themeState.sec} size={24} style={{padding:16}} onPress={()=>{setCommentModal(false)}}/>
          <Text style={{fontWeight:'bold',fontSize:18,color:themeState.sec}}>Comment</Text>
        </View>
        <View style={{backgroundColor:themeState.dr,marginTop:60,paddingTop:20,width:width,height:height-60}}>  
          <View style={{flexDirection:'row',paddingLeft:5}}>
            <Avatar.Image size={40} source={{uri:imgurl}}/>
            <TextInput multiline placeholder="Comments..." style={{paddingLeft:8,width:width/1.2,color:themeState.txt}}
             value={comment} onChangeText={(e) => setComment(e)}/>
          </View>
        </View>
        <View style={{position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'rgb(255,215,0)',
          bottom:20,right:20,width:50,height:50,borderRadius:25,elevation:10,alignSelf:'flex-end'}}>
          <Ionicons name="md-send" size={34} color="black" style={{paddingLeft:7}} onPress={()=>{
              if(comment.trim()!=''){setPloading(true);
              setTimeout(() => {
                sendComment()  
              }, 1000);
              }}}/>
        </View>
      </Modal>

      <Modal visible={blog} animationType = 'slide'>
        <View  style={{ flexDirection:'row',alignItems:'center', position: 'absolute',  top: 0,  left: 0,  right: 0,  backgroundColor: 'rgb(250,215,0)',height:60 }}  >
          <Ionicons name="ios-arrow-back" size={24} style={{padding:16}} onPress={()=>{setBlog(false)}}/>
          <Text style={{fontWeight:'bold',fontSize:23}}>Blog</Text>
        </View>
        <ScrollView style ={{flex:1,marginTop:60,backgroundColor:themeState.dr}}>

        <View style={{flexDirection:'row',marginTop:20,paddingLeft:5,alignSelf:'flex-start'}}>
        <TouchableOpacity >
          <Avatar.Image size={60} source={{uri:avatar}}/></TouchableOpacity>
          <View style={{flexDirection:'column',paddingLeft:13}}>
            <Text style={{ fontWeight: 'bold', fontSize: 26,color:themeState.txt }}>{name}</Text>
            <Caption style={{color:themeState.txt,opacity:0.8}}>{dayjs(createdAt).format('YYYY , D MMM ')}</Caption>
          </View>
        </View>
        <View style={{padding:20}}>
          <Text style={{fontSize:22,color:themeState.txt,paddingVertical:8,fontWeight:'bold'}}>{title}</Text>
          <Text style={{color:themeState.txt,fontSize:13}} selectable>{body}</Text>

          <ImageView images = {arr} imgs = {(val)=>{imgs(arr,val)}} len = {arr.length} themeState = {themeState} wd = {1.11} />

          <View style={{flexDirection:'row',paddingTop:15}}>
            <Paragraph style={{fontWeight:"bold",color:themeState.txt}}>{likes}</Paragraph>
              <Caption style={{color:themeState.txt,opacity:0.8}}> Likes</Caption>
            <Paragraph style={{fontWeight:"bold",paddingLeft:8,color:themeState.txt}}>{comments.length}</Paragraph>
              <Caption style={{color:themeState.txt,opacity:0.8}}> Comments</Caption>
          </View>
        </View>
        <View style={{borderBottomWidth:0.5,borderBottomColor:themeState.bg,marginVertical:15}}/>
        <View style={{flexDirection:"row",padding:20,paddingVertical:0,justifyContent:'space-between'}}>
          <AntDesign name={like?'heart':'hearto'} size={20} color={like?'red':'#555'} onPress={()=>{hitLike(id,2)}}/>
          <EvilIcons name="comment" size={28} color="#555" onPress={()=>setCommentModal(true)}/>
        </View>
        <View style={{borderBottomWidth:0.5,borderBottomColor:themeState.bg,marginVertical:15}}/>
        {comments.map(item=><Comment key={Math.random().toString()} item={item} TokId={TokId}
          redComment={(val)=>{redComment(val)}}
          disModal={(val)=>{setUserModal(true); setUid(val)}}  owner={owner} closeBlog={()=>{setBlog(false)}}/>)}
            
        
        </ScrollView>
      </Modal>
      <Modal visible={userModal}><ProfileScreenOthers  changeUser={()=>{setUserModal(false)}} id={uid}/></Modal>
      
      <Spinner visible={ploading} animation="fade" overlayColor="rgba(0,0,0,0.1)" color="black" />
              
    </View>

  )
}


const ProfileScreenOthers = ({id,changeUser}) => {
    const scry = new Value(0);
    const [em,setEm] = useState('')
    const { themeState } = useContext(ThemeContext)
    dayjs.extend(relativeTime)
    dayjs.extend(calendar)
    const [cr,setCr]=useState('')
    const [posts,setPosts]=useState([])
    const [loading,setLoading]=useState(true)
    const [image,setImage]=useState(null)
    const [name,setName]=useState('')
    const [upvoted,setUpvoted]=useState(false)
    const [ava,setAva]=useState(null)
    useEffect(()=>{
        if(id){
          getData()
          return()=>{
            setLoading(true)
          }
        }
    },[])
    const [user,setUser]=useState({})
    useEffect(()=>{
      getUser()
    },[])
    const getUser=async()=>{
      TokId=await receiveData();
      if(id){
          console.log(TokId.Token)
          console.log(id)
          axios.get(`https://pra-blog-app.herokuapp.com/users/${id}`,{
            headers:{
              authorization:`Bearer ${TokId.Token}`
            }
          })
          .then((res)=>{
            setUpvoted(res.data.isUpvoted)
            
            setImage(res.data.newUser.avatar)
            setName(res.data.newUser.name)
            setEm(res.data.newUser.email)
            setCr(res.data.newUser.createdAt)
            axios.get('https://pra-blog-app.herokuapp.com/users/me',{
              headers:{
                authorization:`Bearer ${TokId.Token}`
              }
            }).then(res=>setAva(res.data.user.avatar))
          })
      }
    }
    const getData=async()=>{
      TokId=await receiveData();
      if(id ){
        setLoading(true)
        axios.get(`https://pra-blog-app.herokuapp.com/blogs/users/${id}`,{
          headers:{
            authorization:`Bearer ${TokId.Token}`
          }
        })
        .then((res)=>{
          setPosts(res.data)
          if(res.data.length!=0){
            // console.log(res.data)
            setImage(res.data[0].avatar)
            setName(res.data[0].name)
          }
          setLoading(false)
        })
      }
    }
    const noPost=()=>{
      if(!loading&&posts.length==0){
        return true}
      else return false

    }
    const upVote=async()=>{
      if(!upvoted){
      axios.post(`https://pra-blog-app.herokuapp.com/users/upvote`,{
        id:id,
        token:TokId.Token
      }).then(()=>{
        Alert.alert('upvote successful')
       
      })
    }
      else{
      axios.post(`https://pra-blog-app.herokuapp.com/users/delete/upvote`,{
        id:id,
        token:TokId.Token
      }).then(()=>{
        Alert.alert('upvote successful')
       
      })
    }
    setUpvoted(!upvoted)
    }
    const translatey = interpolate(scry,{
      inputRange: [0,MAX_HEIGHT-MIN_HEIGHT],
      outputRange: [0,-(MAX_HEIGHT-MIN_HEIGHT)],
      extrapolate: 'clamp',
    })
    const ht = interpolate(scry,{
      inputRange: [0,MAX_HEIGHT-MIN_HEIGHT],
      outputRange: [MAX_HEIGHT,MIN_HEIGHT],
      extrapolate: 'clamp',
    })
    const op1 = interpolate(scry,{
      inputRange: [0,4],
      outputRange: [1,0],
      extrapolate: 'clamp',
    })
    const imgl = interpolate(scry,{
      inputRange: [0,MAX_HEIGHT-MIN_HEIGHT],
      outputRange: [20,width-65],
      extrapolate: 'clamp',
    })
    const ht1 = interpolate(scry,{
      inputRange: [MAX_HEIGHT-hmx,MAX_HEIGHT-MIN_HEIGHT],
      outputRange:[hmx,MIN_HEIGHT],
      extrapolate: 'clamp',
    })
    const op2 = interpolate(scry,{
      inputRange: [MAX_HEIGHT-hmx,MAX_HEIGHT-MIN_HEIGHT],
      outputRange:[pmx,45],
      extrapolate: 'clamp',
    })
    const mtop = interpolate(scry,{
      inputRange: [MAX_HEIGHT-hmx,MAX_HEIGHT-MIN_HEIGHT],
      outputRange:[hmx-pmx/2,6],
      extrapolate: 'clamp',
    })
    const tp = interpolate(scry,{
      inputRange: [40,MAX_HEIGHT-hmx],
      outputRange:[0,-100],
      extrapolate: 'clamp',
    })
    const tp1 = interpolate(scry,{
      inputRange: [0,MAX_HEIGHT-MIN_HEIGHT],
      outputRange:[200,10],
      extrapolate: 'clamp',
    })
    const wd = interpolate(scry,{
      inputRange: [MAX_HEIGHT-MIN_HEIGHT+11,MAX_HEIGHT-MIN_HEIGHT+21],
      outputRange:[0,1],
      extrapolate: 'clamp',
    })
    const op4 = interpolate(scry,{
      inputRange: [MAX_HEIGHT-hmx-100,MAX_HEIGHT-hmx-60],
      outputRange:[1,0],
      extrapolate: 'clamp',
    })
    const op3 = interpolate(scry,{
      inputRange: [MAX_HEIGHT-hmx-60,MAX_HEIGHT-MIN_HEIGHT],
      outputRange:[0,1],
      extrapolate: 'clamp',
    })
    const titleCase = (str)=>{
      return str.replace(/\w\S*/g,(txt)=>{return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()})
    }
    const [vo,setVo] = useState(false)
    const [imgv,setImgv] = useState(false)
    const [imgu,setImgu] = useState('')
    const [imgar,setImgar] = useState(false)
    const [imgs,setImgs] = useState([])
    const [cur,setCur] = useState(0)
    // console.log("imgu"+imgu+' imgv ' + imgv )
    if( imgv && imgu ){
      // console.log('image viewer')
      
      return ( 
      <View style ={styles.container}>
        <ImageViewer uri={imgu} im = {()=>{setImgu('');setImgv(false)}}/>
      </View>
      )
    }
    if(imgar & imgs.length != 0){
      // console.log(imgs,cur,imgar)
      return <MultImgView scr = 'po' images = {imgs} cur = {cur} im = {()=>{setImgs([]);setImgar(false);setCur(0) }} />
    }
    return (
      (id  ?
      <Animated.View style={styles.container}>
        <Animated.View style={{position:'absolute',top:0,left:0,right:0,elevation:3,
            height:ht,backgroundColor:'white',backgroundColor:(themeState.txt=='#000'?'white':'#222')}}>
            <Animated.View  style={{ elevation:11, position: 'absolute',  top: 0,  left: 0,  right: 0, backgroundColor: themeState.pri,
              height:ht1 }}  >
                <Animated.Text style={{ paddingLeft:60,paddingTop:15,fontWeight: 'bold', fontSize: 22, color:themeState.txt,opacity:op3  }}>
                  {titleCase(name)}
                </Animated.Text>  
            </Animated.View>
            <Animated.View
              style={{  height: op2,  width: op2,  borderRadius: op2,elevation:11,  borderColor: themeState.sec,  borderWidth: 3, marginLeft:imgl,
                marginTop:mtop}}>
                <Image  source={{uri:image}}  style={{ backgroundColor:'white',flex: 1, width: null, height: null,borderRadius:pmx/2 }}/>
            </Animated.View>
              <Animated.View style={{paddingLeft:20,paddingTop:10,top:tp}}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color:themeState.txt  }}>
                  {titleCase(name)}
                  {/* Graphic Designer Lp */}
                </Text>
                <Caption style = {{color:themeState.txt,opacity:0.8}}>{em}</Caption>
              </Animated.View>

              <Animated.View style={{flexDirection:'row',paddingLeft:18,alignItems:'center',opacity:op1,paddingVertical:10}}>
                <AntDesign name="calendar" size={20} color={themeState.txt} style={{padding:12 }}/>
                <Caption style = {{color:themeState.txt,opacity:0.8}}>Joined on {dayjs(cr).format('YYYY , D MMM ')}</Caption>
              </Animated.View>
          </Animated.View>

          <Animated.ScrollView 
            style = {{flex:1}}
            onScroll = {(e)=>{scry.setValue(e.nativeEvent.contentOffset.y);
              
            }}
            showsVerticalScrollIndicator = {false}
            scrollEventThrottle = {16}
            // refreshControl = {<RefreshControl refreshing={loading} onRefresh={getData}/>}
          >
            <View style={{backgroundColor:'#ddd',height:MAX_HEIGHT,elevation:0,paddingVertical:0,marginVertical:6}}></View>
            
            {
              posts.map((item,ind)=>{return <Post key = {item.id.toString()} item={item}  
                imgv = {(val)=>{setImgu(val);setImgv(imgv => true);}} 
                imgs = {(val,val1) => {setImgar(true);setImgs(val); setCur(val1);}}
                imgurl={ava} deleteFromPosts={(id)=>deleteFromPosts(id)}/>})
            }
          </Animated.ScrollView>
            
          
        
          {noPost()?(<View style={{position:'absolute',left:width/4,margin:20}}>
                        <Text style={{fontSize:16,color:'#999'}}>No Posts Available</Text>
                     </View>):null}
          
         <Animated.View style = {{top:tp1,right:20,elevation:6,position:'absolute',width:40,height:40,flexDirection:'row',alignItems:'center',
            opacity:op4,overflow:'hidden',
            borderRadius:40,backgroundColor:(upvoted?'rgb(0,150,0)':'#000'),justifyContent:'center',alignItems:'center'}}>
            <MaterialCommunityIcons  name="arrow-up-circle-outline" 
              size={30} color='white' onPress={()=>{upVote();console.log('pressed')}}/>
          </Animated.View>
            {upvoted?<Animated.View style ={{position:'absolute',backgroundColor:(upvoted?'rgb(0,150,0)':'#000'),padding:8,alignItems:'center',
              justifyContent:'center',width:110,borderRadius:20,opacity:wd,elevation:11,
              height:40,padding:10,bottom:height/2-20,right:-18}} >
                <Text style={{fontSize:16,fontWeight:'bold',color:'white'}}>UPVOTED</Text>
              </Animated.View>:null}
            <View style={{ position:'absolute',left:10,top:12,flexDirection:'row',height:35,width:35,
            backgroundColor:'black',borderRadius:30,alignItems:'center',justifyContent:'center',
                          elevation:11 }}>
              <AntDesign name="closecircle" color='rgb(255,215,0)' onPress={()=>{changeUser()}} size={24}  />
            </View>
            <Animated.View
                style={{  height: op2,  width: op2,  borderRadius: op2,elevation:11,  borderColor: themeState.sec,  borderWidth: 4, marginLeft:imgl,
                marginTop:mtop,position:'absolute',opacity:0}}>
                <AntDesign name = 'closecircle' size={pmx} 
                  onPress = {()=>{console.log('pressed');setImgv(true);setImgu(image);}} />
            </Animated.View>
            {/* <Spinner visible={loading} animation="fade" overlayColor="rgba(0,0,0,0)" color="black" /> */}
            {loading?<View style={{height:height/1.5}}><Loader col="#ddd" wid = {10}/></View>:null}
            
            

            
        </Animated.View>:null)


    );
};

export default ProfileScreenOthers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#ddd'
  },
  posts:{
    backgroundColor:'#eee',
  },
  post:{
    backgroundColor:'white',
    padding:15,
    margin:6,
    marginBottom:6,
    marginTop:0,
    borderRadius:20,
    elevation:5
  }
});
