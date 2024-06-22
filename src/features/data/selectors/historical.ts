import type { BeefyState } from '../../../redux-types';
import type { VaultEntity } from '../entities/vault';
import type { ApiTimeBucket } from '../apis/beefy/beefy-data-api-types';
import type { TokenEntity } from '../entities/token';
import { createSelector } from '@reduxjs/toolkit';
import { selectVaultShouldShowInterest } from './data-loader';
import { allDataApiBuckets } from '../apis/beefy/beefy-data-api-helpers';
import { fromKeys } from '../../../helpers/object';
import type { ChartApiPoint, ChartStat } from '../../vault/components/HistoricGraph/types';

const unavailableBuckets = fromKeys(allDataApiBuckets, false);

export function selectHistoricalRangesStatus(state: BeefyState, vaultId: VaultEntity['id']) {
  return state.biz.historical.ranges.byVaultId[vaultId]?.status || 'idle';
}

export const selectHistoricalHasAnyChart = createSelector(
  selectHistoricalHasApyChart,
  selectHistoricalHasTvlChart,
  selectHistoricalHasPriceChart,
  selectHistoricalHasCowcentratedRanges,
  (apy, tvl, price, clm) => apy || tvl || price || clm
);

export function selectHistoricalHasApyChart(state: BeefyState, vaultId: VaultEntity['id']) {
  return Object.values(state.biz.historical.apys.byVaultId[vaultId]?.available || {}).some(v => v);
}

export function selectHistoricalHasTvlChart(state: BeefyState, vaultId: VaultEntity['id']) {
  return Object.values(state.biz.historical.tvls.byVaultId[vaultId]?.available || {}).some(v => v);
}

export function selectHistoricalHasPriceChart(
  state: BeefyState,
  oracleId: TokenEntity['oracleId']
) {
  return Object.values(state.biz.historical.prices.byOracleId[oracleId]?.available || {}).some(
    v => v
  );
}

export function selectHistoricalHasCowcentratedRanges(
  state: BeefyState,
  vaultId: VaultEntity['id']
) {
  return Object.values(state.biz.historical.clm.byVaultId[vaultId]?.available || {}).some(v => v);
}

export const selectHistoricalAvailableCharts = createSelector(
  (state: BeefyState, vaultId: VaultEntity['id'], oracleId: TokenEntity['oracleId']) =>
    selectHistoricalHasPriceChart(state, oracleId),
  selectHistoricalHasApyChart,
  selectHistoricalHasTvlChart,
  selectVaultShouldShowInterest,
  (state: BeefyState, vaultId: VaultEntity['id'], _oracleId: TokenEntity['oracleId']) =>
    selectHistoricalHasCowcentratedRanges(state, vaultId),
  (hasPriceChart, hasApyChart, hasTvlChart, showApy, hasCowcentratedRanges) => {
    const availableCharts: ChartStat[] = [];
    if (hasCowcentratedRanges) {
      availableCharts.push('clm');
    }
    if (hasApyChart && showApy) {
      availableCharts.push('apy');
    }
    if (hasTvlChart) {
      availableCharts.push('tvl');
    }
    if (hasPriceChart) {
      availableCharts.push('price');
    }

    return availableCharts;
  }
);

export function selectHistoricalApyBucketStatus(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.apys.byVaultId[vaultId]?.byTimebucket[bucket]?.status || 'idle';
}

export function selectHistoricalTvlBucketStatus(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.tvls.byVaultId[vaultId]?.byTimebucket[bucket]?.status || 'idle';
}

export function selectHistoricalPriceBucketStatus(
  state: BeefyState,
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.prices.byOracleId[oracleId]?.byTimebucket[bucket]?.status || 'idle';
}

export function selectHistoricalCowcentratedRangesBucketStatus(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.clm.byVaultId[vaultId]?.byTimebucket[bucket]?.status || 'idle';
}

export function selectHistoricalApyBucketData(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.apys.byVaultId[vaultId]?.byTimebucket[bucket]?.data || undefined;
}

export function selectHistoricalTvlBucketData(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.tvls.byVaultId[vaultId]?.byTimebucket[bucket]?.data || undefined;
}

