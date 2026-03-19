use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("96tic1p1tiJ5At9cn6uLcrVjzicZSNwQ56pjYXBNiVt7");

// Prize distribution (basis points out of 10000)
// 1st: 5000 (50%), 2nd: 1800 (18%), 3rd: 1000 (10%), 4th: 500 (5%)
// 5th-10th: 200 each (2% x 6 = 12%), 11th-20th: 70 each (0.7% x 10 = 7%)
// Platform fee: 300 (3%)
const PRIZE_BPS: [u64; 20] = [
    5000, 1800, 1000, 500,
    200, 200, 200, 200, 200, 200,
    70, 70, 70, 70, 70, 70, 70, 70, 70, 70,
];
const PLATFORM_FEE_BPS: u64 = 300;
const LP_THRESHOLD_USDC: u64 = 300_000_000; // $300 in USDC (6 decimals)
const LP_SHARE_BPS: u64 = 7000; // 70% goes to LP when pool > $300
const MAX_ENTRIES_USDC: u8 = 3;
const MAX_ENTRIES_EMLO: u8 = 2;
const EMLO_BET_AMOUNT: u64 = 500_000_000; // 500 EMLO (9 decimals)
const EMLO_PRIZE_POOL: u64 = 50_000_000_000_000; // 50k EMLO
const ROUND_DURATION_USDC: i64 = 86400;  // 24 hours
const ROUND_DURATION_EMLO_WEEK1: i64 = 3600;   // 1 hour (first week)
const ROUND_DURATION_EMLO_NORMAL: i64 = 14400; // 4 hours (after first week)

#[program]
pub mod emojilotto {
    use super::*;

    /// Initialize a new round for either USDC or EMLO game
    pub fn initialize_round(
        ctx: Context<InitializeRound>,
        round_id: u64,
        game_type: GameType,
        answer_hash: [u8; 32],
        entry_fee: u64,
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        round.round_id = round_id;
        round.game_type = game_type.clone();
        round.authority = ctx.accounts.authority.key();
        round.answer_hash = answer_hash;
        round.start_time = Clock::get()?.unix_timestamp;
        round.end_time = Clock::get()?.unix_timestamp + duration_seconds;
        round.entry_fee = entry_fee;
        round.total_entries = 0;
        round.prize_pool = 0;
        round.is_revealed = false;
        round.is_finished = false;
        round.winning_emojis = [255u8; 6];
        round.winner_count = 0;

        emit!(RoundStarted {
            round_id,
            game_type,
            end_time: round.end_time,
            entry_fee,
        });
        Ok(())
    }

    /// Player enters the USDC round (max 3 attempts)
    pub fn enter_round_usdc(
        ctx: Context<EnterRoundUsdc>,
        round_id: u64,
        emoji_picks: [u8; 6],
        ip_hash: [u8; 32],
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        let entry = &mut ctx.accounts.entry;

        require!(!round.is_finished, LottoError::RoundFinished);
        require!(
            Clock::get()?.unix_timestamp < round.end_time,
            LottoError::RoundEnded
        );
        require!(
            entry.attempt_count < MAX_ENTRIES_USDC,
            LottoError::MaxAttemptsReached
        );

        // Validate picks
        validate_picks(&emoji_picks)?;

        // Transfer USDC from player to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.player_usdc.to_account_info(),
            to: ctx.accounts.vault_usdc.to_account_info(),
            authority: ctx.accounts.player.to_account_info(),
        };
        token::transfer(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
            round.entry_fee,
        )?;

        entry.player = ctx.accounts.player.key();
        entry.round_id = round_id;
        entry.ip_hash = ip_hash;
        entry.attempt_count += 1;
        entry.claimed = false;

        // Store this attempt
        let attempt_idx = (entry.attempt_count - 1) as usize;
        entry.picks[attempt_idx] = emoji_picks;
        entry.match_counts[attempt_idx] = 0;

        round.total_entries += 1;
        round.prize_pool += round.entry_fee;

