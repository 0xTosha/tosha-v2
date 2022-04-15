import { Box, makeStyles, IconButton, Button, Grid, Typography } from '@material-ui/core';
import React from 'react';
import { CardContent } from '../../../../vault/components/Card/CardContent';
import { CardHeader } from '../../../../vault/components/Card/CardHeader';
import { CardTitle } from '../../../../vault/components/Card/CardTitle';
import CloseIcon from '@material-ui/icons/Close';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectAllChains } from '../../../../data/selectors/chains';
import { Card } from '../../../../vault/components/Card';
import { ChainEntity } from '../../../../data/entities/chain';

const useStyles = makeStyles(styles as any);

function _ModalTvl({ close }: { close: () => void }) {
  const classes = useStyles();
  const { t } = useTranslation();

  const chains = useSelector(selectAllChains);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    minWidth: '400px',
  };

  return (
    <Box sx={style}>
      <Card>
        <CardHeader className={classes.header}>
          <CardTitle titleClassName={classes.title} title={t('TVL-bychain')} />
          <IconButton className={classes.removeHover} onClick={close} aria-label="settings">
            <CloseIcon htmlColor="#8A8EA8" />
          </IconButton>
        </CardHeader>
        <CardContent className={classes.container}>
          <Grid container spacing={2}>
            {chains.map(chain => {
              return (
                <Grid key={chain.id} item xs={6} lg={3}>
                  <Chain chain={chain} />
                </Grid>
              );
            })}
          </Grid>
          <Button onClick={close} className={classes.btn}>
            {t('Close')}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export const ModalTvl = React.memo(_ModalTvl);

function Chain({ chain }: { chain: ChainEntity }) {
  const classes = useStyles();
  return (
    <Box className={classes.chain}>
      <img
        className={classes.chainLogo}
        alt={chain.id}
        src={require(`../../../../../images/networks/${chain.id}.svg`).default}
      />
      <Box>
        <Typography variant="body2" className={classes.chainText}>
          {chain.name}
        </Typography>
        <Typography className={classes.chainValue}>{chain.name}</Typography>
      </Box>
    </Box>
  );
}
