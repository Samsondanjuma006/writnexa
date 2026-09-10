create table if not exists public.billing_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  plan_name text not null default 'Free'
    check (plan_name in ('Free', 'Starter', 'Pro')),

  plan_code text
    check (plan_code in ('free', 'starter', 'pro')),

  paystack_customer_code text,
  paystack_subscription_code text,

  status text not null default 'active'
    check (status in (
      'active',
      'trialing',
      'non-renewing',
      'attention',
      'cancelled',
      'expired'
    )),

  trial_started_at timestamptz,
  trial_ends_at timestamptz,

  current_period_start timestamptz,
  current_period_end timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(user_id)
);

alter table public.billing_subscriptions enable row level security;

drop policy if exists "Users can view their own billing subscription"
on public.billing_subscriptions;

create policy "Users can view their own billing subscription"
on public.billing_subscriptions
for select
using ((select auth.uid()) = user_id);

create index if not exists billing_subscriptions_user_id_idx
on public.billing_subscriptions(user_id);

create index if not exists billing_subscriptions_paystack_customer_idx
on public.billing_subscriptions(paystack_customer_code);

create index if not exists billing_subscriptions_paystack_subscription_idx
on public.billing_subscriptions(paystack_subscription_code);

create or replace function public.set_billing_subscription_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists billing_subscriptions_updated_at
on public.billing_subscriptions;

create trigger billing_subscriptions_updated_at
before update on public.billing_subscriptions
for each row
execute function public.set_billing_subscription_updated_at();
