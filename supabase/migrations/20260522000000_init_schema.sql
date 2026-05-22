-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  age integer,
  location text,
  current_education text,
  desired_field text,
  interests text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create experiences table
create table if not exists public.experiences (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  type text not null,
  date text not null,
  location text,
  photo_url text,
  reflection text not null,
  takeaways text[],
  people_met jsonb default '[]'::jsonb,
  skills text[],
  impact text,
  posted jsonb default '{"linkedin": false, "instagram": false, "tiktok": false, "twitter": false}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create milestones table
create table if not exists public.milestones (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  desc_text text,
  done boolean default false not null,
  phase text not null,
  ai_suggested boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create planner_tasks table
create table if not exists public.planner_tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  task text not null,
  timeframe text not null,
  due_date text,
  done boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_discover_states table
create table if not exists public.user_discover_states (
  user_id uuid references auth.users on delete cascade not null,
  item_type text not null, -- 'community', 'chat', 'event'
  item_id text not null,
  joined boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, item_type, item_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.milestones enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.user_discover_states enable row level security;

-- Policies for profiles
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policies for experiences
create policy "Users can view their own experiences" on public.experiences
  for select using (auth.uid() = user_id);
create policy "Users can insert their own experiences" on public.experiences
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own experiences" on public.experiences
  for update using (auth.uid() = user_id);
create policy "Users can delete their own experiences" on public.experiences
  for delete using (auth.uid() = user_id);

-- Policies for milestones
create policy "Users can view their own milestones" on public.milestones
  for select using (auth.uid() = user_id);
create policy "Users can insert their own milestones" on public.milestones
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own milestones" on public.milestones
  for update using (auth.uid() = user_id);
create policy "Users can delete their own milestones" on public.milestones
  for delete using (auth.uid() = user_id);

-- Policies for planner_tasks
create policy "Users can view their own planner tasks" on public.planner_tasks
  for select using (auth.uid() = user_id);
create policy "Users can insert their own planner tasks" on public.planner_tasks
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own planner tasks" on public.planner_tasks
  for update using (auth.uid() = user_id);
create policy "Users can delete their own planner tasks" on public.planner_tasks
  for delete using (auth.uid() = user_id);

-- Policies for user_discover_states
create policy "Users can view their own discover states" on public.user_discover_states
  for select using (auth.uid() = user_id);
create policy "Users can insert/update their own discover states" on public.user_discover_states
  for insert with check (auth.uid() = user_id);
create policy "Users can update their own discover states" on public.user_discover_states
  for update using (auth.uid() = user_id);
create policy "Users can delete their own discover states" on public.user_discover_states
  for delete using (auth.uid() = user_id);

-- User creation trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, age, location, current_education, desired_field, interests)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce((new.raw_user_meta_data->>'age')::integer, 22),
    coalesce(new.raw_user_meta_data->>'location', ''),
    coalesce(new.raw_user_meta_data->>'current_education', ''),
    coalesce(new.raw_user_meta_data->>'desired_field', ''),
    case 
      when new.raw_user_meta_data->'interests' is not null then
        array(select jsonb_array_elements_text(new.raw_user_meta_data->'interests'))
      else
        array[]::text[]
    end
  );

  -- Seed experiences
  insert into public.experiences (user_id, title, type, date, location, photo_url, reflection, takeaways, people_met, skills, impact, posted)
  values
    (new.id, 'UQ Innovation Summit 2026', 'Event', 'Apr 18, 2026', 'Brisbane, AU', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=70', 'First proper startup conference. Felt nervous walking in alone but ended up in three great conversations. Realized I undersell the side project I''ve been working on.', array['Founders care way more about traction than tech', 'Cold-emailing speakers actually works', 'Pitching out loud > rehearsing in my head'], '[{"name": "Maya Chen", "role": "VC Associate, Blackbird", "linkedin": "#"}, {"name": "Rohan Patel", "role": "Founder, FleetIQ", "linkedin": "#"}]'::jsonb, array['Networking', 'Pitching', 'Public Speaking'], 'Met 8 people, 3 follow-ups booked', '{"linkedin": true, "instagram": false, "tiktok": false, "twitter": false}'::jsonb),
    (new.id, 'Brisbane Food Bank Volunteer Day', 'Volunteer', 'Apr 6, 2026', 'South Brisbane', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=70', 'Spent 4 hours sorting donations with a team of strangers. Left with sore arms and a much clearer view of food insecurity in my own city.', array['Logistics is harder than it looks', 'Small actions x lots of people = real impact'], '[{"name": "Sara Lin", "role": "Volunteer Coordinator"}]'::jsonb, array['Teamwork', 'Logistics', 'Community Impact'], '4 hrs · ~200 meals packed', '{"linkedin": false, "instagram": false, "tiktok": false, "twitter": false}'::jsonb),
    (new.id, 'Robotics Workshop — Arduino Basics', 'Workshop', 'Mar 28, 2026', 'UQ Makerspace', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70', 'Built my first line-following robot. Frustrating in the middle, super satisfying at the end. Made me rethink whether I want to do pure software or something more physical.', array['Hardware debugging is a different mental model', 'I learn way faster building than reading'], '[{"name": "Dr. Wong", "role": "Workshop Lead"}]'::jsonb, array['Arduino', 'Soldering', 'Debugging'], null, '{"linkedin": false, "instagram": false, "tiktok": false, "twitter": false}'::jsonb),
    (new.id, 'Hackathon: ClimateHack 2026', 'Competition', 'Mar 15, 2026', 'Online', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=70', '48 hours, 4 teammates I''d never met, one prototype that actually worked. We didn''t win but I shipped a working product end-to-end for the first time.', array['Scope down twice as much as you think', 'Demo > docs in a hackathon setting', 'Sleep schedule matters more than caffeine'], '[{"name": "Liam Park", "role": "CS @ ANU"}, {"name": "Ada Williams", "role": "Designer @ Canva"}]'::jsonb, array['React', 'Rapid Prototyping', 'Team Leadership'], 'Top 15 of 80 teams', '{"linkedin": true, "instagram": true, "tiktok": false, "twitter": false}'::jsonb);

  -- Seed milestones
  insert into public.milestones (user_id, title, desc_text, done, phase, ai_suggested)
  values
    (new.id, 'Complete AI Foundations course', 'Gain understanding of neural networks and basic APIs.', true, 'Phase 1: Exploration', false),
    (new.id, 'Attend a developer hackathon', 'Collaborate in a team to build a software prototype.', true, 'Phase 1: Exploration', false),
    (new.id, 'Build a frontend application with React', 'Demonstrate responsive UI design and state management.', false, 'Phase 2: Building', false),
    (new.id, 'Integrate Mistral AI API into a project', 'Implement real AI queries and chat interfaces.', false, 'Phase 2: Building', true),
    (new.id, 'Optimize online professional portfolio', 'Publish logged wins and share custom bio link.', false, 'Phase 3: Launching', true),
    (new.id, 'Apply for Summer Software Internships', 'Submit resume and portfolio to matched tech companies.', false, 'Phase 3: Launching', false);

  -- Seed planner tasks
  insert into public.planner_tasks (user_id, task, timeframe, due_date, done)
  values
    (new.id, 'Review React state management hooks', 'week', 'In 2 days', false),
    (new.id, 'Log last workshop experience in Journey Log', 'week', 'In 4 days', true),
    (new.id, 'Message 2 contacts met at UQ Startup Fair', 'week', 'This Sunday', false),
    (new.id, 'Complete the prototype of Pomodoro app', 'month', 'June 15', false),
    (new.id, 'Attend Brisbane AI Builders Meetup', 'month', 'June 20', false),
    (new.id, 'Update LinkedIn headline with target jobs', 'month', 'June 25', true),
    (new.id, 'Land a hybrid/remote Software Engineering Internship', 'year', 'Dec 2026', false),
    (new.id, 'Complete 4 major portfolio projects', 'year', 'Nov 2026', false),
    (new.id, 'Maintain a weekly brand building posting habit', 'year', 'Ongoing', false);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger binding
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
