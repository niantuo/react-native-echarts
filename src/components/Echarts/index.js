import React, {Component} from 'react';
import {Platform, StyleSheet, View, WebView,ViewPropTypes} from 'react-native';
import renderChart from './renderChart';
import PropTypes from 'prop-types'

const isIos = Platform.OS === 'ios';

export default class App extends Component {

    static propTypes={
        ...ViewPropTypes,
        scrollEnabled:PropTypes.bool
    };

    static defaultProps={
        ...View.defaultProps,
        scrollEnabled:true
    };

    constructor(props) {
        super(props);
        this.setNewOption = this.setNewOption.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.option !== this.props.option) {
            this.refs.chart.reload();
        }
    }

    setNewOption(option) {
        this.refs.chart.postMessage(JSON.stringify(option));
    }

    render() {
        return (
            <View style={{flex: 1, height: this.props.height || 400,}}>
                <WebView
                    ref="chart"
                    scrollEnabled={this.props.scrollEnabled}
                    injectedJavaScript={renderChart(this.props)}
                    style={{
                        height: this.props.height || 400,
                        backgroundColor: this.props.backgroundColor || 'transparent'
                    }}
                    scalesPageToFit={Platform.OS !== 'ios'}
                    source={isIos ? require('./tpl.html') : {uri: 'file:///android_asset/tpl.html'}}
                    onMessage={event => this.props.onPress ? this.props.onPress(JSON.parse(event.nativeEvent.data)) : null}
                />
            </View>
        );
    }
}
