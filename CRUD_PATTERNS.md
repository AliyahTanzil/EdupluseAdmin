# CRUD Patterns & Best Practices

## Overview

This document outlines the standardized CRUD (Create, Read, Update, Delete) patterns used throughout EdupluseAdmin Phase 2. All modules follow these patterns for consistency.

## Pattern Structure

### File Organization

Each module follows this file structure:

```
src/pages/
├── Module.jsx              # List page with read operations
├── AddModule.jsx           # Create form page
├── EditModule.jsx          # Edit form page (if applicable)
└── (optional)
    ├── ModuleDetail.jsx    # Detail/view page
```

### Component Pattern

Every CRUD page follows this state/hook structure:

```javascript
// State for data
const [items, setItems] = useState([]);
const [selectedItem, setSelectedItem] = useState(null);

// State for UI
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(false);

// State for filtering/pagination
const [currentPage, setCurrentPage] = useState(1);
const [filters, setFilters] = useState({});

// Effects for loading
useEffect(() => {
  loadItems();
}, [currentPage, filters]);

// Handler functions
const loadItems = async () => { ... };
const handleCreate = async (data) => { ... };
const handleUpdate = async (id, data) => { ... };
const handleDelete = async (id) => { ... };
```

## 1. READ Pattern (List Page)

### Template: Module.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner, ErrorAlert } from '../components/Shared';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { moduleAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const Module = () => {
  const navigate = useNavigate();
  
  // State Management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const ITEMS_PER_PAGE = 50;

  // Load data on mount and page change
  useEffect(() => {
    loadItems();
  }, [currentPage]);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const response = await moduleAPI.getAll({ 
        limit: ITEMS_PER_PAGE, 
        offset 
      });

      if (response.success) {
        setItems(response.data || []);
        setTotalCount(response.totalCount || 0);
      } else {
        setError(response.message || 'Failed to load data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await moduleAPI.delete(id);

      if (response.success) {
        setSuccess(true);
        await loadItems();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.message || 'Failed to delete record');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading && items.length === 0) {
    return <LoadingSpinner message="Loading data..." />;
  }

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Operation successful!" onClose={() => {}} />}

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Module Name</h1>
          <p className="text-gray-600 mt-2">Manage your records here</p>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2"
          onClick={() => navigate('/add-module')}
        >
          <Plus size={18} />
          Add New
        </Button>
      </div>

      {/* Data Table */}
      <Card>
        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No records found</p>
              <Button
                variant="primary"
                className="mt-4 mx-auto"
                onClick={() => navigate('/add-module')}
              >
                Create First Record
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-800 font-medium">{item.name}</td>
                        <td className="py-3 px-4 text-gray-600">{item.email}</td>
                        <td className="py-3 px-4 text-center space-x-2">
                          <button
                            onClick={() => navigate(`/edit-module/${item.id}`)}
                            className="text-blue-600 hover:text-blue-800 inline-block"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-800 inline-block"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-6 border-t">
                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-gray-600">
                    Page {currentPage} of {totalPages} ({totalCount} total)
                  </span>

                  <Button
                    variant="secondary"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Module;
```

## 2. CREATE Pattern (Add Page)

### Template: AddModule.jsx

```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, ErrorAlert, LoadingSpinner } from '../components/Shared';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { moduleAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const AddModule = () => {
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!formData.name || !formData.email) {
        setError('Please fill all required fields');
        return;
      }

      setLoading(true);
      setError(null);

      const response = await moduleAPI.create(formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/module-list');
        }, 1500);
      } else {
        setError(response.message || 'Failed to create record');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Record created successfully!" onClose={() => {}} />}

      {/* Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/module-list')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Add New Record</h1>
        <p className="text-gray-600 mt-2">Fill in the details below</p>
      </div>

      {/* Form Card */}
      <Card>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Create Record
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/module-list')}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AddModule;
```

## 3. UPDATE Pattern (Edit Page)

### Template: EditModule.jsx

```javascript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ErrorAlert, LoadingSpinner } from '../components/Shared';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { moduleAPI } from '../services/api';
import SuccessAlert from '../components/Shared/SuccessAlert';

const EditModule = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  // Load data on mount
  useEffect(() => {
    loadRecord();
  }, [id]);

  const loadRecord = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await moduleAPI.getById(id);

      if (response.success) {
        setFormData(response.data);
      } else {
        setError(response.message || 'Failed to load record');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (!formData.name || !formData.email) {
        setError('Please fill all required fields');
        return;
      }

      setSaving(true);
      setError(null);

      const response = await moduleAPI.update(id, formData);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/module-list');
        }, 1500);
      } else {
        setError(response.message || 'Failed to update record');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading record..." />;
  }

  return (
    <div>
      {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
      {success && <SuccessAlert message="Record updated successfully!" onClose={() => {}} />}

      {/* Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/module-list')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Edit Record</h1>
        <p className="text-gray-600 mt-2">Update the details below</p>
      </div>

      {/* Form Card */}
      <Card>
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => navigate('/module-list')}
                disabled={saving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EditModule;
```

## 4. DELETE Pattern

Integrated in LIST page with confirmation:

```javascript
const handleDelete = async (id) => {
  // Step 1: Show confirmation
  if (!window.confirm('Are you sure you want to delete this record?')) {
    return;
  }

  try {
    // Step 2: Show loading
    setLoading(true);
    
    // Step 3: Make API call
    const response = await moduleAPI.delete(id);

    // Step 4: Handle response
    if (response.success) {
      setSuccess(true);
      // Step 5: Refresh list
      await loadItems();
      // Step 6: Hide success after timeout
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(response.message || 'Failed to delete record');
    }
  } catch (err) {
    setError(err.message || 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

## Key Design Principles

### 1. Separation of Concerns
- **List Page**: Display, filtering, deletion
- **Add Page**: Form for creation
- **Edit Page**: Form for updates with pre-population

### 2. Consistent State Management
```javascript
loading     // True during data fetch
saving      // True during form submission
error       // Error message display
success     // Success notification
```

### 3. Validation Strategy
- Client-side validation before API call
- Server-side validation handled by API
- Show user-friendly error messages

### 4. User Feedback
- Loading spinners for async operations
- Success alerts on completion
- Error alerts on failure
- Disabled buttons during operations

### 5. Navigation Pattern
- Back buttons on all forms
- Auto-redirect on success
- Clear confirmation dialogs for destructive actions

## Module Checklist

When implementing a new CRUD module:

- [ ] Create `ModuleName.jsx` (List page)
- [ ] Create `AddModuleName.jsx` (Create form)
- [ ] Create `EditModuleName.jsx` (Edit form)
- [ ] Add API service functions to `src/services/api.js`
- [ ] Add routes to `src/App.jsx`
- [ ] Implement pagination (if list > 50 items)
- [ ] Add error handling with ErrorAlert
- [ ] Add success feedback with SuccessAlert
- [ ] Test all CRUD operations
- [ ] Test error scenarios
- [ ] Validate form inputs
- [ ] Add loading states

## Module Examples

Following this pattern, we've successfully implemented:
- ✅ Students (Phase 1)
- ✅ Teachers (Phase 2)
- ✅ Subjects (Phase 2)
- ✅ Courses (Phase 2)
- ✅ Devices (Phase 2)
- ✅ Attendance (Phase 2 - specialized)
- ✅ Timetable (Phase 2 - specialized)
- ✅ Reports (Phase 2 - specialized)
