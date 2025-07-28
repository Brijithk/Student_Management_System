import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cell } from "recharts";

import '../css/p-dashboard.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Student {
  username: string;
  class:string;
  marks: {
    term1: Record<string, string>;
    term2: Record<string, string>;
    term3: Record<string, string>;
  };
}

const PASS_MARK = 50;

const SUBJECT_COLORS: Record<string, string> = {
  english: "#8884d8",
  computer: "#82ca9d",
  maths: "#ffc658",
  // science: "#ff7f50",
  // physics: "#6a5acd",
  // chemistry: "#20b2aa",
  // biology: "#ff69b4",
  // economics: "#a0522d",
  // history: "#ffb6c1",
  // geography: "#40e0d0",
};
const TERM_COLORS: Record<string, string> = {
  term1: "#ff7f50",
  term2: "#6a5acd",
  term3: "#20b2aa",
  // science: "#ff7f50",
  // physics: "#6a5acd",
  // chemistry: "#20b2aa",
  // biology: "#ff69b4",
  // economics: "#a0522d",
  // history: "#ffb6c1",
  // geography: "#40e0d0",
};

const PrincipalDashboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
const [selectedClass, setSelectedClass] = useState<string>("10");
  useEffect(() => {
    axios
      .get("http://localhost:3000/login/getStudent")
      .then((response) => {
        const data = response.data;
        setStudents(data);
        if (data.length > 0) {
          const subList = Object.keys(data[0].marks.term1);
          setSubjects(subList);
        }
      })
      .catch((error) => console.error("Failed to fetch students", error));
  }, []);
     const filteredStudents = students.filter(
    (student) => student.class === selectedClass
  );        
  const calculatePassPercentage = (term: "term1" | "term2" | "term3", subject: string) => {
    let passedCount = 0;
    let totalCount = 0;

   filteredStudents.map((students) => {
      const markString = students.marks?.[term]?.[subject];
      const mark = Number(markString);

      if (!isNaN(mark)) {
        totalCount++;
        if (mark >= PASS_MARK) {
          passedCount++;
        }
      }
    });

    return totalCount > 0 ? Math.round((passedCount / totalCount) * 100) : 0;
  };

  const getTopStudents = (term: "term1" | "term2" | "term3", subject: string) => {
    return [...filteredStudents]
      .filter((s) => !isNaN(Number(s.marks[term][subject])))
      .sort(
        (a, b) =>
          Number(b.marks[term][subject] || 0) -
          Number(a.marks[term][subject] || 0)
      )
      .slice(0, 3)
      .map((s) => `${s.username} (${s.marks[term][subject]})`);
  };

  const getChartDataForSubject = (subject: string) => {
    return ["term1", "term2", "term3"].map((term) => ({
      term: term.toUpperCase(),
      passPercentage: calculatePassPercentage(term as any, subject),
      topStudents: getTopStudents(term as any, subject),
    }));
  };
    //   

             const getAverageMarksPerSubject = (term: "term1" | "term2" | "term3") => {
  return subjects.map((subject) => {
    let total = 0;
    let count = 0;

    filteredStudents.forEach((student) => {
      const mark = Number(student.marks[term][subject]);
      if (!isNaN(mark)) {
        total += mark;
        count++;
      }
    });

    return {
      subject,
      average: count > 0 ? Math.round(total / count) : 0,
    };
  });
};


    // 
    const getTopPerformers = (term: "term1" | "term2" | "term3") => {
  const studentsWithTotal = filteredStudents.map((student) => {
    const marks = student.marks[term];
    const total =
      Number(marks.english || 0) +
      Number(marks.computer || 0) +
      Number(marks.maths || 0);
    return { username: student.username, total };
  });

  return studentsWithTotal
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);
};

  return (<div className="pd-container">
 
    <div style={{ padding: "20px" }} className="pd-left">
          
  <div style={{ marginBottom: "20px", textAlign: "center"}} className="pd-change">
    <h2>Dashboard</h2>
        <button onClick={() => setSelectedClass("10")} className={`pd-modern-class-btn ${selectedClass === '10' ? 'active' : ''}`}>Class 10</button>
        <button onClick={() => setSelectedClass("12")} className={`pd-modern-class-bt ${selectedClass === '12' ? 'active' : ''}`}>Class 12</button>
      </div>
        <div className="pd-passGraph">
     
      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
         <h3 style={{width:"50%"}}>Faculty Assessment</h3>
  {Object.entries(SUBJECT_COLORS).map(([subject, color]) => (
    <div key={subject} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: color,
        }}
      ></div>
      <span style={{ textTransform: "capitalize" }}>{subject}</span>
    </div>
  ))}