        emit!(PlayerEntered {
            round_id,
            player: ctx.accounts.player.key(),
            attempt: entry.attempt_count,
        });
        Ok(())
    }

    /// Player enters the EMLO round (max 2 attempts, burns EMLO tokens)
    pub fn enter_round_emlo(
        ctx: Context<EnterRoundEmlo>,
        round_id: u64,
        emoji_picks: [u8; 6],
        ip_hash: [u8; 32],
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        let entry = &mut ctx.accounts.entry;

        require!(!round.is_finished, LottoError::RoundFinished);
        require!(
            Clock::get()?.unix_timestamp < round.end_time,
            LottoError::RoundEnded
        );
        require!(
            entry.attempt_count < MAX_ENTRIES_EMLO,
            LottoError::MaxAttemptsReached
        );

        validate_picks(&emoji_picks)?;

        // Transfer EMLO tokens to vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.player_emlo.to_account_info(),
            to: ctx.accounts.vault_emlo.to_account_info(),
            authority: ctx.accounts.player.to_account_info(),
        };
        token::transfer(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), cpi_accounts),
            EMLO_BET_AMOUNT,
        )?;

        entry.player = ctx.accounts.player.key();
        entry.round_id = round_id;
        entry.ip_hash = ip_hash;
        entry.attempt_count += 1;
        entry.claimed = false;

        let attempt_idx = (entry.attempt_count - 1) as usize;
        entry.picks[attempt_idx] = emoji_picks;
        entry.match_counts[attempt_idx] = 0;

        round.total_entries += 1;
        round.prize_pool += EMLO_BET_AMOUNT;

        emit!(PlayerEntered {
            round_id,
            player: ctx.accounts.player.key(),
            attempt: entry.attempt_count,
        });
        Ok(())
    }

    /// Reveal the answer. If someone guessed correctly during the round,
    /// the round ends immediately when correct guess is submitted.
    pub fn reveal_answer(
        ctx: Context<RevealAnswer>,
        winning_emojis: [u8; 6],
        secret_salt: [u8; 32],
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        require!(!round.is_revealed, LottoError::AlreadyRevealed);
        require!(
            Clock::get()?.unix_timestamp >= round.end_time || round.is_finished,
            LottoError::RoundNotEnded
        );

        // Verify hash
        let mut preimage = [0u8; 38];
        preimage[..6].copy_from_slice(&winning_emojis);
        preimage[6..].copy_from_slice(&secret_salt);
        let hash = anchor_lang::solana_program::hash::hash(&preimage);
        require!(hash.to_bytes() == round.answer_hash, LottoError::InvalidReveal);

        round.winning_emojis = winning_emojis;
        round.is_revealed = true;
        round.is_finished = true;

        emit!(AnswerRevealed {
            round_id: round.round_id,
            winning_emojis,
        });
        Ok(())
    }

    /// Score an entry after reveal
    pub fn score_entry(ctx: Context<ScoreEntry>, _round_id: u64) -> Result<()> {
        let round = &ctx.accounts.round;
        let entry = &mut ctx.accounts.entry;
        require!(round.is_revealed, LottoError::NotRevealed);

        for i in 0..entry.attempt_count as usize {
            let mut count: u8 = 0;
            for pick in entry.picks[i].iter() {
                if round.winning_emojis.contains(pick) {
                    count += 1;
                }
            }
            entry.match_counts[i] = count;
        }

        // Best score across all attempts
        entry.best_match = *entry.match_counts[..entry.attempt_count as usize]
            .iter()
            .max()
            .unwrap_or(&0);

        Ok(())
    }

    /// Submit winner rank (called by authority after off-chain ranking)
    pub fn set_winner_rank(
        ctx: Context<SetWinnerRank>,
        _round_id: u64,
        rank: u8, // 1-20
    ) -> Result<()> {
        let round = &mut ctx.accounts.round;
        let entry = &mut ctx.accounts.entry;
        require!(round.is_revealed, LottoError::NotRevealed);
        require!(rank >= 1 && rank <= 20, LottoError::InvalidRank);

        entry.winner_rank = rank;
        round.winner_count += 1;

        // Calculate prize
        let bps = PRIZE_BPS[(rank - 1) as usize];
        entry.prize_amount = round.prize_pool * bps / 10000;

        Ok(())
    }

    /// Claim USDC prize
    pub fn claim_prize_usdc(
        ctx: Context<ClaimPrizeUsdc>,
        round_id: u64,
        bump: u8,
    ) -> Result<()> {
        let round = &ctx.accounts.round;
        let entry = &mut ctx.accounts.entry;
        require!(round.is_revealed, LottoError::NotRevealed);
        require!(!entry.claimed, LottoError::AlreadyClaimed);
        require!(entry.prize_amount > 0, LottoError::NoPrize);
        require!(entry.player == ctx.accounts.player.key(), LottoError::Unauthorized);

        let seeds = &[b"vault_usdc", &round_id.to_le_bytes()[..], &[bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_usdc.to_account_info(),
            to: ctx.accounts.player_usdc.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer,
            ),
            entry.prize_amount,
        )?;

        entry.claimed = true;

        emit!(PrizeClaimed {
            round_id,
            player: ctx.accounts.player.key(),
            amount: entry.prize_amount,
        });
        Ok(())
    }

    /// Claim EMLO prize
    pub fn claim_prize_emlo(
        ctx: Context<ClaimPrizeEmlo>,
        round_id: u64,
        bump: u8,
    ) -> Result<()> {
        let round = &ctx.accounts.round;
        let entry = &mut ctx.accounts.entry;
        require!(round.is_revealed, LottoError::NotRevealed);
        require!(!entry.claimed, LottoError::AlreadyClaimed);
        require!(entry.prize_amount > 0, LottoError::NoPrize);
        require!(entry.player == ctx.accounts.player.key(), LottoError::Unauthorized);

        let seeds = &[b"vault_emlo", &round_id.to_le_bytes()[..], &[bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_emlo.to_account_info(),
            to: ctx.accounts.player_emlo.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer,
            ),
            entry.prize_amount,
        )?;

        entry.claimed = true;

        emit!(PrizeClaimed {
            round_id,
            player: ctx.accounts.player.key(),
            amount: entry.prize_amount,
        });
        Ok(())
    }

    /// Send excess USDC pool to LP when pool > $300
    pub fn send_to_lp(
        ctx: Context<SendToLp>,
        round_id: u64,
        bump: u8,
    ) -> Result<()> {
        let round = &ctx.accounts.round;
        require!(round.is_revealed, LottoError::NotRevealed);
        require!(round.prize_pool > LP_THRESHOLD_USDC, LottoError::PoolBelowThreshold);

        let excess = round.prize_pool - LP_THRESHOLD_USDC;
        let lp_amount = excess * LP_SHARE_BPS / 10000;

        let seeds = &[b"vault_usdc", &round_id.to_le_bytes()[..], &[bump]];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_usdc.to_account_info(),
            to: ctx.accounts.lp_wallet.to_account_info(),
            authority: ctx.accounts.vault_authority.to_account_info(),
        };
        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                cpi_accounts,
                signer,
            ),
            lp_amount,
        )?;

        emit!(LpFunded {
            round_id,
            amount: lp_amount,
        });
        Ok(())
    }
}