export function selectHistoricalPriceBucketData(
  state: BeefyState,
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.prices.byOracleId[oracleId]?.byTimebucket[bucket]?.data || undefined;
}

export function selectHistoricalCowcentratedRangesBucketData(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return state.biz.historical.clm.byVaultId[vaultId]?.byTimebucket[bucket]?.data || undefined;
}

export function selectHistoricalPriceAvailableBuckets(
  state: BeefyState,
  oracleId: TokenEntity['oracleId']
) {
  return state.biz.historical.prices.byOracleId[oracleId]?.available || unavailableBuckets;
}

export function selectHistoricalApyAvailableBuckets(state: BeefyState, vaultId: VaultEntity['id']) {
  return state.biz.historical.apys.byVaultId[vaultId]?.available || unavailableBuckets;
}

export function selectHistoricalTvlAvailableBuckets(state: BeefyState, vaultId: VaultEntity['id']) {
  return state.biz.historical.tvls.byVaultId[vaultId]?.available || unavailableBuckets;
}

export function selectHistoricalCowcentratedRangesAvailableBuckets(
  state: BeefyState,
  vaultId: VaultEntity['id']
) {
  return state.biz.historical.clm.byVaultId[vaultId]?.available || unavailableBuckets;
}

export function selectHistoricalPriceHasDataBuckets(
  state: BeefyState,
  oracleId: TokenEntity['oracleId']
) {
  return state.biz.historical.prices.byOracleId[oracleId]?.hasData || unavailableBuckets;
}

export function selectHistoricalApyHasDataBuckets(state: BeefyState, vaultId: VaultEntity['id']) {
  return state.biz.historical.apys.byVaultId[vaultId]?.hasData || unavailableBuckets;
}

export function selectHistoricalTvlHasDataBuckets(state: BeefyState, vaultId: VaultEntity['id']) {
  return state.biz.historical.tvls.byVaultId[vaultId]?.hasData || unavailableBuckets;
}

export function selectHistoricalCowcentratedRangesHasDataBuckets(
  state: BeefyState,
  vaultId: VaultEntity['id']
) {
  return state.biz.historical.clm.byVaultId[vaultId]?.hasData || unavailableBuckets;
}

export function selectHistoricalPriceAlreadyFulfilledBuckets(
  state: BeefyState,
  oracleId: TokenEntity['oracleId']
) {
  return state.biz.historical.prices.byOracleId[oracleId]?.alreadyFulfilled || unavailableBuckets;
}

export function selectHistoricalApyAlreadyFulfilledBuckets(
  state: BeefyState,
  vaultId: VaultEntity['id']
) {
  return state.biz.historical.apys.byVaultId[vaultId]?.alreadyFulfilled || unavailableBuckets;
}

export function selectHistoricalTvlAlreadyFulfilledBuckets(
  state: BeefyState,
  vaultId: VaultEntity['id']
) {
  return state.biz.historical.tvls.byVaultId[vaultId]?.alreadyFulfilled || unavailableBuckets;
}

export function selectHistoricalCowcentratedRangesAlreadyFulfilledBuckets(
  state: BeefyState,
  vaultId: VaultEntity['id']
) {
  return state.biz.historical.clm.byVaultId[vaultId]?.alreadyFulfilled || unavailableBuckets;
}

export function selectHistoricalPriceBucketHasData(
  state: BeefyState,
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalPriceHasDataBuckets(state, oracleId)[bucket];
}

export function selectHistoricalApyBucketHasData(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalApyHasDataBuckets(state, vaultId)[bucket];
}

export function selectHistoricalTvlBucketHasData(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalTvlHasDataBuckets(state, vaultId)[bucket];
}

export function selectHistoricalCowcentratedRangesBucketHasData(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalCowcentratedRangesHasDataBuckets(state, vaultId)[bucket];
}

export function selectHistoricalPriceBucketAlreadyFulfilled(
  state: BeefyState,
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalPriceAlreadyFulfilledBuckets(state, oracleId)[bucket];
}

export function selectHistoricalApyBucketAlreadyFulfilled(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalApyAlreadyFulfilledBuckets(state, vaultId)[bucket];
}

export function selectHistoricalTvlBucketAlreadyFulfilled(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalTvlAlreadyFulfilledBuckets(state, vaultId)[bucket];
}

