import React from 'react';
import {StyleSheet} from 'react-native';


//export const mainColorLightGreen = '#E4FDE1';
export let mainColorGreen = "rgb(138,203,136)" //'#8acb88';
export let mainColorBlue = "rgb(100,131,129)" //'#648381';
export let mainColorGrey = "rgb(87,87,97)" //'#575761';
export let mainColorOrange = "rgb(255,191,70)" //'#ffbf46';
export let mainColorLightGrey = "rgb(229,229,229)" //"#E5E5E5";
export let mainColorGreen2 = "rgb(156,211,154)" // "#9CD39A";
export let mainColorLightBlue = "rgb(112,146,144)" //'#709290';
export let mainColorLightGrey2 = "rgb(102,102,113)" //"#666671";
export let mainColorLightOrange = "rgb(255,202,102)" //"#ffca66";

const fontSize = 18;
const margin = 20;

export const Global2 = StyleSheet.create({
    text: {
        fontSize: fontSize
    }
});


const Global = StyleSheet.create({
    center: {
        alignItems: 'center', 
        justifyContent: 'center'
    }
});

export const Navigation = StyleSheet.create({
    header: {
        backgroundColor: mainColorGreen
    },
    headerText:{
        color: 'white',
        fontSize: 25,
        marginHorizontal: 20
    }
});

export const Loading = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: mainColorGreen,  
        alignItems: 'center', 
        justifyContent: 'center'
    }
});

export const LoginSignUp = StyleSheet.create({
    containerLogin: {
        flex: 0.8,
        justifyContent: 'center',
    },
    input: {
        margin: 10,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: mainColorGreen,
        paddingHorizontal: 20,
        borderRadius: 5,
        fontSize: 18
    },
    button: {
        margin: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        alignItems: 'stretch',
        backgroundColor: mainColorGreen
    },
    buttonText: {
        padding: 10,
        fontSize: 18,
        color: 'white',
        textAlign: 'center'
    },
    buttonInverse: {
        margin: 10,
        marginHorizontal: 20,
        borderRadius: 5,
        alignItems: 'stretch',
        borderColor: mainColorGreen,
        borderWidth: 1,
        backgroundColor: 'white'
    },
    buttonTextInverse: {
        padding: 10,
        fontSize: 18,
        textAlign: 'center',
        color: mainColorGreen,
    },
    containerImage: {
        flex: 0.7,
        marginHorizontal: 50,
        justifyContent: 'flex-end'
    },
    image: {
        flex: 0.7,
        height: undefined,
        width: undefined
    },
    containerKeepLoggedIn: {
        flexDirection: 'row', 
        marginHorizontal: 20, 
        justifyContent: 'flex-end'
    },
    buttonKeepLoggedIn: {
        flexDirection: 'row'
    },
    checkboxOutBox: {
        marginHorizontal: 10, 
        height: 20, 
        width: 20, 
        backgroundColor: mainColorLightGrey, 
        ...Global.center
    },
    checkboxInBox: {
        height: 15, 
        width: 15, 
    }
});

export const Profile = StyleSheet.create({
    container: {
        flex: 1, 
        ...Global.center
    },
    containerHeader: {
        flexDirection: 'row',
        ...Global.center,
    },
    containerNotification: {
        backgroundColor: mainColorGreen2
    },
    buttonNotification: {
        paddingVertical: 25,
        marginBottom: 0, 
        elevation: 10, 
        paddingHorizontal: 20, 
        backgroundColor: mainColorGreen2
    },
    containerNotificationNumber: {
        position: 'absolute',
        right: -5, 
        top: -5
    },
    textNotificationNumber: {
        backgroundColor: 'red', 
        borderRadius: 6, 
        textAlign: 'center',
        minWidth: 12, 
        height: 12, 
        color: 'white', 
        fontSize: 9
    },
    buttonNoNotification: {
        paddingVertical: 25, 
        marginBottom: 0, 
        paddingHorizontal: 20, 
    },
    buttonMoreMenu: {
        padding: 20, 
    },
    containerButtons: {
        flexDirection: 'row', 
        alignItems: 'stretch', 
        flex: 1
    },
    button: {
        elevation: 10, 
        flex: 1, 
        marginHorizontal: 10
    },
    text: {
        color: 'white', 
        fontSize: 30, 
        fontWeight: 'bold'
    },
    textBalance: {
        color: 'white', 
        fontSize: 15, 
        margin: -5
    },
    textMoneyValue: {
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold'
    }
    

});

