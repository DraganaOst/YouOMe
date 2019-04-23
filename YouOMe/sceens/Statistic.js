import React from 'react';
import {View, Text, Picker} from 'react-native';
import Graph from '../components/Graph';
import * as styles from '../components/Styles';
import Firebase from '../components/Firebase';

export default class Statistic extends React.Component {
    constructor(){
        super();
        this.state = {
            graphViewWidth: 0,
            graphViewHeight: 0,
            users: []
        }
    }

    componentDidMount() {
        this.loadUsers();
    }

    loadUsers = () => {
        Firebase.database.ref('/').once('value',
            (snapshot) => {
                if (snapshot.child('connections/' + Firebase.uid).exists())
                {
                    let data = Firebase.database.ref('/connections/' + Firebase.uid);
                    data.once('value', (snapshot) => {
                        this.setState({users: []});
                        let codeDefault = (
                            <Picker.Item key={"default"} label={""} value={'default'} />
                        );
                        this.setState((previousState) => ({'users': [...previousState.users, codeDefault]}));
                        snapshot.forEach((child) => {
                            let ref = Firebase.database.ref('/users/' + child.key).once('value').then(
                                (snapshotUser) => {
                                    let code = "";
                                    if(child.val() === true){
                                        code = (
                                            <Picker.Item key={child.key} label={snapshotUser.val().username} value={child.key} />
                                        );
                                        this.setState((previousState) => ({'users': [...previousState.users, code]}));
                                    }
                                }
                            );
                        });
                    });
                }
            }
        );
    };

    render() {
        return(
            <View style={{flex: 1, padding: 10, backgroundColor: styles.mainColorGrey}}>
                <Picker
                    selectedValue={this.state.userValue}
                    style={{height: 45, backgroundColor: 'white'}}
                    onValueChange={(itemValue, itemIndex) =>(
                        this.setState({userIndex: itemIndex}),
                        this.setState({userValue: itemValue})
                    )
                    }>
                    {this.state.users}
                </Picker>
                <View style={{flex:1}} 
                    onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({graphViewWidth: width, graphViewHeight: height});
                        console.log(x,y,width,height);
                    }}
                >
                    <Graph height={this.state.graphViewHeight} width={this.state.graphViewWidth} padding={30} data={[[1, 7, 0, 4, 23, 6, 10]]} format={"week"}></Graph>
                </View>
                <View style={{flex:1}} >
                </View>
            </View>
            
        );
    }
}