import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {Sample} from './sample';
import '../src/i18n';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import {lang} from '../src/i18n'
const theme = createMuiTheme({
    direction: lang=="en"?'ltr':'rtl'
})

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function RTL() {
    useEffect(() => {
        document.body.dir="rtl"
    }, []);
    return (
        <StylesProvider jss={jss}>
            <ThemeProvider theme={theme}>
                <Sample />
            </ThemeProvider>
        </StylesProvider>
    );
}

function LTR() {
    useEffect(() => {
        document.body.dir="ltr"
    }, []);
    return (
        <StylesProvider>
            <ThemeProvider theme={theme}>
                <Sample />
            </ThemeProvider>
        </StylesProvider>
    );
}
const AppComp=lang=="en"?LTR:RTL;
ReactDOM.render(<AppComp />, document.getElementById('app'));