import * as React from 'react';
import { Card, CardActions, Typography } from 'material-ui';
import { ReactNode } from 'react';
import CardContent from 'material-ui/Card/CardContent';

import '../../styles/cardPage.css';

export interface CardPageProps {
    actions?: ReactNode;
    title: string;
}

export default class CardPage extends React.PureComponent<CardPageProps, {}> {
    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="headline" component="h2">
                        {this.props.title}
                    </Typography>
                    <div className="card-content">
                        {this.props.children}
                    </div>

                </CardContent>
                {this.props.actions &&
                    <CardActions>
                        {this.props.actions}
                    </CardActions>
                }
            </Card>
        );
    }
}
