import CutCard from './CutCard';

export default function StatTile({ icon: Icon, label, value, accent = 'text-gold-500' }) {
    return (
        <CutCard innerClassName="flex items-center gap-4 p-5">
            <Icon className={`size-8 shrink-0 ${accent}`} />
            <div>
                <p className="font-display text-xs font-semibold tracking-widest text-ink-muted uppercase">{label}</p>
                <p className="font-mono text-2xl font-semibold text-ink">{value}</p>
            </div>
        </CutCard>
    );
}
