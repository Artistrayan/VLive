-- Delete posts not linked to a valid profile
DELETE FROM public.posts WHERE user_id NOT IN (SELECT id FROM public.profiles);

-- Delete streams not linked to a valid profile
DELETE FROM public.streams WHERE host_id NOT IN (SELECT id FROM public.profiles);

-- Delete wallets not linked to a valid profile
DELETE FROM public.wallets WHERE user_id NOT IN (SELECT id FROM public.profiles);

-- For any other tables that you add, you can clean them up here:
DELETE FROM public.stories WHERE user_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.conversations WHERE user1_id NOT IN (SELECT id FROM public.profiles) OR user2_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.messages WHERE sender_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.followers WHERE follower_id NOT IN (SELECT id FROM public.profiles) OR following_id NOT IN (SELECT id FROM public.profiles);
DELETE FROM public.notifications WHERE user_id NOT IN (SELECT id FROM public.profiles);
