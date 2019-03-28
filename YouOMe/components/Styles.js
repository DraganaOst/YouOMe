import React from 'react';
import {StyleSheet} from 'react-native';

const mainColorLightGreen = '#E4FDE1';
const mainColorGreen = '#8acb88';
const mainColorBlue = '#648381';
const mainColorGrey = '#575761';
const mainColorOrange = '#ffbf46';

export const LoginSignUp = StyleSheet.create({
    containerLogin: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    containerButton: {
        backgroundColor: 'black'
    },
    input: {
        margin: 10,
        marginHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: mainColorGreen,
        paddingHorizontal: 20,
        borderRadius: 5,
        fontSize: 20
    },
    button: {
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 5,
        alignItems: 'stretch',
        backgroundColor: mainColorGreen
    },
    buttonText: {
        padding: 10,
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    buttonInverse: {
        margin: 10,
        marginLeft: 20,
        marginRight: 20,
        borderColor: mainColorGreen,
        borderWidth: 1,
        borderRadius: 5,
        alignItems: 'stretch',
        backgroundColor: 'white'
    },
    buttonTextInverse: {
        padding: 10,
        fontSize: 20,
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
    }
});

export const Profile = StyleSheet.create({
    header: {
       backgroundColor: mainColorGreen
    },
    headerText:{
        color: 'white',
        fontSize: 30,
        marginHorizontal: 25
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    subContainer: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: 20,
        //marginHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white'
    },
    text: {
        fontSize: 35,
        marginLeft: 15,
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
        borderColor: '#8acb88'
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
        marginRight: 10
    }
});

export const AddUserScreen = StyleSheet.create({
    search: {
        height: 40,
        borderRadius: 20,
        margin: 10,
        backgroundColor: '#d9d9d9',
        paddingLeft: 30,
        paddingRight: 30
    }
});