import * as React from 'react';
import { Grid, Typography } from 'material-ui';
import { ChangeEvent, Fragment } from 'react';
import { NumberInput } from '../../common/NumberInput';
import FormControl from '../../common/FormControl';

export interface AvailableHolidaysFormProps {
    isVisible: boolean;
    onMovedFromPreviousYearChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    onOtherChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    onOvertimesChange: (ev: ChangeEvent<HTMLInputElement>) => void;
}

export default class AvailableHolidaysForm extends React.PureComponent<AvailableHolidaysFormProps, {}> {
    render() {
        const longLabelFontSize = '0.85em';

        return (
            <Fragment>
                {this.props.isVisible &&
                    <Grid item={true} xs={3}>
                        <Typography variant="subheading" color="textSecondary" gutterBottom={true}>
                            Available:
                        </Typography>
                        <FormControl>
                            <NumberInput
                                label="Moved from previous year"
                                onChange={this.props.onMovedFromPreviousYearChange}
                                labelFontSize={longLabelFontSize}
                            />
                        </FormControl>
                        <FormControl>
                            <NumberInput
                                label="Other"
                                onChange={this.props.onOtherChange}
                                labelFontSize={longLabelFontSize}
                            />
                        </FormControl>
                        <FormControl>
                            <NumberInput
                                label="For Overtimes"
                                onChange={this.props.onOvertimesChange}
                            />
                        </FormControl>
                    </Grid>
                }
            </Fragment>
        );
    }
}
