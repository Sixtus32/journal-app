import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { JournalApp } from '../target/types/journal_app';

describe('journal-app', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.JournalApp as Program<JournalApp>;

  const journalAppKeypair = Keypair.generate();

  it('Initialize JournalApp', async () => {
    await program.methods
      .initialize()
      .accounts({
        journalApp: journalAppKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([journalAppKeypair])
      .rpc();

    const currentCount = await program.account.journalApp.fetch(
      journalAppKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment JournalApp', async () => {
    await program.methods
      .increment()
      .accounts({ journalApp: journalAppKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journalApp.fetch(
      journalAppKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment JournalApp Again', async () => {
    await program.methods
      .increment()
      .accounts({ journalApp: journalAppKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journalApp.fetch(
      journalAppKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement JournalApp', async () => {
    await program.methods
      .decrement()
      .accounts({ journalApp: journalAppKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journalApp.fetch(
      journalAppKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set journalApp value', async () => {
    await program.methods
      .set(42)
      .accounts({ journalApp: journalAppKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.journalApp.fetch(
      journalAppKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the journalApp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        journalApp: journalAppKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.journalApp.fetchNullable(
      journalAppKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
