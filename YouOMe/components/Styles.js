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
    }
});