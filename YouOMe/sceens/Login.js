import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class Login extends React.Component{
    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            auth: false
        };
    };

    onPressLogin = () => {
        Firebase.login(this.state.email, this.state.password);
    };

    render() {
        return (
            <View style={styles.LoginSignUp.containerLogin}>
                <View style={styles.LoginSignUp.containerImage}>
                    <Image
                        style={styles.LoginSignUp.image}
                        source={require("../images/logo3.png")}
                        resizeMode="center"
                    />
                </View>
                <View style={{flex: 1}}>
                    <TextInput
                        style={styles.LoginSignUp.input}
                        placeholder={'Email'}
                        onChangeText={(text) => this.setState({email: text})}
                        keyboardType={'email-address'}
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
            </View>
        );
    }
}