import * as React from 'react';
import { FormHelperText, FormControl as MuiFormControl } from 'material-ui';

interface FormControlProps {
    label?: string;
}

export default class FormControl extends React.PureComponent<FormControlProps, {}> {
    render() {
        return (
            <React.Fragment>
                <MuiFormControl margin="normal">
                    {this.props.children}
                    {this.props.label ? <FormHelperText>{this.props.label}</FormHelperText> : null}
                </MuiFormControl>
                <br />
            </React.Fragment>
        );
    }
}