export function selectHistoricalCowcentratedRangesBucketAlreadyFulfilled(
  state: BeefyState,
  vaultId: VaultEntity['id'],
  bucket: ApiTimeBucket
) {
  return selectHistoricalCowcentratedRangesAlreadyFulfilledBuckets(state, vaultId)[bucket];
}

export function selectHistoricalBucketStatus(
  state: BeefyState,
  stat: ChartStat,
  vaultId: VaultEntity['id'],
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  switch (stat) {
    case 'apy':
      return selectHistoricalApyBucketStatus(state, vaultId, bucket);
    case 'tvl':
      return selectHistoricalTvlBucketStatus(state, vaultId, bucket);
    case 'price':
      return selectHistoricalPriceBucketStatus(state, oracleId, bucket);
    case 'clm':
      return selectHistoricalCowcentratedRangesBucketStatus(state, vaultId, bucket);
  }

  throw new Error(`Unknown stat: ${stat}`);
}

export function selectHistoricalAvailableBuckets(
  state: BeefyState,
  stat: ChartStat,
  vaultId: VaultEntity['id'],
  oracleId: TokenEntity['oracleId']
) {
  switch (stat) {
    case 'apy':
      return selectHistoricalApyAvailableBuckets(state, vaultId);
    case 'tvl':
      return selectHistoricalTvlAvailableBuckets(state, vaultId);
    case 'price':
      return selectHistoricalPriceAvailableBuckets(state, oracleId);
    case 'clm':
      return selectHistoricalCowcentratedRangesAvailableBuckets(state, vaultId);
  }

  throw new Error(`Unknown stat: ${stat}`);
}

export function selectHistoricalBucketHasData(
  state: BeefyState,
  stat: ChartStat,
  vaultId: VaultEntity['id'],
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  switch (stat) {
    case 'apy':
      return selectHistoricalApyBucketHasData(state, vaultId, bucket);
    case 'tvl':
      return selectHistoricalTvlBucketHasData(state, vaultId, bucket);
    case 'price':
      return selectHistoricalPriceBucketHasData(state, oracleId, bucket);
    case 'clm':
      return selectHistoricalCowcentratedRangesBucketHasData(state, vaultId, bucket);
  }

  throw new Error(`Unknown stat: ${stat}`);
}

export function selectHistoricalBucketAlreadyFulfilled(
  state: BeefyState,
  stat: ChartStat,
  vaultId: VaultEntity['id'],
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
) {
  switch (stat) {
    case 'apy':
      return selectHistoricalApyBucketAlreadyFulfilled(state, vaultId, bucket);
    case 'tvl':
      return selectHistoricalTvlBucketAlreadyFulfilled(state, vaultId, bucket);
    case 'price':
      return selectHistoricalPriceBucketAlreadyFulfilled(state, oracleId, bucket);
    case 'clm':
      return selectHistoricalCowcentratedRangesBucketAlreadyFulfilled(state, vaultId, bucket);
  }

  throw new Error(`Unknown stat: ${stat}`);
}

type HistoricalBucketData<TStat extends ChartStat> = ChartApiPoint<TStat>[] | undefined;

export function selectHistoricalBucketData<TStat extends ChartStat>(
  state: BeefyState,
  stat: TStat,
  vaultId: VaultEntity['id'],
  oracleId: TokenEntity['oracleId'],
  bucket: ApiTimeBucket
): HistoricalBucketData<TStat> {
  if (stat === 'apy') {
    return selectHistoricalApyBucketData(state, vaultId, bucket) as HistoricalBucketData<TStat>;
  } else if (stat === 'tvl') {
    return selectHistoricalTvlBucketData(state, vaultId, bucket) as HistoricalBucketData<TStat>;
  } else if (stat === 'price') {
    return selectHistoricalPriceBucketData(state, oracleId, bucket) as HistoricalBucketData<TStat>;
  } else if (stat === 'clm') {
    return selectHistoricalCowcentratedRangesBucketData(
      state,
      vaultId,
      bucket
    ) as HistoricalBucketData<TStat>;
  }

  throw new Error(`Unknown stat: ${stat}`);
}
