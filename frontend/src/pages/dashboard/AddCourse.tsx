import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createCourse, CourseData } from '../../services/courseService';

interface AddCourseProps {
  onClose: () => void;
  onCourseAdded: (course: CourseData) => void;
}

const AddCourse: React.FC<AddCourseProps> = ({ onClose, onCourseAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CourseData>({
    title: '',
    description: '',
    thumbnail: '',
    grade: '',
    duration: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.thumbnail || !formData.grade || !formData.duration) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      const newCourse = await createCourse(formData);
      toast.success('Course created successfully!');
      onCourseAdded(newCourse);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ninja-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-monument text-ninja-white">Add New Course</h2>
          <button 
            onClick={onClose}
            className="text-ninja-white/60 hover:text-ninja-white"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ninja-white/80 mb-2">
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
              placeholder="e.g. Introduction to Mathematics"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-ninja-white/80 mb-2">
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
              placeholder="Describe your course..."
              required
            />
          </div>
          
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-ninja-white/80 mb-2">
              Thumbnail URL
            </label>
            <input
              type="url"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Grade Level
              </label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white"
                required
              >
                <option value="" disabled>Select grade level</option>
                <option value="Elementary">Elementary</option>
                <option value="Middle School">Middle School</option>
                <option value="High School">High School</option>
                <option value="College">College</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                placeholder="e.g. 8 weeks"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white/80 hover:text-ninja-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-ninja-purple to-ninja-green text-ninja-black font-monument rounded-lg hover:from-ninja-green hover:to-ninja-purple transition-all duration-500 disabled:opacity-70"
            >
              {isLoading ? 'Creating...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourse; 