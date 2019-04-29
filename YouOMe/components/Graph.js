
import React from 'react';
import {Button} from 'react-native';
import {Svg, Polyline, Line, Text, G, Path, Circle} from 'react-native-svg';
import * as styles from '../components/Styles';
import { RotationGestureHandler } from 'react-native-gesture-handler';
import { Rgb } from './Rgb';

const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const year = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Avg", "Sep", "Oct", "Nov", "Dec"];

//transformCoorinates
transCoord = (height, y) => {
    return (((height/2) - y) + height/2);
}

class Axis extends React.Component {
    getLines = (maxValueY, minValueY, ticksY, width, height, padding, format) => {
        if(height != 0 && width != 0){
            let array = [];
            let gap = ((height - 2*padding) / (ticksY));
            let tickGap = (maxValueY-minValueY)/(ticksY);
            for(let i=minValueY, j=0; j<(ticksY+1); i=i+tickGap, j++){
                array.push(
                    <Line
                        key={i + "LineY"}
                        x1={padding + padding/2}
                        y1={transCoord(height, j * gap + padding)}
                        x2={width-padding/2}
                        y2={transCoord(height, j * gap + padding)}
                        stroke="white"
                        strokeWidth="1"
                    />
                );
                array.push(
                    <Text
                        key={i + "TextY"}
                        fill="white"
                        stroke="white"
                        fontSize="12"
                        fontWeight="200"
                        x={padding/2}
                        y={transCoord(height, j * gap + padding - 5)}
                        textAnchor="start"
                    >{Number(Number(i).toFixed(2))}</Text>
                );
            }

            let l = width - 2*padding;
            if(format == "week"){
                let tickGapLabelsX = l / (week.length - 1);
                for(let i=0; i<week.length; i++){
                    array.push(
                        <Line
                            key={i + "LineX"}
                            x1={padding + padding/2 + tickGapLabelsX * (i)}
                            y1={height - padding - 5}
                            x2={padding + padding/2 + tickGapLabelsX * (i)}
                            y2={height - padding + 5}
                            stroke="white"
                            strokeWidth="1"
                        />
                    );
                    array.push(
                        <Text
                            key={i + "TextX"}
                            fill="white"
                            stroke="white"
                            fontSize="12"
                            fontWeight="200"
                            x={padding + padding/2 + tickGapLabelsX * (i)}
                            y={height - padding/3}
                            textAnchor="middle"
                            transform={`rotate(-35, ${padding + padding/2 + tickGapLabelsX * (i)} ${height - padding/2})`}
                        >{week[i]}</Text>               
                    );
                }
            }
            else if(format == "year"){
                let tickGapLabelsX = l / (year.length - 1);
                for(let i=0; i<year.length; i++){
                    array.push(
                        <Line
                            key={i + "LineX"}
                            x1={padding + padding/2 + tickGapLabelsX * (i)}
                            y1={height - padding - 5}
                            x2={padding + padding/2 + tickGapLabelsX * (i)}
                            y2={height - padding + 5}
                            stroke="white"
                            strokeWidth="1"
                        />
                    );
                    array.push(
                        <Text
                            key={i + "TextX"}
                            fill="white"
                            stroke="white"
                            fontSize="12"
                            fontWeight="200"
                            x={padding + padding/2 + tickGapLabelsX * (i)}
                            y={height - padding/3}
                            textAnchor="middle"
                            transform={`rotate(-45, ${padding + padding/2 + tickGapLabelsX * (i)} ${height - padding/2})`}
                        >{year[i]}</Text>               
                    );
                }
            } else {
                let tickGapLabelsX = (l / (format - 1));
                for(let i=0; i<format; i++){
                    array.push(
                        <Line
                            key={i + "LineX"}
                            x1={padding + padding/2 + tickGapLabelsX * (i)}
                            y1={height - padding - 5}
                            x2={padding + padding/2 + tickGapLabelsX * (i)}
                            y2={height - padding + 5}
                            stroke="white"
                            strokeWidth="1"
                        />
                    );
                    if((i+1)%3 == 0)
                        array.push(
                            <Text
                                key={i + "TextX"}
                                fill="white"
                                stroke="white"
                                fontSize="12"
                                fontWeight="200"
                                x={padding + padding/2 + tickGapLabelsX * (i)}
                                y={height - padding/3}
                                textAnchor="middle"
                            >{i+1}</Text>               
                        );
                }
            }

            let h = ((height - 2*padding) / (maxValueY-minValueY));
            if(minValueY < 0){
                array.push(
                    <Line
                        key={"osX0"}
                        x1={(padding/2 + padding)}
                        y1={transCoord(height, (0 - minValueY) * h + padding)}
                        x2={width - padding/2}
                        y2={transCoord(height, (0 - minValueY) * h + padding)}
                        stroke="white"
                        strokeWidth="2"
                    />
                );
            }

            for(let i=minValueY, j = 0; i<maxValueY; i++, j++){
                array.push(
                    <Line
                        key={i + "MiniLine"}
                        x1={(padding/2 + padding)}
                        y1={transCoord(height, j * h + padding)}
                        x2={width - padding/2}
                        y2={transCoord(height, j * h + padding)}
                        stroke="white"
                        strokeWidth="0.2"
                    />
                );
            }

            return array;
        }
        else 
            return null;
        
    }

    render(){
        let { maxValueY, minValueY, ticksY, width, height, padding, format} = this.props;
        let lines = this.getLines(maxValueY, minValueY, ticksY, width, height, padding, format);
        return(
            <Svg>
                <Path
                    //d={`M${0 + padding} ${0 + padding} L${0 + padding} ${height - padding} L${width - padding/2} ${height - padding}`}
                    d={`M${0 + padding + padding/2} ${height - padding} L${width - padding/2} ${height - padding}`}
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                />
                {lines}
            </Svg>
        );
    }
}

