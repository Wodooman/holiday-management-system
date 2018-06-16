import * as React from 'react';
import { InputLabel, Input } from 'material-ui';
import { ChangeEvent, Fragment } from 'react';

export interface NumberInputProps {
    labelFontSize?: string | number | undefined;
    label: string;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: () => void;    
}

export function NumberInput(props: NumberInputProps) {

    return (
        <Fragment>
            <InputLabel style={{ fontSize: props.labelFontSize }}>{props.label}</InputLabel>
            <Input
                type="number"
                onChange={props.onChange}
                onBlur={props.onBlur}
            />
        </Fragment>
    );
}
