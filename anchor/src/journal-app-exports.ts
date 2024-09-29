// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import JournalAppIDL from '../target/idl/journal_app.json';
import type { JournalApp } from '../target/types/journal_app';

// Re-export the generated IDL and type
export { JournalApp, JournalAppIDL };

// The programId is imported from the program IDL.
export const JOURNAL_APP_PROGRAM_ID = new PublicKey(JournalAppIDL.address);

// This is a helper function to get the JournalApp Anchor program.
export function getJournalAppProgram(provider: AnchorProvider) {
  return new Program(JournalAppIDL as JournalApp, provider);
}

// This is a helper function to get the program ID for the JournalApp program depending on the cluster.
export function getJournalAppProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return JOURNAL_APP_PROGRAM_ID;
  }
}
