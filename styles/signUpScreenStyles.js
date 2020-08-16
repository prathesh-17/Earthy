import {Dimensions,StyleSheet} from 'react-native'
const {width,height} = Dimensions.get("screen");

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(0,140,250)'
    },
    footer: {
        position:'absolute',
        top:height*0.175,
        height:0.68*height,
        width:width/1.03,
        alignSelf:'center',
        backgroundColor: '#fff',
        elevation:20,
        borderRadius:40,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: '#666',
        padding: 10,
        marginVertical:10
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        bottom:-5,
        fontSize:15,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    modal:{
      backgroundColor:'#eee',
      position:'absolute',
      bottom:0,
      borderTopLeftRadius:30,
      borderTopRightRadius:30,
      width:width,
      elevation:20,
      height:height/3,
      elevation:10
    },
    icon:{
      elevation:5,
      shadowOffset:{width:0,height:4}
    },
    close:{
      backgroundColor:'white',
      color:'black',
      borderRadius:50,
      width:32,
      margin:12,
      padding:6,
      elevation:20,
      alignSelf:'flex-end',
      textAlign:'center'
    },
    submit:{
      alignSelf:'center',
      justifyContent:'center',
      alignItems:'center',
      width:width/2,
      height:50,
      marginVertical:20,
      elevation:20,
      backgroundColor:'rgb(220,20,60)',
      borderRadius:50,
    },
    icons:{
      marginTop:10,
      flex:1,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center'
    },
    social:{
      height:60,
      width:width/2.5,
      backgroundColor:'white',
      elevation:5,
      justifyContent:'flex-end',
      borderRadius:30
    },
    signup:{
      height:55,
      borderRadius:50,
      width:55,
      textAlign:'center',
      alignItems:'center',
      
      flexDirection:'row',
      marginTop:0,
      justifyContent:'center',
      alignSelf:'flex-start',
      backgroundColor:'white',
      elevation:5
    }

  },

);
