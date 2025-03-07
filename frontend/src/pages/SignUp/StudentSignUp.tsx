import { useState } from 'react';
import { Link } from 'react-router-dom';
import studentIllustration from '../../assets/Brazuca - Catching Up.png';
import brazucaPlanning from '../../assets/Brazuca - Planning.png';
import brazucaSitting from '../../assets/Brazuca - Sitting.png';

const StudentSignUp = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [formData, setFormData] = useState({
    // Slide 1 - Personal Info
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    bio: '',
    // Slide 2 - Education & Skills
    education: '',
    currentProfession: '',
    fieldOfStudy: '',
    skills: [] as string[],
    interests: [] as string[],
    // Slide 3 - Final Details
    photo: '',
    career: '',
    whyOviEdu: '',
    address: '',
    timeZone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentSlide < 3) {
      setCurrentSlide(prev => prev + 1);
    } else {
      console.log('Final submission:', formData);
      alert('Sign up successful! Redirecting to dashboard...');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      const radioInput = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: radioInput.value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillAdd = (skill: string) => {
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleInterestAdd = (interest: string) => {
    if (!formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const handleSkillRemove = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleInterestRemove = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleCareerSelect = (career: string) => {
    setFormData(prev => ({
      ...prev,
      career
    }));
  };

  const handleCareerRemove = () => {
    setFormData(prev => ({
      ...prev,
      career: ''
    }));
  };

  const renderSlide = () => {
    switch (currentSlide) {
      case 1:
        return (
          // Personal Info Form
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Date of Birth<span className="text-ninja-green">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-green text-ninja-white placeholder-ninja-white/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                Gender<span className="text-ninja-green">*</span>
              </label>
              <div className="grid grid-cols-2 md:flex md:gap-6 gap-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                    className="w-4 h-4 text-ninja-green border-ninja-white/10 focus:ring-ninja-green"
                  />
                  <span className="ml-2 text-ninja-white/80">Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                    className="w-4 h-4 text-ninja-green border-ninja-white/10 focus:ring-ninja-green"
                  />
                  <span className="ml-2 text-ninja-white/80">Female</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                    className="w-4 h-4 text-ninja-green border-ninja-white/10 focus:ring-ninja-green"
                  />
                  <span className="ml-2 text-ninja-white/80">Other</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="notDisclose"
                    checked={formData.gender === 'notDisclose'}
                    onChange={handleChange}
                    className="w-4 h-4 text-ninja-green border-ninja-white/10 focus:ring-ninja-green"
                  />
                  <span className="ml-2 text-sm text-ninja-white/80">Not to Disclose</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Phone Number<span className="text-ninja-green">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-ninja-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-green text-ninja-white placeholder-ninja-white/30"
                  placeholder="Enter your phone number (optional)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-ninja-white/80 mb-2">
                Add Bio<span className="text-ninja-green">*</span>
                <span className="float-right text-xs text-ninja-white/40">20,000 Characters</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-green text-ninja-white placeholder-ninja-white/30 min-h-[100px] resize-none"
                placeholder="Tell us about your background, skills, experiences and career aspirations.."
                maxLength={20000}
                required
              />
            </div>

            <div className="flex justify-between items-center pt-4">
              <Link to="/" className="text-ninja-white/60 hover:text-ninja-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </Link>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-ninja-green to-ninja-purple text-ninja-black font-monument rounded-lg hover:from-ninja-purple hover:to-ninja-green transition-all duration-500"
              >
                Next
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8 flex-shrink-0">
              <h1 className="text-3xl font-monument text-ninja-white mb-2">Your Learning Journey Starts Here</h1>
              <p className="text-ninja-white/60">Tell us about your educational backgrounds and aspirations</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 space-y-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Education<span className="text-ninja-orange">*</span>
                  </label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-orange text-ninja-white"
                    required
                  >
                    <option value="">Select your highest educational qualification</option>
                    <option value="high-school">High School</option>
                    <option value="bachelors">Bachelor's Degree</option>
                    <option value="masters">Master's Degree</option>
                    <option value="phd">Ph.D.</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="currentProfession" className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Current Profession<span className="text-ninja-orange">*</span>
                  </label>
                  <select
                    id="currentProfession"
                    name="currentProfession"
                    value={formData.currentProfession}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-orange text-ninja-white"
                    required
                  >
                    <option value="">Select your profession</option>
                    <option value="student">Student</option>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Field of Study<span className="text-ninja-orange">*</span>
                  </label>
                  <select
                    id="fieldOfStudy"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-orange text-ninja-white"
                    required
                  >
                    <option value="">Select your field</option>
                    <option value="computer-science">Computer Science</option>
                    <option value="engineering">Engineering</option>
                    <option value="business">Business</option>
                    <option value="arts">Arts</option>
                    <option value="science">Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Select Your Skills
                    <span className="text-xs text-ninja-white/40 ml-2">Skills are important to suggest mentor</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full border border-ninja-orange text-ninja-white flex items-center gap-2"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleSkillRemove(skill)}
                          className="text-ninja-orange hover:text-ninja-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill"
                      className="flex-1 px-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-orange text-ninja-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            handleSkillAdd(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-ninja-orange text-white rounded-lg"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a skill"]') as HTMLInputElement;
                        if (input.value.trim()) {
                          handleSkillAdd(input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Select Your Interest
                    <span className="text-xs text-ninja-white/40 ml-2">Area of Interest are important to suggest mentor</span>
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.interests.map(interest => (
                      <span
                        key={interest}
                        className="px-4 py-2 rounded-full border border-ninja-orange text-ninja-white flex items-center gap-2"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => handleInterestRemove(interest)}
                          className="text-ninja-orange hover:text-ninja-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an interest"
                      className="flex-1 px-4 py-2 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-orange text-ninja-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            handleInterestAdd(input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-ninja-orange text-white rounded-lg"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add an interest"]') as HTMLInputElement;
                        if (input.value.trim()) {
                          handleInterestAdd(input.value.trim());
                          input.value = '';
                        }
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 pt-4 bg-ninja-black/50 backdrop-blur-sm flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentSlide(1)}
                  className="text-ninja-white/60 hover:text-ninja-white flex items-center gap-1 md:gap-2 text-sm md:text-base"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 md:px-8 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-ninja-green to-ninja-purple text-ninja-black font-monument rounded-lg hover:from-ninja-purple hover:to-ninja-green transition-all duration-500"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col">
            <div className="mb-8 flex-shrink-0">
              <h1 className="text-3xl font-monument text-ninja-white mb-2">Almost There!</h1>
              <p className="text-ninja-white/60">Complete your profile to find the perfect mentor</p>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 space-y-6">
              <div className="space-y-6">
                {/* Photo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Upload Your Photo Here
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-16 h-16 bg-ninja-black/50 border border-ninja-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                      <svg className="w-8 h-8 text-ninja-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="w-full h-24 bg-ninja-black/50 border border-ninja-white/10 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-ninja-white/5 transition-colors">
                        <svg className="w-6 h-6 text-ninja-white/50 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-sm text-ninja-white/60">Click to upload or Drag and Drop</span>
                        <span className="text-xs text-ninja-white/40 mt-1">PNG, IMG, SVG OR GIF(max 400 X 800px)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Selection */}
                <div>
                  <label className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Popular Career to Choose<span className="text-ninja-green">*</span>
                    <span className="text-xs text-ninja-white/40 ml-2">Choose career carefully, To suggest top most mentors based on your career</span>
                  </label>
                  <div className="mb-4">
                    {formData.career && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="px-4 py-2 rounded-full border border-ninja-white/10 text-ninja-white flex items-center gap-2 bg-ninja-black/30">
                          {formData.career}
                          <button 
                            type="button" 
                            onClick={handleCareerRemove}
                            className="text-ninja-white/60 hover:text-ninja-white"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      <button 
                        type="button" 
                        onClick={() => handleCareerSelect('Engineer')}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          formData.career === 'Engineer' 
                            ? 'bg-ninja-green/20 border-ninja-green text-ninja-white' 
                            : 'bg-ninja-black/30 border-ninja-white/10 text-ninja-white/80 hover:bg-ninja-white/5'
                        }`}
                      >
                        Engineer
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleCareerSelect('Scientist')}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          formData.career === 'Scientist' 
                            ? 'bg-ninja-green/20 border-ninja-green text-ninja-white' 
                            : 'bg-ninja-black/30 border-ninja-white/10 text-ninja-white/80 hover:bg-ninja-white/5'
                        }`}
                      >
                        Scientist
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleCareerSelect('Doctor')}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          formData.career === 'Doctor' 
                            ? 'bg-ninja-green/20 border-ninja-green text-ninja-white' 
                            : 'bg-ninja-black/30 border-ninja-white/10 text-ninja-white/80 hover:bg-ninja-white/5'
                        }`}
                      >
                        Doctor
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleCareerSelect('Architect')}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          formData.career === 'Architect' 
                            ? 'bg-ninja-green/20 border-ninja-green text-ninja-white' 
                            : 'bg-ninja-black/30 border-ninja-white/10 text-ninja-white/80 hover:bg-ninja-white/5'
                        }`}
                      >
                        Architect
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleCareerSelect('UI/UX Designer')}
                        className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                          formData.career === 'UI/UX Designer' 
                            ? 'bg-ninja-green/20 border-ninja-green text-ninja-white' 
                            : 'bg-ninja-black/30 border-ninja-white/10 text-ninja-white/80 hover:bg-ninja-white/5'
                        }`}
                      >
                        UI/UX Designer
                      </button>
                    </div>
                  </div>
                </div>

                {/* Why OviEdu */}
                <div>
                  <label htmlFor="whyOviEdu" className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Why do you choose OviEdu? <span className="text-xs text-ninja-white/40">(Optional)</span>
                  </label>
                  <textarea
                    id="whyOviEdu"
                    name="whyOviEdu"
                    value={formData.whyOviEdu}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write in your own words"
                    className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-green text-ninja-white placeholder-ninja-white/30 resize-none"
                  ></textarea>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Address<span className="text-ninja-green">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-ninja-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter your address"
                      className="w-full pl-10 pr-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-green text-ninja-white placeholder-ninja-white/30"
                      required
                    />
                  </div>
                </div>

                {/* Time Zone */}
                <div>
                  <label htmlFor="timeZone" className="block text-sm font-medium text-ninja-white/80 mb-2">
                    Time zone<span className="text-ninja-green">*</span>
                  </label>
                  <div className="text-xs text-ninja-white/40 mb-2">This helps maintain meeting with your mentor in your available time</div>
                  <div className="relative">
                    <select
                      id="timeZone"
                      name="timeZone"
                      value={formData.timeZone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-ninja-black/50 border border-ninja-white/10 rounded-lg focus:outline-none focus:border-ninja-green text-ninja-white appearance-none"
                      required
                    >
                      <option value="">Select your time zone</option>
                      <option value="GMT-12:00">GMT-12:00</option>
                      <option value="GMT-11:00">GMT-11:00</option>
                      <option value="GMT-10:00">GMT-10:00</option>
                      <option value="GMT-09:00">GMT-09:00</option>
                      <option value="GMT-08:00">GMT-08:00</option>
                      <option value="GMT-07:00">GMT-07:00</option>
                      <option value="GMT-06:00">GMT-06:00</option>
                      <option value="GMT-05:00">GMT-05:00</option>
                      <option value="GMT-04:00">GMT-04:00</option>
                      <option value="GMT-03:00">GMT-03:00</option>
                      <option value="GMT-02:00">GMT-02:00</option>
                      <option value="GMT-01:00">GMT-01:00</option>
                      <option value="GMT+00:00">GMT+00:00</option>
                      <option value="GMT+01:00">GMT+01:00</option>
                      <option value="GMT+02:00">GMT+02:00</option>
                      <option value="GMT+03:00">GMT+03:00</option>
                      <option value="GMT+04:00">GMT+04:00</option>
                      <option value="GMT+05:00">GMT+05:00</option>
                      <option value="GMT+05:30">GMT+05:30 (IST)</option>
                      <option value="GMT+06:00">GMT+06:00</option>
                      <option value="GMT+07:00">GMT+07:00</option>
                      <option value="GMT+08:00">GMT+08:00</option>
                      <option value="GMT+09:00">GMT+09:00</option>
                      <option value="GMT+10:00">GMT+10:00</option>
                      <option value="GMT+11:00">GMT+11:00</option>
                      <option value="GMT+12:00">GMT+12:00</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-ninja-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 pt-4 bg-ninja-black/50 backdrop-blur-sm flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={() => setCurrentSlide(2)}
                  className="text-ninja-white/60 hover:text-ninja-white flex items-center gap-1 md:gap-2 text-sm md:text-base"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="px-4 md:px-8 py-2 md:py-3 text-sm md:text-base bg-gradient-to-r from-ninja-green to-ninja-purple text-ninja-black font-monument rounded-lg hover:from-ninja-purple hover:to-ninja-green transition-all duration-500"
                >
                  Complete Sign Up
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-ninja-black flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-7xl">
        {/* Mobile Header - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <Link to="/" className="text-ninja-white/60 hover:text-ninja-white flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h2 className="text-lg font-monument text-ninja-green">Student Sign Up</h2>
          <div className="w-8"></div> {/* Empty div for flex spacing */}
        </div>
        
        <div className="bg-ninja-black/50 backdrop-blur-xl border border-ninja-white/10 rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
            {/* Left Side - Form */}
            <div className="w-full md:w-[55%] p-6 md:p-12 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {/* Mobile Progress Indicator */}
              <div className="flex justify-center mb-4 md:hidden">
                <div className="flex space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 rounded-full ${
                        currentSlide === step 
                          ? 'w-8 bg-ninja-green' 
                          : 'w-4 bg-ninja-white/20'
                      } transition-all duration-300`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="pb-16">
                {renderSlide()}
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden md:flex w-full md:w-[45%] bg-gradient-to-br from-ninja-green/5 to-ninja-purple/5 p-6 md:p-12 items-center justify-center relative overflow-hidden">
              {/* Main illustration */}
              <img
                src={studentIllustration}
                alt="Student"
                className="w-full h-auto max-w-md animate-float relative z-10"
              />
              
              {/* Decorative Brazuca Illustrations */}
              <img
                src={brazucaPlanning}
                alt="Student Planning"
                className="absolute w-24 md:w-32 h-24 md:h-32 top-8 right-8 opacity-100 animate-float-slow transform rotate-6"
                style={{ animationDelay: '-1s' }}
              />
              <img
                src={brazucaSitting}
                alt="Student Sitting"
                className="absolute w-24 md:w-32 h-24 md:h-32 bottom-12 left-12 opacity-100 animate-float-delayed transform -rotate-6"
                style={{ animationDelay: '-2s' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp; 