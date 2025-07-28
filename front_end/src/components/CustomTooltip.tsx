export const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const dataKey = payload[0].dataKey;

    let topPerformers = [];

    if (dataKey === "term1") topPerformers = data.topTerm1;
    else if (dataKey === "term2") topPerformers = data.topTerm2;
    else if (dataKey === "term3") topPerformers = data.topTerm3;

    return (
      <div style={{ backgroundColor: "#fff", padding: 10, border: "1px solid #ccc" }}>
        <p><strong>{data.subject} - {payload[0].name}</strong></p>
        <p>Top Performers:</p>
        <ul>
          {topPerformers.map((student: string, index: number) => (
            <li key={index}>{student}</li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};
