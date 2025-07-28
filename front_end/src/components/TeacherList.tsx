import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/TeacherList.css';
import { User, X,PlusCircle ,UserPlus} from 'lucide-react';
import { PieChart, Pie, Cell,Tooltip } from 'recharts';

interface Teacher {
  name: string;
  section: string;
  class: string;
  studentCount?: number;
  email?: string;
  phone?: string;
  subject?: string;
}

interface Student {
  class: string;
  section: string;
  marks: {
    term1: Record<string, string>;
    term2: Record<string, string>;
    term3: Record<string, string>;
  };
}

const TeacherList: React.FC = () => {
  const [teachersByClass, setTeachersByClass] = useState<Record<string, Teacher[]>>({});
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
const [students, setStudents] = useState<Student[]>([]);
  const [showForm, setShowForm] = useState(false);
  const generateUsername = () => {
  const prefix = 'user';
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `${prefix}${randomNum}`;
};

  const [formInput, setFormInput] = useState({
    username: generateUsername(),
    name: '',
   class : '',
    section: '',
    email: '',
      password: 'Brij@1234',
  });
const [formErrors, setFormErrors] = useState<{
  name?: string;
  class?: string;
  section?: string;
  email?: string;
}>({});
const validateForm = () => {
    const errors: { name?: string; class?: string; section?: string; email?: string } = {};
  if (!formInput.name.trim()) {
  errors.name = 'Name is required';
} else if (!/^[A-Za-z\s]+$/.test(formInput.name)) {
  errors.name = 'Only letters and spaces are allowed';
} else if (formInput.name.trim().length < 3) {
  errors.name = 'Name must be at least 3 characters long';
}
  if (!formInput.class.trim()) errors.class = 'Class is required';
  if (!formInput.section.trim()) errors.section = 'Section is required';
  if (!formInput.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formInput.email)) errors.email = 'Invalid email';

  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  const handleToggle = () => setShowForm(prev => !prev);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormInput({
      ...formInput,
      [e.target.name]: e.target.value,
    });
  };

const handleInvite = async (e: React.FormEvent) => {
  e.preventDefault();
   if (!validateForm()) return;
  try {
   await axios.post('http://localhost:3000/login/postLogin', formInput);
    const res =  await axios.post('http://localhost:3000/login/api/send-invite', formInput);
    alert('Invite sent! Check teacher inbox.');
  } catch (err) {
    alert('Failed to send invite');
  }
  handleToggle();
};
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, studentRes] = await Promise.all([
          axios.get('http://localhost:3000/login/getAdmin'),
          axios.get('http://localhost:3000/login/getStudent')
        ]);

        const teachers: Teacher[] = teacherRes.data;
        const students: Student[] = studentRes.data;
             setStudents(students);

        const studentCounts: Record<string, number> = {};
        students.forEach((student) => {
          if (student.class && student.section) {
            const key = `${student.class}-${student.section}`;
            studentCounts[key] = (studentCounts[key] || 0) + 1;
          }
        });

        const grouped: Record<string, Teacher[]> = {};
        teachers.forEach((teacher) => {
          if (teacher.class && teacher.class.trim() !== '') {
            const key = teacher.class;
            const countKey = `${teacher.class}-${teacher.section}`;
            const studentCount = studentCounts[countKey] || 0;

            const teacherWithCount: Teacher = {
              ...teacher,
              studentCount
            };

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(teacherWithCount);
          }
        });

        setTeachersByClass(grouped);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);
const getPassCount = (filtered: Student[], termKey: 'term1' | 'term2' | 'term3') => {
  return filtered.filter((s) => {
    const marks = s.marks?.[termKey];
    if (!marks) return false;

    return Object.values(marks).every((m) => Number(m) >= 35);
  }).length;
};