</div>
     <div style={{ display: "flex", gap: "20px", flexWrap: "nowrap", overflowX: "hidden",marginTop:"10px" }}>
     
  {subjects.map((subject) => (
    <div key={subject} style={{ flex: "0 0 220px", marginBottom: "10px" }}>
            {/* <h3 style={{ textAlign: "center" }}>{subject}</h3> */}
            <ResponsiveContainer width="90%" height={200}>
              <BarChart data={getChartDataForSubject(subject)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="term" tick={{ fontSize: 12 }}/>
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
               <Tooltip
  content={({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            maxWidth: "220px",
            whiteSpace: "pre-line", // Allow line breaks
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold" }}>
            {data.term} - Top Performers:
          </p>
          {data.topStudents && data.topStudents.length > 0 ? (
            data.topStudents.map((student: string, index: number) => (
              <p key={index} style={{ margin: "4px 0" }}>
                {index + 1}. {student}
              </p>
            ))
          ) : (
            <p>No data</p>
          )}
        </div>
      );
    }
    return null;
  }}
/>

               <Bar
  dataKey="passPercentage"
  fill={SUBJECT_COLORS[subject] || "#8884d8"}
  name="Pass %"
/>

              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>
      </div>
      {/*  */}
      <div className="pd-avgGraph">
 
       <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
  <h3 style={{width:"60%",paddingLeft:"30px"}}>Average Marks </h3>
  
  <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
    {Object.entries(TERM_COLORS).map(([term, color]) => (
      <div key={term} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: color,
          }}
        ></div>
        <span style={{ textTransform: "uppercase" }}>{term}</span>
      </div>
    ))}
  </div>
</div>

<div
  style={{
    display: "flex",
    gap: "20px",
    flexWrap: "nowrap",
   
  }}

>  
  {["term1", "term2", "term3"].map((term) => (
    <div key={term} style={{ flex: 1 }}>
      {/* <h3 style={{ textAlign: "center" }}>{term.toUpperCase()}</h3> */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={getAverageMarksPerSubject(term as any)}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis type="category" dataKey="subject" />
          <Tooltip />
     <Bar dataKey="average" name="Average Marks">
  {getAverageMarksPerSubject(term as any).map((entry, index) => (
    <Cell key={index} fill={TERM_COLORS[term] || "#82ca9d"} />
  ))}
</Bar>


        </BarChart>
      </ResponsiveContainer>
    </div>
  ))}
</div>
</div>


{/*  */}
    </div>
    
    
    
    <div style={{ marginTop: "10px" }} className="pd-right">
      <h2 style={{textAlign:"center"}}>TOP PERFORMER</h2>
      <hr style={{ marginBottom: "20px",marginTop: "10px",opacity:"0.5" ,marginLeft:"30px",marginRight:"30px"}}></hr>
  <h2 style={{ marginBottom: "10px" }}>Term 1</h2>
  <ul style={{ listStyle: "none",  padding: "10px", margin: 0 }} className="pd-s1">
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    {getTopPerformers("term1").map((student, index, array) => (
      <React.Fragment key={index}>
        <li style={{ textAlign: "center", padding: "0 10px" }}>
          <div className="pd-font"> {student.username}</div>
          <img
            src={
              index === 0
                ? "/first.jpg"
                : index === 1
                ? "/second.jpg"
                : "/third.jpg"
            }
            alt="Student"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "6px",
            }}
          />
          <div className="pd-font">Total: {student.total}</div>
        </li>

        {/* Vertical line, except after last item */}
        {index !== array.length - 1 && (
          <div
            style={{
              width: "1px",
              height: "80px",
              backgroundColor: "gray",
              margin: "0 10px",
            }}
          ></div>
        )}
      </React.Fragment>
    ))}
  </div>
</ul>


  <h2 style={{ marginTop: "10px", marginBottom: "10px" }}> Term 2</h2>
  <ul style={{ listStyle: "none",  padding: "10px", margin: 0 }} className="pd-s1">
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    {getTopPerformers("term2").map((student, index, array) => (
      <React.Fragment key={index}>
        <li style={{ textAlign: "center", padding: "0 10px" }}>
          <div className="pd-font"> {student.username}</div>
          <img
            src={
              index === 0
                ? "/first.jpg"
                : index === 1
                ? "/second.jpg"
                : "/third.jpg"
            }
            alt="Student"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "6px",
            }}
          />
          <div className="pd-font">Total: {student.total}</div>
        </li>

        {/* Vertical line, except after last item */}
        {index !== array.length - 1 && (
          <div
            style={{
              width: "1px",
              height: "80px",
              backgroundColor: "gray",
              margin: "0 10px",
            }}
          ></div>
        )}
      </React.Fragment>
    ))}
  </div>
</ul>


  <h2 style={{ marginTop: "10px", marginBottom: "10px" }}> Term 3</h2>
 <ul style={{ listStyle: "none",  padding: "10px", margin: 0 }} className="pd-s1">
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
    {getTopPerformers("term3").map((student, index, array) => (
      <React.Fragment key={index}>
        <li style={{ textAlign: "center", padding: "0 10px" }}>
          <div className="pd-font">{student.username}</div>
          <img
            src={
              index === 0
                ? "/first.jpg"
                : index === 1
                ? "/second.jpg"
                : "/third.jpg"
            }
            alt="Student"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "6px",
            }}
          />
          <div className="pd-font">Total: {student.total}</div>
        </li>

        {/* Vertical line, except after last item */}
        {index !== array.length - 1 && (
          <div
            style={{
              width: "1px",
              height: "80px",
              backgroundColor: "gray",
              margin: "0 10px",
            }}
          ></div>
        )}
      </React.Fragment>
    ))}
  </div>
</ul>

</div>

    </div>
  );
};

export default PrincipalDashboard;
