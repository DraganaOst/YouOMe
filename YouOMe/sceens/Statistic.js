import React from 'react';
import {View, Text} from 'react-native';
import Graph from '../components/Graph';
import * as styles from '../components/Styles';

export default class Statistic extends React.Component {
    constructor(){
        super();
        this.state = {
            graphViewWidth: 0,
            graphViewHeight: 0
        }
    }

    render() {
        return(
            <View style={{flex: 1, padding: 10, backgroundColor: styles.mainColorGrey}}>
                <View style={{flex:1}} 
                    onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({graphViewWidth: width, graphViewHeight: height});
                        console.log(x,y,width,height);
                    }}
                >
                    <Graph height={this.state.graphViewHeight} width={this.state.graphViewWidth} padding={20}></Graph>
                </View>
                <View style={{flex:1}} >
                </View>
            </View>
            
        );
    }
}