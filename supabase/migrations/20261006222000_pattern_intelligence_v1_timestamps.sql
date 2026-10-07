-- Keep Pattern Signal updated_at consistent with existing case-workspace conventions.
drop trigger if exists update_pattern_signals_updated_at on public.pattern_signals;
create trigger update_pattern_signals_updated_at
before update on public.pattern_signals
for each row execute function public.update_updated_at_column();

drop trigger if exists update_pattern_signal_occurrences_updated_at on public.pattern_signal_occurrences;
create trigger update_pattern_signal_occurrences_updated_at
before update on public.pattern_signal_occurrences
for each row execute function public.update_updated_at_column();
