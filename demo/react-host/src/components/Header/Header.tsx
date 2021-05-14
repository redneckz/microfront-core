import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useContainer } from '@redneckz/microfront-core-react';

const useStyles = makeStyles(theme => ({
    toolbar: {
        borderBottom: `1px solid ${theme.palette.divider}`
    },
    toolbarTitle: {
        flex: 1
    }
}));

export interface HeaderProps {
    title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    const classes = useStyles();

    const container = useContainer();

    const [currentToken, setCurrentToken] = useState(container(token)());

    const onSignUp = useCallback(() => {
        const newToken = container(signUp)();
        setCurrentToken(newToken);
        // GTM event
        reactHostDL.push({ event: 'login', eventValue: newToken.replace(/^.{32}/, '********') });
    }, []);

    const onSignOut = useCallback(() => {
        container(signOut)();
        setCurrentToken(null);
        // GTM event
        reactHostDL.push({ event: 'logout', eventValue: '' });
    }, []);

    return (
        <Toolbar className={classes.toolbar}>
            <Button size="small">Subscribe</Button>
            <Typography
                component="h2"
                variant="h5"
                color="inherit"
                align="center"
                noWrap
                className={classes.toolbarTitle}
            >
                {title}
            </Typography>
            <Button onClick={currentToken ? onSignOut : onSignUp} variant="outlined" size="small">
                {currentToken ? (
                    <img
                        src={`https://www.tinygraphs.com/spaceinvaders/${currentToken}?theme=frogideas&numcolors=4&size=24&fmt=svg`}
                        alt="SIGN OUT"
                        title="SIGN OUT"
                        width="24"
                        height="24"
                    />
                ) : (
                    'SIGN UP'
                )}
            </Button>
        </Toolbar>
    );
};

function token(_?: string) {
    if (_) {
        localStorage.setItem('token', _);
    }
    return localStorage.getItem('token');
}

function signUp(): string {
    if (!token()) {
        const rnd = new Uint8Array(32);
        crypto.getRandomValues(rnd);
        return token([...rnd].map(_ => _.toString(16)).join('')) as string;
    }
    return token() as string;
}

function signOut(): void {
    localStorage.removeItem('token');
}
