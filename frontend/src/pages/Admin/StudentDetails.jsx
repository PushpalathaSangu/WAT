import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Select, Spin, message, Typography, Card, Space, Row, Col } from 'antd';
import { FaBars, FaArrowLeft } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';

const { Title, Text } = Typography;
const { Option } = Select;

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [availableYears, setAvailableYears] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4000/student/all');
        setStudents(response.data.students);

        // Extract unique years from student data
        const years = [...new Set(response.data.students.map(student => student.year))].sort();
        setAvailableYears(years);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load student data');
        message.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchAllStudents();
  }, []);

  // Filter students based on selected year
  const filteredStudents = selectedYear === 'all' 
    ? students 
    : students.filter(student => student.year === selectedYear);

  // Columns for students table
  const studentColumns = [
    {
      title: 'Student ID',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a, b) => a.studentId.localeCompare(b.studentId),
      responsive: ['sm'],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <a href={`/students/${record._id}`}>{text}</a>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      sorter: (a, b) => a.rollNumber.localeCompare(b.rollNumber),
      responsive: ['lg'],
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      filters: availableYears.map(year => ({ text: year, value: year })),
      onFilter: (value, record) => record.year === value,
      responsive: ['sm'],
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      render: semester => semester ? semester.replace('sem', 'Semester ') : 'N/A',
      responsive: ['lg'],
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
      responsive: ['md'],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      responsive: ['lg'],
    },
    {
      title: 'WAT Submissions',
      key: 'watCount',
      render: (_, record) => record.watMarks ? record.watMarks.length : 0,
      sorter: (a, b) => (a.watMarks?.length || 0) - (b.watMarks?.length || 0),
      responsive: ['lg'],
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Top Bar */}
      <div className="md:hidden p-4 bg-white shadow flex justify-between items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-blue-600 text-2xl"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        <h1 className="text-blue-600 font-bold text-lg">Student Details</h1>
        <div className="w-6"></div> {/* Spacer for alignment */}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={
            `fixed inset-y-0 left-0 z-30 w-64 bg-blue-600 shadow-md transform
            md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
          }
        >
          <AdminSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Overlay with professional blue-gray color */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-blue-gray-800 bg-opacity-30 backdrop-blur-sm z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <Text type="danger">{error}</Text>
            </div>
          ) : (
            <div className="max-w-full">
              <Card title="All Students" style={{ marginBottom: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row
                    gutter={[16, 16]}
                    justify="space-between"
                    align="middle"
                    wrap
                  >
                    <Col xs={24} sm={12} md={16}>
                      <Title level={4} style={{ margin: 0 }}>Student Records</Title>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <Select
                        defaultValue="all"
                        style={{ width: '100%', minWidth: 150 }}
                        onChange={setSelectedYear}
                        optionFilterProp="children"
                        showSearch
                        filterOption={(input, option) =>
                          option.children.toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Option value="all">All Years</Option>
                        {availableYears.map(year => (
                          <Option key={year} value={year}>Year {year}</Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>

                  <Table
                    columns={studentColumns}
                    dataSource={filteredStudents}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 'max-content' }}
                    bordered
                    summary={() => (
                      <Table.Summary fixed>
                        <Table.Summary.Row>
                          <Table.Summary.Cell colSpan={5}>
                            <Text strong>Total Students:</Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell>
                            <Text strong>{filteredStudents.length}</Text>
                          </Table.Summary.Cell>
                        </Table.Summary.Row>
                      </Table.Summary>
                    )}
                  />
                </Space>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDetails;