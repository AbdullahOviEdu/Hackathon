import React, { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { createCourse, CourseData, Slide } from '../../services/courseService';
import { createPortal } from 'react-dom';

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

const Modal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const modalRoot = document.getElementById('modal-root') || document.createElement('div');
  
  useEffect(() => {
    if (!document.getElementById('modal-root')) {
      modalRoot.id = 'modal-root';
      document.body.appendChild(modalRoot);
    }
    return () => {
      if (modalRoot.parentElement && modalRoot.childNodes.length === 0) {
        modalRoot.parentElement.removeChild(modalRoot);
      }
    };
  }, [modalRoot]);

  return createPortal(children, modalRoot);
};

const AddCourse: React.FC<AddCourseProps> = ({ onClose, onCourseAdded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CourseData>(initialFormState);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const validateSlides = useCallback(() => {
    for (let i = 0; i < formData.slides.length; i++) {
      const slide = formData.slides[i];
      if (!slide.image || !slide.description) {
        toast.error(`Please fill in all fields for slide ${i + 1}`);
        return false;
      }
      const words = slide.description.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length < 300) {
        toast.error(`Description for slide ${i + 1} must be at least 300 words (currently ${words.length} words)`);
        return false;
      }
    }
    return true;
  }, [formData.slides]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.thumbnail || !formData.grade || !formData.duration) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateSlides()) {
      return;
    }
    
    try {
      setIsLoading(true);
      const newCourse = await createCourse(formData);
      toast.success('Course created successfully!');
      onCourseAdded(newCourse);
      setIsClosing(true);
      setTimeout(() => onClose(), 300);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
      setIsLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    if (isLoading) return;
    
    const hasUnsavedChanges = formData.title || formData.description || formData.thumbnail || 
      formData.slides.some(slide => slide.image || slide.description);
    
    if (hasUnsavedChanges) {
      if (window.confirm('Are you sure you want to close? All changes will be lost.')) {
        setIsClosing(true);
        setTimeout(() => onClose(), 300);
      }
    } else {
      setIsClosing(true);
      setTimeout(() => onClose(), 300);
    }
  }, [formData, isLoading, onClose]);

  // Prevent scrolling of the background when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <Modal>
      <div 
        className={`fixed inset-0 bg-ninja-black/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div 
          ref={modalRef}
          className={`bg-ninja-black/95 border border-ninja-white/10 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-transform duration-300 ${
            isClosing ? 'scale-95' : 'scale-100'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-monument text-ninja-white">Add New Course</h2>
            <button 
              onClick={handleClose}
              className="text-ninja-white/60 hover:text-ninja-white"
              type="button"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                  className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                  placeholder="e.g. 8 weeks"
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
                      className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                      placeholder="https://example.com/slide-image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                      Description (minimum 300 words)
                    </label>
                    <textarea
                      value={slide.description}
                      onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-purple text-ninja-white placeholder-ninja-white/30"
                      placeholder="Enter a detailed description for this slide (minimum 300 words)..."
                    />
                    <div className="mt-2 text-xs text-ninja-white/60">
                      Word count: {slide.description.trim().split(/\s+/).filter(word => word.length > 0).length}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleClose}
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
    </Modal>
  );
};

export default AddCourse; 