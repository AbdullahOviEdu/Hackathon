import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createCourse, CourseData, Slide } from '../../services/courseService';

interface AddCourseProps {
  onClose: () => void;
  onCourseAdded: (course: CourseData) => void;
}

const initialFormState: CourseData = {
  title: '',
  description: '',
  thumbnail: '',
  grade: '',
  duration: '',
  slides: [
    { image: '', description: '' },
    { image: '', description: '' },
    { image: '', description: '' }
  ]
};

const AddCourse: React.FC<AddCourseProps> = ({ onClose, onCourseAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CourseData>(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSlideChange = (index: number, field: keyof Slide, value: string) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) => 
        i === index ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    
    try {
      setIsLoading(true);
      console.log("Creating course...");
      const newCourse = await createCourse(formData);
      console.log("Course created successfully", newCourse);
      toast.success('Course created successfully!');
      onCourseAdded(newCourse);
      onClose();
    } catch (error) {
      console.error("Error creating course:", error);
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-monument text-ninja-white">Add New Course</h2>
          <button 
            onClick={onClose}
            className="text-ninja-white/60 hover:text-ninja-white"
            type="button"
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
              className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
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
              className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
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
              className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
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
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
                required
              >
                <option value="">Select grade level</option>
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
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
                placeholder="e.g. 8 weeks"
                required
              />
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-lg font-monument text-ninja-white">Course Slides</h3>
            {formData.slides.map((slide, index) => (
              <div key={index} className="p-6 border border-ninja-white/10 rounded-lg space-y-4">
                <h4 className="text-ninja-white font-medium">Slide {index + 1}</h4>
                <div>
                  <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={slide.image}
                    onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                    className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
                    placeholder="https://example.com/slide-image.jpg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Description
                  </label>
                  <textarea
                    value={slide.description}
                    onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg text-ninja-white"
                    placeholder="Enter a detailed description for this slide..."
                    required
                  />
                </div>
              </div>
            ))}
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