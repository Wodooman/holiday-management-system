import * as React from 'react';
import { LinearProgress } from 'material-ui';

export interface ProgressBarProps {
    showProgress: boolean;
}

export default class ProgressBar extends React.PureComponent<ProgressBarProps, {}> {
    render() {
        let styles = { backgroundColor: 'rgb(237, 236, 236)', top: 63, zIndex: 1300 };
        styles = this.props.showProgress ? styles : Object.assign(styles, { display: 'none' });

        return (
            <LinearProgress style={styles} />
        );
    }
}