fn validate_picks(picks: &[u8; 6]) -> Result<()> {
    let mut seen = [false; 24];
    for &idx in picks.iter() {
        require!(idx < 24, LottoError::InvalidEmojiIndex);
        require!(!seen[idx as usize], LottoError::DuplicateEmoji);
        seen[idx as usize] = true;
    }
    Ok(())
}

// ─── Types ────────────────────────────────────────────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameType {
    Usdc,
    Emlo,
}

// ─── Accounts ─────────────────────────────────────────────────────────────────

#[account]
pub struct Round {
    pub round_id: u64,
    pub game_type: GameType,
    pub authority: Pubkey,
    pub answer_hash: [u8; 32],
    pub winning_emojis: [u8; 6],
    pub start_time: i64,
    pub end_time: i64,
    pub entry_fee: u64,
    pub total_entries: u64,
    pub prize_pool: u64,
    pub is_revealed: bool,
    pub is_finished: bool,
    pub winner_count: u8,
}

#[account]
pub struct Entry {
    pub player: Pubkey,
    pub round_id: u64,
    pub ip_hash: [u8; 32],
    pub attempt_count: u8,
    pub picks: [[u8; 6]; 3],
    pub match_counts: [u8; 3],
    pub best_match: u8,
    pub winner_rank: u8,
    pub prize_amount: u64,
    pub claimed: bool,
}

