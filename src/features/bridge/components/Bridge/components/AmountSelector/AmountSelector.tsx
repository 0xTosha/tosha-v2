import { memo, useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core';
import { styles } from './styles';
import { useAppDispatch, useAppSelector } from '../../../../../../store';
import {
  selectBridgeDepositTokenForChainId,
  selectBridgeFormState,
} from '../../../../../data/selectors/bridge';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { bridgeActions } from '../../../../../data/reducers/wallet/bridge';
import {
  AmountInput,
  type AmountInputProps,
} from '../../../../../vault/components/Actions/Transact/AmountInput';
import { formatTokenDisplayCondensed } from '../../../../../../helpers/format';
import { BigNumber } from 'bignumber.js';
import { selectUserBalanceOfToken } from '../../../../../data/selectors/balance';
import { selectTokenPriceByTokenOracleId } from '../../../../../data/selectors/tokens';
import { BIG_ZERO } from '../../../../../../helpers/big-number';

const useStyles = makeStyles(styles);

type AmountSelectorProps = {
  className?: string;
};

export const AmountSelector = memo<AmountSelectorProps>(function AmountSelector({ className }) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const { from, input } = useAppSelector(selectBridgeFormState);
  const fromToken = useAppSelector(state => selectBridgeDepositTokenForChainId(state, from));
  const userBalance = useAppSelector(state =>
    selectUserBalanceOfToken(state, fromToken.chainId, fromToken.address)
  );
  const price = useAppSelector(state => selectTokenPriceByTokenOracleId(state, fromToken.oracleId));

  const handleMax = useCallback(() => {
    dispatch(
      bridgeActions.setInputAmount({
        amount: userBalance.decimalPlaces(fromToken.decimals, BigNumber.ROUND_FLOOR),
        max: true,
        token: fromToken,
      })
    );
  }, [dispatch, fromToken, userBalance]);

  const handleChange = useCallback<NonNullable<AmountInputProps['onChange']>>(
    (value, isMax) => {
      dispatch(
        bridgeActions.setInputAmount({
          amount: value.decimalPlaces(fromToken.decimals, BigNumber.ROUND_FLOOR),
          max: isMax,
          token: fromToken,
        })
      );
    },
    [dispatch, fromToken]
  );

  const error = useMemo(() => {
    return input.amount.gt(userBalance);
  }, [input.amount, userBalance]);

  return (
    <div className={clsx(classes.group, className)}>
      <div className={classes.labels}>
        <div className={classes.label}>{t('AMOUNT')}</div>
        <div onClick={handleMax} className={classes.balance}>
          {t('Transact-Available')}{' '}
          <span>
            {formatTokenDisplayCondensed(userBalance, fromToken.decimals, 4)} {fromToken.symbol}
          </span>
        </div>
      </div>
      <AmountInput
        className={clsx(classes.input)}
        value={input.amount}
        maxValue={userBalance}
        tokenDecimals={input.token.decimals}
        onChange={handleChange}
        allowInputAboveBalance={true}
        error={error}
        price={price}
        endAdornment={<MaxButton disabled={userBalance.lte(BIG_ZERO)} onClick={handleMax} />}
      />
    </div>
  );
});

const MaxButton = memo(function MaxButton({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <button onClick={onClick} disabled={disabled} className={classes.max}>
      {t('Transact-Max')}
    </button>
  );
});