let labelPositions = [];

class Data extends React.Component {
    getData = (maxValueY, minValueY, ticksY, width, height, padding, format, data, color, label, multiple) => {
        if(height != 0 && width != 0){
            let color2 = color;
            if(multiple)
                color2 += "";

            let array = [];
            let path ="";
            let pathGap = 0;

            let l = width - 2*padding;
            if(format == "week"){
                pathGap = l / (week.length - 1);
            }
            else if(format == "year"){
                pathGap = l / (year.length - 1);
            } else {
                pathGap = (l / (format - 1));
            }

            let dotArray = [];
            let h = ((height - 2*padding) / (maxValueY-minValueY));
            let pathBack = "";
            let x = 0;
            let y = 0;
            
            for(let i=0; i<data.length; i++){
                if(i == 0)
                    path += "M" + (padding + padding/2 + pathGap * (i)) + " " + transCoord(height, (data[i] - minValueY) * h + padding);
                else
                    path += " L" + (padding + padding/2 + pathGap * (i)) + " " + transCoord(height, (data[i] - minValueY) * h + padding);

                pathBack += " L" + (padding + padding/2 + pathGap * (i)) + " " + transCoord(height, (data[i] - minValueY) * h + padding);
                x = padding + padding/2 + pathGap * (i);
                y = transCoord(height, (data[i] - minValueY) * h + padding);
                
                dotArray.push(
                    <Circle key={i + "Dot"} cx={padding + padding/2 + pathGap * (i)} cy={transCoord(height, (data[i] - minValueY) * h + padding)} r="5" fill={color2} stroke="white" 
                        onPress={() => {
                            alert(data[i]);
                        }} 
                    />
                );
            }

            array.push(
                <Path
                    key="data"
                    d={`${path}`}
                    fill="none"
                    stroke={color2}
                    strokeWidth="3"
                />
            );

            if(!multiple){
                let objectColor = new Rgb(color);
                let transparentColor = `rgb(${objectColor.r},${objectColor.g},${objectColor.b},150)`;
                array.push(
                    <Path
                        key="dataBackground"
                        d={`M${padding + padding/2} ${height - padding} ${pathBack} L${width - padding/2} ${height - padding}`}
                        fill={transparentColor}
                        stroke="none"
                        strokeWidth="3"
                    />
                );
            }

            let labelPosition = y - 10;
            while(labelPositions.find(x => x == labelPosition))
                labelPosition -= 10;
            array.push(
                <Text
                    key={"Name"}
                    fill={color}
                    stroke={color}
                    fontSize="12"
                    fontWeight="200"
                    x={x}
                    y={labelPosition}
                    textAnchor="end"
                >{label}</Text>
            );

            labelPositions.push(labelPosition);

            array = array.concat(dotArray);

            return array;
        }
        else 
            return null;
    }

    render(){
        let { maxValueY, minValueY, ticksY, width, height, padding, format, data, color, label, multiple} = this.props;
        let lines = this.getData(maxValueY, minValueY, ticksY, width, height, padding, format, data, color, label, multiple);
        return(
            <Svg>
                {lines}
            </Svg>
        );
    }
}


export default class Graph extends React.Component {
    constructor(){
        super();

    }

    getDivisors = number => {
        let array = [];
        let max = number;
        for(let i=1; i<max; i++){
            if(number%i == 0){
                array.push(i);
                array.push(number/i);
                max = number/i;
            }
        }
        return array;
    }

    render() {
        let { height, width, padding, data, format } = this.props;

        let maxValueY = 0;
        let minValueY = Number.MAX_SAFE_INTEGER;
        let ticks = 0;
        let code = [];

        labelPositions = [];

        for(let i=0; i<data.length; i++){
            if(Math.max(...data[i].data) > maxValueY)
                maxValueY = Math.max(...data[i].data);
            if(Math.min(...data[i].data) < minValueY)
                minValueY = Math.min(...data[i].data);
        }

        if((maxValueY-minValueY)%1 != 0){
            maxValueY = Math.ceil(maxValueY);
            minValueY = Math.floor(minValueY);
        }

        if(maxValueY == minValueY)
            maxValueY += 5;
        else if(maxValueY - minValueY <= 5)
            maxValueY += 5;
        if(maxValueY - minValueY <= 10)
            ticks = maxValueY - minValueY;
        else{
            let divisor = this.getDivisors(maxValueY - minValueY);
            ticks = 0;
            if(divisor.length == 2){
                maxValueY++;
                divisor = this.getDivisors(maxValueY - minValueY);
            }
            ticks = divisor[divisor.length - 1];
        }

        let color=[styles.mainColorGreen, styles.mainColorOrange];
        let multiple = false;
        if(data.length > 1){
            multiple = true;
        }
        for(let i=0; i<data.length; i++){ 
            code.push(
                <Data
                    key={i}
                    maxValueY={maxValueY}
                    minValueY={minValueY}
                    ticksY={ticks}
                    width={width}
                    height={height}
                    padding={padding}
                    format={format} //week, month, year
                    data={data[i].data}
                    color={i<color.length ? color[i] : new Rgb(Math.random() * 255, Math.random() * 255, Math.random * 255)}
                    label={data[i].username}
                    multiple={multiple}
                />  
            );
        }
        
        return (
            <Svg
                height="100%"
                width="100%"
                style={{backgroundColor: styles.mainColorLightGrey2}}
            >
                <Axis
                    maxValueY={maxValueY}
                    minValueY={minValueY}
                    ticksY={ticks}
                    width={width}
                    height={height}
                    padding={padding}
                    format={format} //week, month, year
                />
                {code}
            </Svg>
        );
    }
}