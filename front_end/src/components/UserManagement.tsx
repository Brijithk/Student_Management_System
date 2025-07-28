import React, { useState, useEffect } from 'react';
import '../css/UserManagemet.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { MoreVertical, ChevronDown, User } from 'lucide-react';
import { Search } from 'lucide-react'; 
// import Select from 'react-select';
import Select, { components } from 'react-select';
import { UserPlus } from 'lucide-react';
import { X } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";


interface UserData {
  roll: string;
  username: string;
  class: string;
  gender: string;
  section: string;
  classTeacher: string;
  marks: {
    term1: {
      english: string;
      computer: string;
      maths: string;
    };
    term2: {
      english: string;
      computer: string;
      maths: string;
    };
    term3: {
      english: string;
      computer: string;
      maths: string;
    };
  };
}

const UserManagement = () => {
  const { classId } = useParams();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [userList, setUserList] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [filterByRank, setFilterByRank] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const usersPerPage = 7;
  const navigate = useNavigate();
const [searchTerm, setSearchTerm] = useState('');
// const [selectedSection, setSelectedSection] = useState<string | null>(null);
const [selectedSection, setSelectedSection] = useState('');
const [showAddOverlay, setShowAddOverlay] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);

   const loggedInTeacher = {
  name: "Ms. Priya",
  class: "10",
  section: "A"
};
const [newStudent, setNewStudent] = useState({
  roll: '',
  username: '',
  class: loggedInTeacher.class,
  gender: '',
  section: loggedInTeacher.section,
  classTeacher: loggedInTeacher.name,
  marks: {
    term1: {
      english: '',
      computer: '',
      maths: ''
    },
    term2: {
      english: '',
      computer: '',
      maths: ''
    },
    term3: {
      english: '',
      computer: '',
      maths: ''
    }
  }
});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get<UserData[]>(`http://localhost:3000/login/getStudent`);
const filtered = res.data.filter(user => user.class === classId?.replace('class', ''));
setUserList(filtered);
           

      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [classId]);
   const uniqueSections = Array.from(new Set(userList.map(user => user.section))).sort();   
//   useEffect(() => {
//   if (uniqueSections.length > 0 && !selectedSection) {
//     setSelectedSection(uniqueSections[0]);
//   }
// }, [uniqueSections, selectedSection]);

   
  const deleteUser = async (roll: string) => {
    try {
      await axios.delete(`http://localhost:3000/login/deleteStudent?roll=${roll}`);
      const updatedUsers = userList.filter(user => user.roll !== roll);
      setUserList(updatedUsers);
      alert("User deleted from DB successfully");
    } catch (error) {
      alert("Failed to delete user.");
    }
  };
const sectionOptions = [
  { value: '', label: 'All Sections' }, // Default option
  ...uniqueSections.map(section => ({
    value: section,
    label: `Section ${section}`,
  })),
];

const customComponents = {
  IndicatorSeparator: () => null, // removes the vertical line
};

  const checkPassFail = (mark: number) => (mark >= 40 ? 'Pass' : 'Fail');



const filteredUsers = userList.filter(user =>
  (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
   user.roll.toLowerCase().includes(searchTerm.toLowerCase())) &&
  (!selectedSection || user.section === selectedSection)
);



const rankedUserList = filteredUsers.map(user => {
  const term1Marks = user.marks?.term1 || {};
  const total = Object.values(term1Marks).reduce((acc, mark) => acc + Number(mark), 0);
  const isPass = Object.values(term1Marks).every(mark => Number(mark) >= 40);
  return { ...user, total, isPass };
});

const sortedUsers = filterByRank
  ? [
      ...rankedUserList.filter(u => u.isPass).sort((a, b) => b.total - a.total),
      ...rankedUserList.filter(u => !u.isPass).sort((a, b) => b.total - a.total),
    ]
  : [...rankedUserList].reverse();


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  const openOverlay = (user: UserData) => {
    setSelectedUser(user);
    setShowOverlay(true);
  };

  const closeOverlay = () => {
    setShowOverlay(false);
  };
