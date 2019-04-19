
import React from 'react'
import {Svg, Polyline, Line, Text, G, Path} from 'react-native-svg';
import * as styles from '../components/Styles';


class Asixs extends React.Component {
    getLinesY = (maxValueY, minValueY, ticksY, width, height, padding) => {
        if(height != 0 && width != 0){
            let array = [];
            let gap = Math.floor(height / (ticksY -1));
            for(let i=minValueY, j=0; i<=maxValueY; i+=ticksY, j++){
                array.push(
                    <Line
                        key={i + "Line"}
                        x1={padding}
                        y1={j * gap + padding}
                        x2={width-padding}
                        y2={j * gap + padding}
                        stroke="white"
                        strokeWidth="1"
                    />
                );
                array.push(
                    <Svg  key={i + "Key"} style={{backgroundColor: 'red'}}>
                        <Text
                            fill="none"
                            stroke="purple"
                            fontSize="20"
                            fontWeight="bold"
                            x="200"
                            y="200"
                            textAnchor="middle"
                        >NEKAJ TEXT</Text>
                    </Svg>
                    
                    /*<Text
                        key={i + "Text"}
                        x={0}
                        y={j * gap + padding}
                        fontSize="10"
                        strokeWidth="1"
                        textAnchor="end"
                        stroke='white'
                    >{i}</Text>*/
                );
            }
            return array;
        }
        else 
            return null;
        
    }

    render(){
        let { maxValueX, minValueX, ticksX, maxValueY, minValueY, ticksY, width, height, padding, format } = this.props;

        let linesY = this.getLinesY(maxValueY, minValueY, ticksY, width, height, padding);

        return(
            <Svg>
                <Path
                    d={`M${padding} ${height - padding} L${padding} ${padding} L${width - padding} ${padding}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                />
                {linesY}
            </Svg>
        );
    }
}

export default class Graph extends React.Component {
    constructor(){
        super();

    }

    render() {
        let { height, width, padding } = this.props;
        return (
            <Svg
                height="100%"
                width="100%"
                style={{backgroundColor: styles.mainColorLightGrey2, transform: [{rotateX: '180deg'}]}}
            >
                <Asixs 
                    maxValueX={8}
                    minValueX={0}
                    ticksX ={8}
                    maxValueY={15}
                    minValueY={0}
                    ticksY={5}
                    width={width}
                    height={height}
                    padding={30}
                    format={"week"} //week, month, year
                />
            </Svg>
        );
    }
}