const getChartData = (term: 'term1' | 'term2' | 'term3', teacher: Teacher) => {
  const filtered = students.filter(
    (s) => s.class === teacher.class && s.section === teacher.section
  );
  const total = filtered.length;
  const passed = getPassCount(filtered, term);
  const failed = total - passed;
console.log(passed,failed);
console.log(`Term: ${term}, Class: ${teacher.class}, Section: ${teacher.section}`);
console.log('Filtered Students:', filtered.length, 'Passed:', passed, 'Failed:', failed);

  return [
    { name: 'Passed', value: passed, total },
    { name: 'Failed', value: failed, total },
  ];
};
const handleAddTeacher = () => {
  // Show form or redirect to add page
  console.log("Add teacher clicked");
};

  return (
    <>
      <h2 className="teacher-main-h2">All Teachers</h2>
       <button className="trigger-invite-btn" onClick={handleToggle}>
  <UserPlus className="icon" style={{ marginRight: '8px' }} />
 
</button>
      <div className="teacher-main">
        {Object.keys(teachersByClass).sort().map((className) => (
          <div key={className} className="class-group">
            <h2 className="class-heading">Class {className}</h2>
            <div className="teacher-container">
              {teachersByClass[className].map((teacher, index) => (
                <div
                  className="teacher-card"
                  key={index}
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <div className="icon-box">
                    <User className="user-icon" />
                  </div>
                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <p>Section: {teacher.section}</p>
                    <p>Students: {teacher.studentCount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overlay */}
      {selectedTeacher && (
        <div className="overlay ov-2">
          
          <div className="overlay-content ov-3">
               <h3 className="chart-row-h2huu">Class Teacher:</h3>
            <button className="close-btn" onClick={() => setSelectedTeacher(null)}>
              <X />
            </button>
            <h2 className="close-btn-sfhg">{selectedTeacher.name}</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="close-btn-dbd">
      <User size={100} color="#666" />
   
    </div>
            {/* <p><strong>Class:</strong> {selectedTeacher.class}</p>
            <p><strong>Section:</strong> {selectedTeacher.section}</p>
            <p><strong>Students:</strong> {selectedTeacher.studentCount}</p> */}
            <div className="chart-row-h2hbehdb">
                <p className="chart-row-h2hbehdbjnefmkfe">Class&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Strength</p>
                  <p className="chart-row-h2hbehdbjn">{selectedTeacher.class} {selectedTeacher.section}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                     {selectedTeacher.studentCount}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </div>
            {/* {selectedTeacher.subject && <p><strong>Subject:</strong> {selectedTeacher.subject}</p>}
            {selectedTeacher.email && <p><strong>Email:</strong> {selectedTeacher.email}</p>}
         
         {selectedTeacher.phone && <p><strong>Phone:</strong> {selectedTeacher.phone}</p>} */
         }
         <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }} className='fbchsbdhd'>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: 12, height: 12, backgroundColor: '#00C49F', marginRight: 6 }} />
    <span>Pass</span>
  </div>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: 12, height: 12, backgroundColor: '#FF8042', marginRight: 6 }} />
    <span>Fail</span>
  </div>
</div>

          </div>
           <h3 className="chart-row-h2">Class Perfomance:

            
           </h3>
           
           <div className="chart-row">
           
    {(['term1', 'term2', 'term3'] as const).map((term) => (
      <div key={term} className="chart-wrapper">
       <PieChart width={150} height={150}>
  <Pie
    data={getChartData(term, selectedTeacher)}
    cx="50%"
    cy="50%"
    innerRadius={40}
    outerRadius={60}
    paddingAngle={5}
    dataKey="value"
  >
    {getChartData(term, selectedTeacher).map((entry, index) => (
      <Cell key={`cell-${index}`} fill={index === 0 ? "#00C49F" : "#FF8042"} />
    ))}
  </Pie>
<Tooltip
  content={({ payload }) => {
    if (!payload || payload.length === 0) return null;

    const { name, value, total } = payload[0].payload;
    if (typeof value !== 'number' || typeof total !== 'number') return null;

    const percentage = ((value / total) * 100).toFixed(1);

    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '5px',
          fontSize: '13px',
        }}
      >
        <strong>{name}</strong>: {percentage}%
      </div>
    );
  }}
/>

  <text
    x={75}
    y={75}
    textAnchor="middle"
    dominantBaseline="middle"
    style={{ fontWeight: 'bold', fontSize: '14px' }}
  >
    {term.toUpperCase()}
  </text>
</PieChart>

      </div>
    ))}
  </div>
        </div>
      )}
      
  {showForm && (
        <div className="invite-overlay">
          <div className="invite-box">
            <h2>Send Teacher Invitation</h2>
            <form onSubmit={handleInvite}>
               <div className="form-group-01">
              <input
                type="text"
                name="name"
                placeholder=" "
                value={formInput.name}
                onChange={handleChange}
                id="username01"
                required
              />
              <label className='sign-label1' htmlFor="username01">Teacher Name </label>
              {formErrors.name && <p className="error-msg ddbhjb">{formErrors.name}</p>}
              </div>
               <div className="form-group-02">
              <input
                type="text"
                name="class"
                placeholder=" "
                value={formInput.class}
                id="username02"
                onChange={handleChange}
                required
              />
               <label className='sign-label1' htmlFor="username02">Class</label>
              </div>
              <div className="form-group-03">
              <input
                type="text"
                name="section"
                placeholder=" "
                value={formInput.section}
                 id="username03"
                onChange={handleChange}
                required
              />
               <label className='sign-label1' htmlFor="username03">Section</label>
              </div>
              <div className="form-group-04">
              <input
                type="email"
                name="email"
                placeholder=" "
                id="username04"
                value={formInput.email}
                onChange={handleChange}
                required
              />
               <label className='sign-label1' htmlFor="username04">Email</label>
              </div>
              <div className="invite-btn-group">
                <button type="submit" className="send-invite-btn">Send Invite</button>
                <button type="button" className="cancel-invite-btn" onClick={handleToggle}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  );
};

export default TeacherList;