const handleSubmitStudent = async (e: React.FormEvent) => {

 e.preventDefault();
try {
  if (isEditMode) {
    // Update existing user
    console.log("we are on edit");
    await axios.patch(`http://localhost:3000/login/updateStudent?roll=${newStudent.roll}`, newStudent);
    console.log(newStudent.roll)
    const updatedList = userList.map(u => u.roll === newStudent.roll ? newStudent : u);
    setUserList(updatedList);
    alert("Student updated successfully!");
  } else {
    // Add new user
    console.log("we are on add");
    await axios.post('http://localhost:3000/login/addStudent', newStudent);
    setUserList(prev => [...prev, newStudent]);
    alert("Student added successfully!");
  }

  setShowAddOverlay(false);
  setIsEditMode(false);
  setNewStudent({
    roll: '',
    username: '',
    class: classId?.replace('class', '') || '',
    gender: '',
    section: '',
    classTeacher: '',
    marks: {
      term1: { english: '', computer: '', maths: '' },
      term2: { english: '', computer: '', maths: '' },
      term3: { english: '', computer: '', maths: '' }
    }
  });
} catch (error) {
  console.error(error);
  alert(isEditMode ? "Failed to update student." : "Failed to add student.");
}

};
      
const prepareLineChartData = () => {
  const term1 = (selectedUser?.marks?.term1 as any) || {};
  const term2 = (selectedUser?.marks?.term2 as any) || {};
  const term3 = (selectedUser?.marks?.term3 as any) || {};

  return Object.keys(term1).map((subject) => ({
    subject,
    Term1: Number(term1[subject]),
    Term2: Number(term2[subject]),
    Term3: Number(term3[subject]),
  }));
};