// ─── Contexts ─────────────────────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct InitializeRound<'info> {
    #[account(
        init, payer = authority,
        space = 8 + 8 + 2 + 32 + 32 + 6 + 8 + 8 + 8 + 8 + 8 + 1 + 1 + 1,
        seeds = [b"round", &round_id.to_le_bytes()], bump
    )]
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct EnterRoundUsdc<'info> {
    #[account(mut, seeds = [b"round", &round_id.to_le_bytes()], bump)]
    pub round: Account<'info, Round>,
    #[account(
        init_if_needed, payer = player,
        space = 8 + 32 + 8 + 32 + 1 + 18 + 3 + 1 + 1 + 8 + 1,
        seeds = [b"entry", &round_id.to_le_bytes(), player.key().as_ref()], bump
    )]
    pub entry: Account<'info, Entry>,
    #[account(mut)]
    pub player_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct EnterRoundEmlo<'info> {
    #[account(mut, seeds = [b"round", &round_id.to_le_bytes()], bump)]
    pub round: Account<'info, Round>,
    #[account(
        init_if_needed, payer = player,
        space = 8 + 32 + 8 + 32 + 1 + 18 + 3 + 1 + 1 + 8 + 1,
        seeds = [b"entry", &round_id.to_le_bytes(), player.key().as_ref()], bump
    )]
    pub entry: Account<'info, Entry>,
    #[account(mut)]
    pub player_emlo: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_emlo: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevealAnswer<'info> {
    #[account(mut, has_one = authority)]
    pub round: Account<'info, Round>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ScoreEntry<'info> {
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub entry: Account<'info, Entry>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct SetWinnerRank<'info> {
    #[account(mut, has_one = authority)]
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub entry: Account<'info, Entry>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct ClaimPrizeUsdc<'info> {
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub entry: Account<'info, Entry>,
    #[account(mut)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player_usdc: Account<'info, TokenAccount>,
    /// CHECK: PDA authority
    pub vault_authority: UncheckedAccount<'info>,
    pub player: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct ClaimPrizeEmlo<'info> {
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub entry: Account<'info, Entry>,
    #[account(mut)]
    pub vault_emlo: Account<'info, TokenAccount>,
    #[account(mut)]
    pub player_emlo: Account<'info, TokenAccount>,
    /// CHECK: PDA authority
    pub vault_authority: UncheckedAccount<'info>,
    pub player: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct SendToLp<'info> {
    pub round: Account<'info, Round>,
    #[account(mut)]
    pub vault_usdc: Account<'info, TokenAccount>,
    #[account(mut)]
    pub lp_wallet: Account<'info, TokenAccount>,
    /// CHECK: PDA authority
    pub vault_authority: UncheckedAccount<'info>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

// ─── Errors ───────────────────────────────────────────────────────────────────

#[error_code]
pub enum LottoError {
    #[msg("Round is finished")]
    RoundFinished,
    #[msg("Round has ended")]
    RoundEnded,
    #[msg("Round has not ended yet")]
    RoundNotEnded,
    #[msg("Maximum attempts reached")]
    MaxAttemptsReached,
    #[msg("Invalid emoji index")]
    InvalidEmojiIndex,
    #[msg("Duplicate emoji in picks")]
    DuplicateEmoji,
    #[msg("Already revealed")]
    AlreadyRevealed,
    #[msg("Not yet revealed")]
    NotRevealed,
    #[msg("Invalid reveal hash")]
    InvalidReveal,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("No prize")]
    NoPrize,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid rank (must be 1-20)")]
    InvalidRank,
    #[msg("Pool below $300 threshold")]
    PoolBelowThreshold,
}

// ─── Events ───────────────────────────────────────────────────────────────────

#[event]
pub struct RoundStarted {
    pub round_id: u64,
    pub game_type: GameType,
    pub end_time: i64,
    pub entry_fee: u64,
}

#[event]
pub struct PlayerEntered {
    pub round_id: u64,
    pub player: Pubkey,
    pub attempt: u8,
}

#[event]
pub struct AnswerRevealed {
    pub round_id: u64,
    pub winning_emojis: [u8; 6],
}

#[event]
pub struct PrizeClaimed {
    pub round_id: u64,
    pub player: Pubkey,
    pub amount: u64,
}

#[event]
pub struct LpFunded {
    pub round_id: u64,
    pub amount: u64,
}
