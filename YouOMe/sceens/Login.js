import React from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            email: "",
            password: ""
        };
    };

    onPressLogin = async () => {
        try{
            let response = false;
            response = await Firebase.login(this.state.email, this.state.password);
            //response = await Firebase.login("dragana.ost@gmail.com", "testtest");
            if(response === true){
                this.props.navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Notes' })
                    ],
                }))
            }
        }
        catch (e) {
            alert(e);
        }
    };

    render(): React.ReactNode {
        return (
            <View style={styles.LoginSignUp.containerLogin}>
                <Image source={require("../images/logo.png")} />
                <TextInput
                    style={styles.LoginSignUp.input}
                    placeholder={'Email'}
                    onChangeText={(text) => this.setState({email: text})}
                />
                <TextInput
                    style={styles.LoginSignUp.input}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    onChangeText={(text) => this.setState({password: text})}
                />
                <TouchableOpacity
                    onPress={this.onPressLogin}
                    underlayColor="white"
                >
                    <View style={styles.LoginSignUp.button}>
                        <Text style={styles.LoginSignUp.buttonText}>Login</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => this.props.navigation.dispatch(StackActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({ routeName: 'SignUp' })
                        ],
                    }))}
                    underlayColor="white"
                >
                    <View style={styles.LoginSignUp.buttonInverse}>
                        <Text style={styles.LoginSignUp.buttonTextInverse}>Sign Up</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}