// const radarData = prepareRadarChartData();
const data = prepareLineChartData();
  return (
    <>
    <div className="user-management-main-container">
      <h1>Student Management - {classId}</h1>
      <div className='user-right-side'>
           <div className='pd-align'>
              <h3 className='um-002'>Student Records</h3>
       
<div className="search-bar um-00">
  <Search size={18} className="search-icon" />
  <input
    type="text"
    placeholder="Search by name or id"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
</div>
  <h3 className="um-001">sort by:</h3>
   <div className={`rank-toggle um-01 ${filterByRank ? 'active' : ''}`} onClick={() => setFilterByRank(prev => !prev)}>
          {filterByRank ? 'Default View' : 'Rank by Marks'}
          <ChevronDown size={18} style={{ marginLeft: '6px' }} />
        </div>
     {/* <div className="section-dropdown-container "> */}
  
<Select
  options={sectionOptions}
  value={sectionOptions.find(option => option.value === selectedSection)}
  onChange={(option) => setSelectedSection(option?.value || '')}
  classNamePrefix="custom"
  isSearchable={false}
  components={customComponents}
  styles={{
    container: (base) => ({
      ...base,
      width: '180px',
      
    }),
    control: (base) => ({
      ...base,
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      boxShadow: 'none',
      background:'#f2f4f7',
      border:"none",
      borderRadius:"25px",
    }),
    valueContainer: (base) => ({
      ...base,
      height: '100%',
      padding: '0 0px',
      display: 'flex',
      alignItems: 'center',
    }),
    singleValue: (base) => ({
      ...base,
      fontSize: '14px',
      color: '#333',
      display: 'flex',
      alignItems: 'center',
      fontWeight:'500',
      
      height: '100%',
      transform:'translate(21px,-15px)'
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: '14px',
      color: 'gray',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: '100%',
      display: 'flex',
      alignItems: 'center',
    }),
  }}
/>


{/* <button className="add-student-btn" onClick={() => setShowAddOverlay(true)}>+ Add Student</button> */}

{/* </div> */}



                  </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>Student id</th>
              <th>Name</th>
                <th>Section</th>
              <th>Total</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map(user => {
              const term1Marks = user.marks?.term1 || {};
              const totalMarks = Object.values(term1Marks).reduce((acc, mark) => acc + Number(mark), 0);
              const average = totalMarks / Object.keys(term1Marks).length;
              let grade = '';
              if (average >= 90) grade = 'A';
              else if (average >= 80) grade = 'B';
              else if (average >= 70) grade = 'C';
              else if (average >= 60) grade = 'D';
              else grade = 'F';

              const isPass = Object.values(term1Marks).every(mark => Number(mark) >= 40);
              const status = isPass ? 'Pass' : 'Fail';

              const toggleMenu = (roll: string) => {
                setActiveMenu(prev => (prev === roll ? null : roll));
              };

              return (
                <tr key={user.roll}>
                  <td className='td1'>{user.roll}</td>
                  <td className='td1'>{user.username}</td>
                   <td>{user.section}</td>
                  <td>{totalMarks}</td>
                  <td>{grade}</td>
                  <td>
                    <span className={`status-badge ${status === 'Pass' ? 'pass-badge' : 'fail-badge'}`}>{status}</span>
                  </td>
                  <td>
                    <div className="action-container">
                      <MoreVertical size={20} style={{ cursor: 'pointer' }} onClick={() => toggleMenu(user.roll)} />
                      {activeMenu === user.roll && (
                        <div className="dropdown-menu">
                          <div onClick={() => { openOverlay(user); setActiveMenu(null); }}>View</div>
                          <div onClick={() => {
  setNewStudent(user); // Fill form with user details
  setIsEditMode(true); // Enable edit mode
  setShowAddOverlay(true); // Open overlay
  setActiveMenu(null);
}}>
  Edit
                 </div>

                          <div onClick={() => { deleteUser(user.roll); setActiveMenu(null); }}>Delete</div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="modern-pagination um-201">
          <span className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(prev => prev - 1);
              setPageInput(String(currentPage - 1));
            }
          }}>
            &lt; Prev
          </span>

          <div className="pagination-info">
            Page
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const pageNumber = Number(pageInput);
                  if (pageNumber >= 1 && pageNumber <= totalPages) {
                    setCurrentPage(pageNumber);
                  }
                }
              }}
              onBlur={() => {
                const pageNumber = Number(pageInput);
                if (pageNumber >= 1 && pageNumber <= totalPages) {
                  setCurrentPage(pageNumber);
                } else {
                  setPageInput(String(currentPage));
                }
              }}
              className="pagination-input-number"
            />
            of {totalPages}
          </div>

          <span className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage(prev => prev + 1);
              setPageInput(String(currentPage + 1));
            }
          }}>
            Next &gt;
          </span>
        </div>
      </div>

     
    </div>
     {showOverlay && selectedUser && (
        <div className="overlay">
          <div className="overlay-content">
            {/* <h2>Marking List - {selectedUser.username}</h2> */}
             <div className='overlay-contentffe'>
                     <h2>Student info :</h2>
                     <X 
              size={24} 
              className="close-btn01" 
              style={{ cursor: 'pointer',backgroundColor:'white' }}
               stroke="black"
                strokeWidth={1.5} 
              onClick={closeOverlay} 
            /></div>
            
                  <div className="user-info-container">
                    <div className="user-icon">
                     <User size={60} strokeWidth={1.5} color="#6B7280" />
               </div>
                    <div className="user-details">
                  <p className="user-details1"><b>Roll&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</b> {selectedUser?.roll}</p>
                  
                <p className="user-details2"><b>Name&nbsp;&nbsp;&nbsp;:</b> {selectedUser?.username}</p>
                <p className="user-details3"><b>Gender :</b> {selectedUser?.gender}</p>
                </div>
               
                </div>
                 <h2 className='sdhdyb'>Performance :</h2>
           <ResponsiveContainer width="100%" height={150}>
             <LineChart data={data} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
               <CartesianGrid stroke="#ccc" />
               <XAxis dataKey="subject" />
              <YAxis domain={['dataMin - 15', 'dataMax +5']} />
              <YAxis domain={[(dataMin: number) => Math.max(0, dataMin - 5), 100]} />
           
               <Tooltip />
               <Legend wrapperStyle={{
               marginLeft: '35px',
             }}/>
               
               <Line type="monotone" dataKey="Term1" stroke="#ff7f50" strokeWidth={2} />
               <Line type="monotone" dataKey="Term2" stroke="#6a5acd" strokeWidth={2} />
               <Line type="monotone" dataKey="Term3" stroke="#20b2aa" strokeWidth={2} />
              
             </LineChart>
           </ResponsiveContainer>
            
          </div>
        </div>
      )}
      {showAddOverlay && (
  <div className="overlay1">
    <div className="overlay1-content">
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  <User size={24} />
  {isEditMode ? 'Edit Student' : 'Add New Student'}
</h2>

     <form onSubmit={handleSubmitStudent}>

        
          <div className="input-row">
  <div className="input-field">
    <label htmlFor="roll">Roll No</label>
    <input
      type="text"
      id="roll"
      value={newStudent.roll}
      onChange={(e) => setNewStudent({ ...newStudent, roll: e.target.value })}
    />
  </div>

  <div className="input-field">
    <label htmlFor="username">Name</label>
    <input
      type="text"
      id="username"
      value={newStudent.username}
      onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
    />
  </div>
</div>

        <div className="row-inputs">
  <div className="input-group">
    <label>Class</label>
    <input
      type="text"
      placeholder="Class"
      value={newStudent.class}
      readOnly
    />
  </div>

  <div className="input-group">
    <label>Section</label>
    <input
      type="text"
      placeholder="Section"
        value={newStudent.section}
      
      readOnly
    />
  </div>

  <div className="input-group">
    <label>Class Teacher</label>
    <input
      type="text"
      placeholder="Class Teacher"
        value={newStudent.classTeacher}
      
      readOnly
    />
  </div>
</div>

          <div className="input-field">

  <div className="gender-toggle">
      <label>Gender</label>
    <button
      type="button"
      className={newStudent.gender === 'Male' ? 'selected' : ''}
   
      onClick={() => setNewStudent({ ...newStudent, gender: 'Male' })}
    >
      Male
    </button>
    <button
      type="button"
      className={newStudent.gender === 'Female' ? 'selected' : ''}
     
      onClick={() => setNewStudent({ ...newStudent, gender: 'Female'})}
    >
      Female
    </button>
  </div>
</div>

   
        
   <h4>Term 1 : <span className='um-e1'>
   
    English
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Computer
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Maths</span>
    </h4>
   {/* term1 original */}
                 <div className="term-marks-row">
  <div className="term-pair">
    {/* <label className='um-e1'>English</label> */}
    <input
      type="number"
     
      value={newStudent.marks.term1.english}
      
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term1: {
              ...newStudent.marks.term1,
              english: e.target.value,
            },
          },
        })
      }
    />
  </div>

  <div className="term-pair">
    {/* <label>Computer</label> */}
    <input
      type="number"
      value={newStudent.marks.term1.computer}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term1: {
              ...newStudent.marks.term1,
              computer: e.target.value,
            },
          },
        })
      }
    />
  </div>

  <div className="term-pair">
    {/* <label>Maths</label> */}
    <input
      type="number"
      value={newStudent.marks.term1.maths}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term1: {
              ...newStudent.marks.term1,
              maths: e.target.value,
            },
          },
        })
      }
    />
  </div>
