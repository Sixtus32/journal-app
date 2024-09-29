#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("BVcrVEF4QDV9XPUye8DCeDJZUWDq2oDgTQVF9AnNRP1c");

#[program]
pub mod journal_app {
    use super::*;

  pub fn close(_ctx: Context<CloseJournalApp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.journal_app.count = ctx.accounts.journal_app.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.journal_app.count = ctx.accounts.journal_app.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeJournalApp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.journal_app.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeJournalApp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + JournalApp::INIT_SPACE,
  payer = payer
  )]
  pub journal_app: Account<'info, JournalApp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseJournalApp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub journal_app: Account<'info, JournalApp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub journal_app: Account<'info, JournalApp>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalApp {
  count: u8,
}
