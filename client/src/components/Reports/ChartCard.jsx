export default function ChartCard({ title, subtitle, actions, children }) {
  return (
    <section className="report-card">
      <div className="report-card-head">
        <div>
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
