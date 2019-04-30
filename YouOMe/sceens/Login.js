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
            auth: false,
            loggedIn: true
        };
    };

    onPressLogin = () => {
        Firebase.login(this.state.email, this.state.password);
    };

    render() {
        return (
            <View style={styles.LoginSignUp.containerLogin}>
                {/*logo image*/}
                <View style={styles.LoginSignUp.containerImage}>
                    <Image
                        style={styles.LoginSignUp.image}
                        source={require("../images/logo3.png")}
                        resizeMode="center"
                    />
                </View>
                {/*form*/}
                <View style={{flex: 1}}>
                    {/*email input*/}
                    <TextInput
                        style={styles.LoginSignUp.input}
                        placeholder={'Email'}
                        onChangeText={(text) => this.setState({email: text})}
                        keyboardType={'email-address'}
                    />
                    {/*password input*/}
                    <TextInput
                        style={styles.LoginSignUp.input}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        onChangeText={(text) => this.setState({password: text})}
                    />
                    {/*keep logged in*/}
                    <View style={styles.LoginSignUp.containerKeepLoggedIn}>
                        <TouchableOpacity onPress={() => {Firebase.loggedIn = !this.state.loggedIn; this.setState({loggedIn: !this.state.loggedIn});}} style={styles.LoginSignUp.buttonKeepLoggedIn}>
                            <View style={styles.LoginSignUp.checkboxOutBox}>
                                <View style={[styles.LoginSignUp.checkboxInBox, {backgroundColor: this.state.loggedIn ? styles.mainColorGreen : styles.mainColorLightGrey}]}></View>
                            </View>
                            <Text>Keep me logged in</Text>
                        </TouchableOpacity>             
                    </View>
                    {/*login button*/}
                    <TouchableOpacity onPress={this.onPressLogin} underlayColor="white">
                        <View style={styles.LoginSignUp.button}>
                            <Text style={styles.LoginSignUp.buttonText}>Login</Text>
                        </View>
                    </TouchableOpacity>
                    {/*sign up button*/}
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