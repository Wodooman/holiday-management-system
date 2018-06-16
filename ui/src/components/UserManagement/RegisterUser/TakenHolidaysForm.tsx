import * as React from 'react';
import { Grid, Typography } from 'material-ui';
import { FormEvent, ChangeEvent } from 'react';
import { NumberInput } from '../../common/NumberInput';
import FormControl from '../../common/FormControl';

export interface TakenHolidaysFormProps {
    isVisible: boolean;
    onMovedFromPreviousChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    onTakenChange: (ev: FormEvent<HTMLInputElement>) => void;
    onOnRequestChange: (ev: FormEvent<HTMLInputElement>) => void;
    onNotPaidChange: (ev: FormEvent<HTMLInputElement>) => void;
    onOtherChange: (ev: FormEvent<HTMLInputElement>) => void;
    onForOvertimesChange: (ev: FormEvent<HTMLInputElement>) => void;
}

export function TakenHolidaysForm(props: TakenHolidaysFormProps) {
    return (
        <React.Fragment>
            {props.isVisible &&
                <Grid item={true} xs={3}>
                    <Typography variant="subheading" color="textSecondary" gutterBottom={true}>
                        Taken:
                    </Typography>
                    <FormControl>
                        <NumberInput
                            onChange={props.onMovedFromPreviousChange}
                            label="Moved from previous year"
                            labelFontSize="0.85em"
                        />
                    </FormControl>
                    <FormControl>
                        <NumberInput
                            label="Taken Holidays"
                            onChange={props.onTakenChange}
                        />
                    </FormControl>
                    <FormControl>
                        <NumberInput
                            label="On request"
                            onChange={props.onOnRequestChange}
                        />
                    </FormControl>
                    <FormControl>
                        <NumberInput
                            label="Not Paid"
                            onChange={props.onNotPaidChange}
                        />
                    </FormControl>
                    <FormControl>
                        <NumberInput
                            label="Other"
                            onChange={props.onOtherChange}
                        />
                    </FormControl>
                    <FormControl>
                        <NumberInput
                            label="For overtimes"
                            onChange={props.onForOvertimesChange}
                        />
                    </FormControl>
                </Grid>}
        </React.Fragment>
    );
}