</div>

   {/* term1 original */}


  
<h4>Term 2 :<span className='um-e1'>
 
    English
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Computer
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Maths</span>
</h4>
<div className="term-marks-row">
  <div className="term-pair">
    {/* <label className='um-e1'>English</label> */}
    <input
      type="number"
      value={newStudent.marks.term2.english}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term2: {
              ...newStudent.marks.term2,
              english: e.target.value,
            },
          },
        })
      }
    />
  </div>

  <div className="term-pair">
    {/* <label>Computer</label> */}
    <input
      type="number"
      value={newStudent.marks.term2.computer}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term2: {
              ...newStudent.marks.term2,
              computer: e.target.value,
            },
          },
        })
      }
    />
  </div>

  <div className="term-pair">
    {/* <label>Maths</label> */}
    <input
      type="number"
      value={newStudent.marks.term2.maths}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term2: {
              ...newStudent.marks.term2,
              maths: e.target.value,
            },
          },
        })
      }
    />
  </div>
</div>


<h4>Term 3 :
  
   <span className='um-e1'> English
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Computer
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    Maths</span>
</h4>
{/* term3 original */}
<div className="term-marks-row">
  <div className="term-pair">
    {/* <label className='um-e1'>English</label> */}
    <input
      type="number"
      value={newStudent.marks.term3.english}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term3: {
              ...newStudent.marks.term3,
              english: e.target.value,
            },
          },
        })
      }
    />
  </div>

  <div className="term-pair">
    {/* <label>Computer</label> */}
    <input
      type="number"
      value={newStudent.marks.term3.computer}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term3: {
              ...newStudent.marks.term3,
              computer: e.target.value,
            },
          },
        })
      }
    />
  </div>

  <div className="term-pair">
    {/* <label>Maths</label> */}
    <input
      type="number"
      value={newStudent.marks.term3.maths}
      onChange={(e) =>
        setNewStudent({
          ...newStudent,
          marks: {
            ...newStudent.marks,
            term3: {
              ...newStudent.marks.term3,
              maths: e.target.value,
            },
          },
        })
      }
    />
  </div>
</div>

{/* term3 original */}




    <div className="button-row">
  <button type="submit">Update Student</button>
  <button type="button" onClick={() => setShowAddOverlay(false)}>Cancel</button>
</div>

      </form>
    </div>
  </div>
)}

    </>
  );
};

export default UserManagement;
