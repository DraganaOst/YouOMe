import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class SignUpScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            email: "",
            password: "",
            username: ""
        };
    };

    onPressSignUp = async () => {
        Firebase.signUp(this.state.email, this.state.password, this.state.username, this.props.navigation);
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
                <View style={{flex: 1.5}}>
                    {/*username input*/}
                    <TextInput
                        style={styles.LoginSignUp.input}
                        placeholder={'Username'}
                        onChangeText={(text) => this.setState({username: text})}
                    />
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
                    {/*sign up button*/}
                    <TouchableOpacity
                        onPress={this.onPressSignUp}
                        underlayColor="white"
                    >
                        <View style={styles.LoginSignUp.button}>
                            <Text style={styles.LoginSignUp.buttonText}>Sign Up</Text>
                        </View>
                    </TouchableOpacity>
                    {/*login button*/}
                    <TouchableOpacity
                        onPress={() => this.props.navigation.dispatch(StackActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'Login' })
                            ],
                        }))}
                        underlayColor="white"
                    >
                        <View style={styles.LoginSignUp.buttonInverse}>
                            <Text style={styles.LoginSignUp.buttonTextInverse}>Login</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}