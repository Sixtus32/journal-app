'use client';

import {
  getJournalAppProgram,
  getJournalAppProgramId,
} from '@journal-app/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useJournalAppProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getJournalAppProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getJournalAppProgram(provider);

  const accounts = useQuery({
    queryKey: ['journal-app', 'all', { cluster }],
    queryFn: () => program.account.journalApp.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ['journal-app', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods
        .initialize()
        .accounts({ journalApp: keypair.publicKey })
        .signers([keypair])
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error('Failed to initialize account'),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useJournalAppProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useJournalAppProgram();

  const accountQuery = useQuery({
    queryKey: ['journal-app', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalApp.fetch(account),
  });

  const closeMutation = useMutation({
    mutationKey: ['journal-app', 'close', { cluster, account }],
    mutationFn: () =>
      program.methods.close().accounts({ journalApp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  const decrementMutation = useMutation({
    mutationKey: ['journal-app', 'decrement', { cluster, account }],
    mutationFn: () =>
      program.methods.decrement().accounts({ journalApp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const incrementMutation = useMutation({
    mutationKey: ['journal-app', 'increment', { cluster, account }],
    mutationFn: () =>
      program.methods.increment().accounts({ journalApp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  const setMutation = useMutation({
    mutationKey: ['journal-app', 'set', { cluster, account }],
    mutationFn: (value: number) =>
      program.methods.set(value).accounts({ journalApp: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
  });

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  };
}
