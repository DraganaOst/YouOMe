import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";

export default class Loading extends React.Component{
    constructor(){
        super();
    }

    componentDidMount(){
        Firebase.auth.onAuthStateChanged(async (user) => {
            if (user) {
                let response = await Firebase.defaultLogin();
                if(response){
                    this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'Profile'}),
                            
                        ],
                    }))
                }
                else{
                    alert('fuck');
                }
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
            <View style={{backgroundColor: '#8acb88', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }
}