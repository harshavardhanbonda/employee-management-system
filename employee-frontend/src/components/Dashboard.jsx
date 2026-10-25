
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const token = sessionStorage.getItem('accessToken');
    const API_URL = 'http://localhost:8080';

    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        salary: '',
        department: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const userEmail = sessionStorage.getItem('userEmail') || 'My Account';

function handleLogout() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userEmail');
    navigate('/login', { replace: true });
}

    // GET: Fetch all employees
    async function fetchEmployees() {
        const response = await fetch(`${API_URL}/employees`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch employees (${response.status})`
            );
        }

        const data = await response.json();
        setEmployees(data);
    }

    useEffect(() => {
        fetchEmployees().catch((err) => {
            setError(err.message);
        });
    }, []);

    // Reset the form
    function resetForm() {
        setFormData({
            name: '',
            email: '',
            salary: '',
            department: ''
        });
        setEditingEmployeeId(null);
        setShowForm(false);
        setError('');
    }

    // POST /employees: Create employee
    // PUT /employees/{id}: Update employee
    async function handleSubmitEmployee(event) {
        event.preventDefault();

        setError('');
        setLoading(true);

        const isEditing = editingEmployeeId !== null;

        const url = isEditing
            ? `${API_URL}/employees/${editingEmployeeId}`
            : `${API_URL}/employees`;

        try {
            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    salary: Number(formData.salary),
                    department: formData.department
                })
            });

            if (!response.ok) {
                const errorMessage = await response.text();

                throw new Error(
                    `Failed to ${isEditing ? 'update' : 'add'} employee ` +
                    `(${response.status}): ${errorMessage}`
                );
            }

            // Refresh the table using the shared GET function
            await fetchEmployees();
            resetForm();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Open form with the selected employee's details
    function handleEditEmployee(employee) {
        setFormData({
            name: employee.name ?? '',
            email: employee.email ?? '',
            salary: employee.salary ?? '',
            department: employee.department ?? ''
        });

        setEditingEmployeeId(employee.id);
        setError('');
        setShowForm(true);
    }

    // DELETE /employee/{id}: Delete employee
    async function handleDeleteEmployee(employee) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${employee.name}?`
        );

        if (!confirmed) {
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/employee/${employee.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorMessage = await response.text();

                throw new Error(
                    `Failed to delete employee (${response.status}): ` +
                    errorMessage
                );
            }

            // Refresh the table after deletion
            await fetchEmployees();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="dashboard-page">
                 {/* Top bar: app name, user email, and logout */}
        <header className="dashboard-topbar">
            <div className="dashboard-brand">
                Employee Management
            </div>

            <div className="dashboard-user">
                <span className="dashboard-user-email">
                    {userEmail}
                </span>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </header>

            {/* Dashboard heading */}
            <section className="employee-section">
                <div className="employee-section-header">
                    <h2>Employees Dashboard</h2>
                </div>
            </section>

            {/* Summary cards */}
            <div className="dashboard-summary">
                <div className="summary-card">
                    <p>Total Employees</p>
                    <h2>{employees.length}</h2>
                </div>

                <div className="summary-card">
                    <p>Departments</p>
                    <h2>
                        {new Set(
                            employees.map(
                                (employee) => employee.department
                            )
                        ).size}
                    </h2>
                </div>
            </div>

            {/* Add employee button */}
            <button
                className="add-employee-button"
                onClick={() => {
                    resetForm();
                    setShowForm(true);
                }}
                disabled={loading}
            >
                + Add Employee
            </button>

            {/* Shared create/update form */}
            {showForm && (
                <form
                    onSubmit={handleSubmitEmployee}
                    className="employee-form"
                >
                    <h3>
                        {editingEmployeeId !== null
                            ? 'Update Employee'
                            : 'Add Employee'}
                    </h3>

                    <input
                        type="text"
                        placeholder="Employee name"
                        value={formData.name}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                name: event.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="email"
                        placeholder="Employee email"
                        value={formData.email}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                email: event.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Salary"
                        min="0"
                        step="any"
                        value={formData.salary}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                salary: event.target.value
                            })
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Department"
                        value={formData.department}
                        onChange={(event) =>
                            setFormData({
                                ...formData,
                                department: event.target.value
                            })
                        }
                        required
                    />

                    {error && (
                        <p className="error-message">{error}</p>
                    )}

                    <button type="submit" disabled={loading}>
                        {loading
                            ? 'Saving...'
                            : editingEmployeeId !== null
                                ? 'Update Employee'
                                : 'Save Employee'}
                    </button>

                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </form>
            )}

            {/* Display errors outside the form */}
            {error && !showForm && (
                <p className="error-message">{error}</p>
            )}

            {/* Employee table */}
            <section className="employee-section">
                <h2>Employees</h2>

                <div className="employee-table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Employee ID</th>
                                <th>Employee Name</th>
                                <th>Employee Email</th>
                                <th>Salary</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {[...employees]
                                    .sort((a, b) => a.id - b.id)
                                    .map((employee) => (
                                <tr key={employee.id}>
                                    <td className="employee-id">
                                        {employee.id}
                                    </td>

                                    <td className="employee-name">
                                        {employee.name}
                                    </td>

                                    <td>{employee.email}</td>

                                    <td className="employee-salary">
                                        ₹
                                        {Number(
                                            employee.salary
                                        ).toLocaleString('en-IN')}
                                    </td>

                                    <td>
                                        <span className="department-badge">
                                            {employee.department}
                                        </span>
                                    </td>

                                    <td>
                                        <select
                                            className="modify-dropdown"
                                            defaultValue=""
                                            disabled={loading}
                                            onChange={(event) => {
                                                const action =
                                                    event.target.value;

                                                event.target.value = '';

                                                if (action === 'update') {
                                                    handleEditEmployee(
                                                        employee
                                                    );
                                                } else if (
                                                    action === 'delete'
                                                ) {
                                                    handleDeleteEmployee(
                                                        employee
                                                    );
                                                }
                                            }}
                                        >
                                            <option value="" disabled>
                                                Modify
                                            </option>

                                            <option value="update">
                                                Update
                                            </option>

                                            <option value="delete">
                                                Delete
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            ))}

                            {employees.length === 0 && (
                                <tr>
                                    <td colSpan="6">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}

export default Dashboard;
