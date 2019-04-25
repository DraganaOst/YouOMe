import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class Loading extends React.Component{
    componentDidMount(){
        //if user logs in/out - it fires
        Firebase.auth.onAuthStateChanged((user) => {
            if (user) {
                Firebase.defaultLogin(this.props.navigation);
            } else {
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Login'} )
                    ],
                }))
            }
          });
    }

    render() {
        return (
            <View style={styles.Loading.container}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }
}