/*
export const Profile = StyleSheet.create({
    header: {
       backgroundColor: mainColorGreen
    },
    headerText:{
        color: 'white',
        fontSize: 25,
        marginHorizontal: 20
    },
    container: {
        flex: 1,
        backgroundColor: mainColorLightGrey
    },
    subContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 20,
        //marginHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        justifyContent: 'center'
    },
    text: {
        fontSize: 28,
        marginLeft: 10,
        color: mainColorGrey,
        fontWeight: 'bold'
        //borderBottomWidth: 2,
        //borderBottomColor: mainColorGreen
    },
    containerHeader: {
        flexDirection: 'row',
        marginHorizontal: 10,
        justifyContent: 'space-between',
        borderBottomWidth: 2,
        borderColor: mainColorGreen
    },
    containerText: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    containerButton: {
        flexDirection: 'row',
        marginRight: 5
    },
    subText: {
        fontSize: fontSize, 
        fontWeight: 'bold'
    }
});*/

export const AddUserScreen = StyleSheet.create({
    search: {
        height: 40,
        borderRadius: 20,
        margin: 10,
        backgroundColor: mainColorLightGrey,
        paddingLeft: 30,
        paddingRight: 30
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
        backgroundColor: mainColorLightGrey2
    },
    text: {
        fontSize: 20, 
        color: 'white', 
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        flex: 1
    },
});

export const Users = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        flex: 1
    },
    user: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        alignItems: 'center',
        backgroundColor: mainColorLightGrey2
    },
    text: {
        fontSize: 20, 
        color: 'white', 
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontWeight: 'bold'
    }
});



export const AddMoneyItem = StyleSheet.create({
    containerViewRow: {
        flexDirection: 'row', 
        marginHorizontal: 20, 
        alignItems: 'center',
        //borderBottomWidth: 1
    },
    containerButton: {
        flexDirection: 'row',
        alignItems: 'stretch',
        //borderBottomWidth: 5,
        //borderBottomColor: mainColorOrange,
        backgroundColor: 'white'
        //marginHorizontal: 10
    },
    button: {
        //margin: 10,
        //borderRadius: 5,
        alignItems: 'stretch',
        backgroundColor: mainColorOrange,
    },
    button2: {
        marginHorizontal: 15,
        elevation: 10,
        //borderRadius: 5,
        alignItems: 'stretch',
        backgroundColor: mainColorLightGrey2,
    },
    textFont: {
        fontSize: fontSize,
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        height: 40, 
        flex: 1,
    },
    buttonText: {
        fontSize: fontSize,
        padding: 10,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    inputMoney: {
        fontSize: fontSize,
        flex: 1, 
        textAlign: 'right', 
        paddingHorizontal: 10, 
        marginHorizontal: 10,
        height: 45
    },
    inputReason: {
        fontSize: fontSize,
        flex: 1,  
        paddingHorizontal: 10, 
        marginHorizontal: 10,
        height: 45
    },
    dateText: {
        fontSize: fontSize,
        flex: 1, 
        paddingVertical: 10, 
        //marginHorizontal: 10, 
        //textAlign: 'right'
    }
});

export const Money = StyleSheet.create({
    button: {
        backgroundColor: mainColorGrey, 
        marginBottom: 10
    },
    container: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flex: 1
    },
    textUser: {
        color: 'white', 
        fontSize: 18, 
        marginHorizontal: 20, 
        marginVertical: 5, 
        flex: 2
    },
    containerBalance: {
        backgroundColor: mainColorBlue, 
        paddingHorizontal: 20, 
        paddingVertical: 5, 
        flex: 1,
        alignItems: 'center'
    },
    balanceText: {
        color: 'white', 
        fontSize: 18
    },
    balance: {
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold'
    }
    
});

export const Items = StyleSheet.create({
    containerBalance: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: mainColorBlue, 
        paddingHorizontal: 20, 
        paddingVertical: 5, 
        flex: 1
    }
});

export const History = StyleSheet.create({
    container: {
        backgroundColor: mainColorLightGrey, 
        flex: 1
    },
    containerBar: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        //borderBottomWidth: 2, 
        paddingHorizontal: 20, 
        paddingTop: 10, 
        marginBottom: 10,
        backgroundColor: mainColorLightGrey2
    },
    textBar: {
        fontSize: 20, 
        fontWeight: 'bold',
        color: 'white'
    },
    containerTransaction: {
        flexDirection: 'row', 
        alignItems: 'center'
    },
    textYear: {
        color: 'white', 
        fontSize: 10
    },
    textDay: {
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold'
    },
    textMonth: {
        color: 'white', 
        fontSize: 15
    },
    containerReason: {
        flex: 5, 
        marginHorizontal: 20
    },
    textReason: {
        color: 'white', 
        fontSize: 18
    },
    containerMoney: {
        flex: 4, 
        alignItems: 'flex-end', 
        paddingRight: 10, 
        backgroundColor: mainColorOrange,
        justifyContent: 'center'
    },
    containerMoney2: {
        flex: 4,  
        paddingLeft: 10, 
        backgroundColor: mainColorGreen,
        justifyContent: 'center'
    },
    textMoney: {
        color: 'white', 
        fontSize: 20, 
        fontWeight: 'bold',
    }
});

export const Shadow = StyleSheet.create({
    shadowBox: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    
        elevation: 4,
    }
});