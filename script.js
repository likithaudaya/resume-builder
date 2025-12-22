// Global variables
let workExperienceCount = 0;
let educationCount = 0;
let projectCount = 0;
let personalSkillCount = 0;
let professionalSkillCount = 0;
let technicalSkillCount = 0;
let interestCount = 0;
let certificationCount = 0;

// Theme settings
let currentTheme = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    primaryColor: '#2563eb'
};

// Initialize on page load (handled once at top of file)

// Load theme from local storage
function loadThemeFromStorage() {
    const saved = sessionStorage.getItem('resumeBuilderTheme');
    if (saved) {
        currentTheme = JSON.parse(saved);
        document.getElementById('fontFamily').value = currentTheme.fontFamily;
        document.getElementById('fontSize').value = currentTheme.fontSize;
        document.getElementById('themeColor').value = currentTheme.primaryColor;
        applyTheme();
    }
}

// Save theme to storage
function saveThemeToStorage() {
    sessionStorage.setItem('resumeBuilderTheme', JSON.stringify(currentTheme));
}

// Apply theme
function applyTheme() {
    const preview = document.getElementById('resumePreview');
    if (preview) {
        preview.style.setProperty('--resume-font-family', currentTheme.fontFamily);
        preview.style.setProperty('--resume-font-size', currentTheme.fontSize);
        preview.style.setProperty('--resume-primary-color', currentTheme.primaryColor);
    }
    
    // Update section headers color
    document.querySelectorAll('.section-header h3').forEach(h3 => {
        h3.style.color = currentTheme.primaryColor;
    });
    
    document.querySelectorAll('.btn-icon, .btn-icon-sm').forEach(btn => {
        btn.style.color = currentTheme.primaryColor;
    });
}

// Update theme
function updateTheme() {
    currentTheme.fontFamily = document.getElementById('fontFamily').value;
    currentTheme.fontSize = document.getElementById('fontSize').value;
    currentTheme.primaryColor = document.getElementById('themeColor').value;
    
    applyTheme();
    saveThemeToStorage();
    generatePreview();
}

// Theme panel controls
document.getElementById('themeBtn').addEventListener('click', function() {
    document.getElementById('themeModal').classList.add('show');
});

function closeThemePanel() {
    document.getElementById('themeModal').classList.remove('show');
}

// Make theme panel draggable
function setupDraggableThemePanel() {
    const modal = document.getElementById('themeModal');
    const panel = document.querySelector('.theme-panel');
    const header = document.querySelector('.theme-header');
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target === header || header.contains(e.target)) {
            if (e.target.classList.contains('btn-close-modal') || e.target.closest('.btn-close-modal')) {
                return;
            }
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            panel.classList.add('dragging');
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            
            panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }
    
    function dragEnd() {
        isDragging = false;
        panel.classList.remove('dragging');
    }
}

// Preview controls
document.getElementById('previewBtn').addEventListener('click', togglePreview);

function togglePreview() {
    const formSection = document.getElementById('formSection');
    const previewSection = document.getElementById('previewSection');
    const previewText = document.getElementById('previewText');
    
    if (previewSection.classList.contains('show')) {
        previewSection.classList.remove('show');
        formSection.classList.remove('with-preview');
        previewText.textContent = 'Show Preview';
    } else {
        previewSection.classList.add('show');
        formSection.classList.add('with-preview');
        previewText.textContent = 'Hide Preview';
        generatePreview();
    }
}

// Validation
function setupValidation() {
    const inputs = {
        name: /^[a-zA-Z\s]*$/,
        email: /^[^\s@]*@?[^\s@]*\.?[^\s@]*$/,
        phone: /^[0-9+\-\s()]*$/,
        linkedin: /.*/,
        github: /.*/
    };
    
    Object.keys(inputs).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                validateInput(input, inputs[id]);
            });
            
            input.addEventListener('blur', function() {
                strictValidate(input, id);
            });
        }
    });
}

function validateInput(input, pattern) {
    if (!input.value) {
        input.classList.remove('error');
        const errorDiv = input.closest('.input-with-clear').nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
        return true;
    }
    
    if (!pattern.test(input.value)) {
        input.classList.add('error');
        return false;
    } else {
        input.classList.remove('error');
        const errorDiv = input.closest('.input-with-clear').nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
        return true;
    }
}

function strictValidate(input, type) {
    const value = input.value.trim();
    if (!value) return true;
    
    const validations = {
        name: /^[a-zA-Z\s]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9+\-\s()]+$/,
        linkedin: /linkedin\.com|^https?:\/\//,
        github: /github\.com|^https?:\/\//
    };
    
    if (validations[type] && !validations[type].test(value)) {
        input.classList.add('error');
        const messages = {
            name: 'Name should contain only letters',
            email: 'Enter a valid email address',
            phone: 'Enter a valid phone number',
            linkedin: 'Enter a valid LinkedIn URL',
            github: 'Enter a valid GitHub URL'
        };
        const errorDiv = input.closest('.input-with-clear').nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = messages[type];
        }
        return false;
    }
    
    input.classList.remove('error');
    const errorDiv = input.closest('.input-with-clear').nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = '';
    }
    return true;
}

function clearField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = '';
        field.classList.remove('error');
        const errorDiv = field.closest('.input-with-clear')?.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
    }
}

// Photo upload
function setupPhotoUpload() {
    document.getElementById('photoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should be less than 2MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('photoPreview');
                preview.innerHTML = `
                    <div style="position: relative; display: inline-block;">
                        <img src="${e.target.result}" alt="Profile">
                        <button class="photo-remove" onclick="removePhoto()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        }
    });
}

function removePhoto() {
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('photoUpload').value = '';
}

// Work Experience
function addWorkExperience() {
    workExperienceCount++;
    const container = document.getElementById('workExperienceContainer');
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.id = `work-${workExperienceCount}`;
    item.setAttribute('data-index', workExperienceCount);
    item.innerHTML = `
        <button class="remove-item" onclick="removeItem('work-${workExperienceCount}')">
            <i class="fas fa-times"></i> Remove
        </button>
        <div class="mb-3">
            <label class="form-label">Company Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control work-company" placeholder="Company Name" data-tooltip="Enter company name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control work-start" onchange="calculateWorkDuration('work-${workExperienceCount}')" data-tooltip="Select start date">
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">End Date (Leave empty for present)</label>
                <input type="date" class="form-control work-end" onchange="calculateWorkDuration('work-${workExperienceCount}')" data-tooltip="Select end date or leave empty">
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Job Title</label>
            <div class="input-with-clear">
                <input type="text" class="form-control work-title" placeholder="Job Title" data-tooltip="Enter your job title">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="duration-display" id="duration-${workExperienceCount}" style="display: none;"></div>
    `;
    container.appendChild(item);
}

function calculateWorkDuration(itemId) {
    const item = document.getElementById(itemId);
    const startInput = item.querySelector('.work-start');
    const endInput = item.querySelector('.work-end');
    const durationDiv = item.querySelector('.duration-display');
    
    if (!startInput.value) {
        durationDiv.style.display = 'none';
        return;
    }
    
    const start = new Date(startInput.value);
    const end = endInput.value ? new Date(endInput.value) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let duration = '';
    if (years > 0 && remainingMonths > 0) {
        duration = `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
        duration = `${years} year${years > 1 ? 's' : ''}`;
    } else {
        duration = `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    
    durationDiv.textContent = `Duration: ${duration}`;
    durationDiv.style.display = 'block';
}

// Education
function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    const item = document.createElement('div');
    item.className = 'education-item';
    item.id = `education-${educationCount}`;
    item.setAttribute('data-index', educationCount);
    item.innerHTML = `
        <button class="remove-item" onclick="removeItem('education-${educationCount}')">
            <i class="fas fa-times"></i> Remove
        </button>
        <div class="mb-3">
            <label class="form-label">College/University Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control edu-institution" placeholder="Institution Name" data-tooltip="Enter institution name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Degree/Course</label>
            <div class="input-with-clear">
                <input type="text" class="form-control edu-degree" placeholder="Degree" data-tooltip="Enter your degree or course">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Year of Completion</label>
            <input type="number" class="form-control edu-year" placeholder="2024" min="1950" max="2050" data-tooltip="Enter year of completion">
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Percentage (if applicable)</label>
                <div class="input-with-clear">
                    <input type="text" class="form-control edu-percentage" placeholder="e.g., 85%" data-tooltip="Enter percentage">
                    <button class="clear-btn" onclick="clearItemField(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">GPA (if applicable)</label>
                <div class="input-with-clear">
                    <input type="text" class="form-control edu-gpa" placeholder="e.g., 3.8/4.0" data-tooltip="Enter GPA">
                    <button class="clear-btn" onclick="clearItemField(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(item);
}

// Projects
function addProject() {
    projectCount++;
    const container = document.getElementById('projectsContainer');
    const item = document.createElement('div');
    item.className = 'project-item';
    item.id = `project-${projectCount}`;
    item.setAttribute('data-index', projectCount);
    item.innerHTML = `
        <button class="remove-item" onclick="removeItem('project-${projectCount}')">
            <i class="fas fa-times"></i> Remove
        </button>
        <div class="mb-3">
            <label class="form-label">Project Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control proj-name" placeholder="Project Name" data-tooltip="Enter project name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <div class="input-with-clear">
                <textarea class="form-control proj-desc" rows="2" placeholder="Project Description" data-tooltip="Describe your project"></textarea>
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Project Link</label>
            <div class="input-with-clear">
                <input type="url" class="form-control proj-link" placeholder="https://project-link.com" data-tooltip="Enter project URL">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Company/Organization (Optional)</label>
            <div class="input-with-clear">
                <input type="text" class="form-control proj-company" placeholder="Company Name" data-tooltip="Enter company if applicable">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(item);
}

// Skills
function addSkill(type) {
    let count, container, placeholder;
    
    if (type === 'personal') {
        personalSkillCount++;
        count = personalSkillCount;
        container = document.getElementById('personalSkillsContainer');
        placeholder = 'e.g., Leadership, Communication';
    } else if (type === 'professional') {
        professionalSkillCount++;
        count = professionalSkillCount;
        container = document.getElementById('professionalSkillsContainer');
        placeholder = 'e.g., Project Management, Team Building';
    } else {
        technicalSkillCount++;
        count = technicalSkillCount;
        container = document.getElementById('technicalSkillsContainer');
        placeholder = 'e.g., JavaScript, Python, React';
    }
    
    const item = document.createElement('div');
    item.className = 'skill-item mb-2';
    item.id = `skill-${type}-${count}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control skill-input-${type}" placeholder="${placeholder}" data-tooltip="${placeholder}" oninput="updateSkillList('${type}')">
            <button class="clear-btn" onclick="removeItem('skill-${type}-${count}'); updateSkillList('${type}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(item);
}

function toggleSkillList(type) {
    const listContainer = document.getElementById(`${type}SkillsList`);
    const button = event.target.closest('.list-view-toggle');
    
    if (listContainer.classList.contains('show')) {
        listContainer.classList.remove('show');
        button.classList.remove('active');
    } else {
        listContainer.classList.add('show');
        button.classList.add('active');
        updateSkillList(type);
    }
}

function updateSkillList(type) {
    const container = document.getElementById(`${type}SkillsContainer`);
    const listContainer = document.getElementById(`${type}SkillsList`);
    const inputs = container.querySelectorAll(`.skill-input-${type}`);
    
    let html = '';
    inputs.forEach(input => {
        if (input.value.trim()) {
            html += `<div class="skill-list-item"><i class="fas fa-check-circle" style="color: #667eea; margin-right: 0.5rem;"></i>${input.value}</div>`;
        }
    });
    
    listContainer.innerHTML = html || '<div style="text-align: center; color: #9ca3af; font-size: 0.875rem;">No skills added yet</div>';
}

// Interests
function addInterest() {
    interestCount++;
    const container = document.getElementById('interestsContainer');
    const item = document.createElement('div');
    item.className = 'interest-item mb-2';
    item.id = `interest-${interestCount}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control" placeholder="e.g., Reading, Photography, Traveling" data-tooltip="Enter your interests">
            <button class="clear-btn" onclick="removeItem('interest-${interestCount}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(item);
}

// Certifications
function addCertification() {
    certificationCount++;
    const container = document.getElementById('certificationsContainer');
    const item = document.createElement('div');
    item.className = 'certification-item mb-2';
    item.id = `certification-${certificationCount}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control" placeholder="e.g., AWS Certified Solutions Architect" data-tooltip="Enter certification name">
            <button class="clear-btn" onclick="removeItem('certification-${certificationCount}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(item);
}

// Remove item
function removeItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
    }
}

function clearItemField(btn) {
    const input = btn.parentElement.querySelector('.form-control');
    if (input) {
        input.value = '';
    }
}

// Move entire sections up or down
function moveSectionUp(containerId) {
    const section = document.getElementById(containerId).closest('.section-card');
    const prevSection = section.previousElementSibling;
    
    if (prevSection && prevSection.classList.contains('section-card')) {
        section.parentNode.insertBefore(section, prevSection);
    }
}

function moveSectionDown(containerId) {
    const section = document.getElementById(containerId).closest('.section-card');
    const nextSection = section.nextElementSibling;
    
    if (nextSection && nextSection.classList.contains('section-card')) {
        section.parentNode.insertBefore(nextSection, section);
    }
}

// Generate Preview
function generatePreview() {
    const photo = document.querySelector('#photoPreview img')?.src || '';
    const name = document.getElementById('name').value || 'Your Name';
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const objective = document.getElementById('objective').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;
    const location = document.getElementById('location').value;
    const declaration = document.getElementById('declaration').checked;
    
    let html = `
        <div class="resume-header">
            ${photo ? `<div class="resume-header-photo"><img src="${photo}" alt="Profile Photo"></div>` : ''}
            <div class="resume-header-content">
                <div class="resume-name">${name}</div>
                <div class="resume-contact">
                    ${email ? `<span><i class="fas fa-envelope"></i> ${email}</span>` : ''}
                    ${phone ? `<span><i class="fas fa-phone"></i> ${phone}</span>` : ''}
                    ${location ? `<span><i class="fas fa-map-marker-alt"></i> ${location}</span>` : ''}
                    ${linkedin ? `<span><i class="fab fa-linkedin"></i> LinkedIn</span>` : ''}
                    ${github ? `<span><i class="fab fa-github"></i> GitHub</span>` : ''}
                </div>
            </div>
        </div>
    `;
    
    if (objective) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Career Objective</div>
                <p>${objective}</p>
            </div>
        `;
    }
    
    // Work Experience
    const workItems = document.querySelectorAll('.experience-item');
    if (workItems.length > 0) {
        let hasContent = false;
        let workHtml = '<div class="resume-section"><div class="resume-section-title">Work Experience</div>';
        
        workItems.forEach(item => {
            const company = item.querySelector('.work-company').value;
            const title = item.querySelector('.work-title').value;
            const start = item.querySelector('.work-start').value;
            const end = item.querySelector('.work-end').value;
            const durationDiv = item.querySelector('.duration-display');
            const duration = durationDiv.style.display !== 'none' ? durationDiv.textContent : '';
            
            if (company || title || start) {
                hasContent = true;
                workHtml += `
                    <div class="resume-item">
                        ${title ? `<div class="resume-item-title">${title}</div>` : ''}
                        ${company ? `<div class="resume-item-subtitle">${company}</div>` : ''}
                        ${start ? `<div class="resume-item-date">${formatDate(start)} - ${end ? formatDate(end) : 'Present'}${duration ? ' • ' + duration : ''}</div>` : ''}
                    </div>
                `;
            }
        });
        
        workHtml += '</div>';
        if (hasContent) html += workHtml;
    }
    
    // Education
    const eduItems = document.querySelectorAll('.education-item');
    if (eduItems.length > 0) {
        let hasContent = false;
        let eduHtml = '<div class="resume-section"><div class="resume-section-title">Education</div>';
        
        eduItems.forEach(item => {
            const institution = item.querySelector('.edu-institution').value;
            const degree = item.querySelector('.edu-degree').value;
            const year = item.querySelector('.edu-year').value;
            const percentage = item.querySelector('.edu-percentage').value;
            const gpa = item.querySelector('.edu-gpa').value;
            
            if (institution || degree) {
                hasContent = true;
                let gradeInfo = '';
                if (percentage && gpa) {
                    gradeInfo = `${percentage} | ${gpa}`;
                } else if (percentage) {
                    gradeInfo = percentage;
                } else if (gpa) {
                    gradeInfo = gpa;
                }
                
                eduHtml += `
                    <div class="resume-item">
                        <div class="resume-item-title">${degree || 'Degree'}</div>
                        <div class="resume-item-subtitle">${institution || 'Institution'}</div>
                        ${year || gradeInfo ? `<div class="resume-item-date">${year ? year : ''}${gradeInfo ? ' • ' + gradeInfo : ''}</div>` : ''}
                    </div>
                `;
            }
        });
        
        eduHtml += '</div>';
        if (hasContent) html += eduHtml;
    }
    
    // Projects
    const projItems = document.querySelectorAll('.project-item');
    if (projItems.length > 0) {
        let hasContent = false;
        let projHtml = '<div class="resume-section"><div class="resume-section-title">Projects</div>';
        
        projItems.forEach(item => {
            const projName = item.querySelector('.proj-name').value;
            const projDesc = item.querySelector('.proj-desc').value;
            const projLink = item.querySelector('.proj-link').value;
            const projCompany = item.querySelector('.proj-company').value;
            
            if (projName || projDesc) {
                hasContent = true;
                projHtml += `
                    <div class="resume-item">
                        <div class="resume-item-title">${projName || 'Project Name'}</div>
                        ${projCompany ? `<div class="resume-item-subtitle">${projCompany}</div>` : ''}
                        ${projDesc ? `<div class="resume-item-description">${projDesc}</div>` : ''}
                        ${projLink ? `<div class="resume-item-date"><i class="fas fa-link"></i> <a href="${projLink}" target="_blank">Project Link</a></div>` : ''}
                    </div>
                `;
            }
        });
        
        projHtml += '</div>';
        if (hasContent) html += projHtml;
    }
    
    // Skills
    const personalSkills = Array.from(document.querySelectorAll('#personalSkillsContainer input')).map(i => i.value).filter(v => v);
    const professionalSkills = Array.from(document.querySelectorAll('#professionalSkillsContainer input')).map(i => i.value).filter(v => v);
    const technicalSkills = Array.from(document.querySelectorAll('#technicalSkillsContainer input')).map(i => i.value).filter(v => v);
    
    if (personalSkills.length || professionalSkills.length || technicalSkills.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Skills</div>';
        
        if (personalSkills.length) {
            html += '<div class="mb-3"><strong>Personal Skills:</strong><div class="resume-skills-grid">';
            personalSkills.forEach(skill => {
                html += `<div class="resume-skill-item">${skill}</div>`;
            });
            html += '</div></div>';
        }
        
        if (professionalSkills.length) {
            html += '<div class="mb-3"><strong>Professional Skills:</strong><div class="resume-skills-grid">';
            professionalSkills.forEach(skill => {
                html += `<div class="resume-skill-item">${skill}</div>`;
            });
            html += '</div></div>';
        }
        
        if (technicalSkills.length) {
            html += '<div class="mb-3"><strong>Technical Skills:</strong><div class="resume-skills-grid">';
            technicalSkills.forEach(skill => {
                html += `<div class="resume-skill-item">${skill}</div>`;
            });
            html += '</div></div>';
        }
        
        html += '</div>';
    }
    
    // Interests
    const interests = Array.from(document.querySelectorAll('#interestsContainer input')).map(i => i.value).filter(v => v);
    if (interests.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Interests</div>';
        html += '<div class="resume-skills-grid">';
        interests.forEach(interest => {
            html += `<div class="resume-skill-item">${interest}</div>`;
        });
        html += '</div></div>';
    }
    
    // Certifications
    const certifications = Array.from(document.querySelectorAll('#certificationsContainer input')).map(i => i.value).filter(v => v);
    if (certifications.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Certifications</div>';
        certifications.forEach(cert => {
            html += `<div class="resume-item"><div class="resume-item-title">${cert}</div></div>`;
        });
        html += '</div>';
    }
    
    // Declaration
    if (declaration) {
        html += `
            <div class="resume-footer">
                <strong>Declaration:</strong> I hereby declare that all the information provided above is true and accurate to the best of my knowledge.
            </div>
        `;
    }
    
    document.getElementById('resumePreview').innerHTML = html;
    applyTheme();
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Download PDF using html2canvas and jsPDF
function downloadPDF() {
    generatePreview();
    
    const resumeElement = document.getElementById('resumePreview');
    const originalWidth = resumeElement.style.width;
    const originalMaxWidth = resumeElement.style.maxWidth;
    
    // Set a fixed width for consistency
    resumeElement.style.width = '210mm';
    resumeElement.style.maxWidth = '210mm';
    
    // Use html2canvas to capture the element
    html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Restore original width
        resumeElement.style.width = originalWidth;
        resumeElement.style.maxWidth = originalMaxWidth;
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        // A4 dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        // Calculate image dimensions
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // If content fits on one page
        if (imgHeight <= pdfHeight) {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            // Multiple pages needed
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
        }
        
        pdf.save(`resume_${new Date().getTime()}.pdf`);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadThemeFromStorage();
    addWorkExperience();
    addEducation();
    addProject();
    addSkill('personal');
    addSkill('professional');
    addSkill('technical');
    addInterest();
    addCertification();
    setupValidation();
    setupPhotoUpload();
    setupDraggableThemePanel();
});

// Load theme from local storage
function loadThemeFromStorage() {
    const saved = sessionStorage.getItem('resumeBuilderTheme');
    if (saved) {
        currentTheme = JSON.parse(saved);
        document.getElementById('fontFamily').value = currentTheme.fontFamily;
        document.getElementById('fontSize').value = currentTheme.fontSize;
        document.getElementById('themeColor').value = currentTheme.primaryColor;
        applyTheme();
    }
}

// Save theme to storage
function saveThemeToStorage() {
    sessionStorage.setItem('resumeBuilderTheme', JSON.stringify(currentTheme));
}

// Apply theme
function applyTheme() {
    const preview = document.getElementById('resumePreview');
    if (preview) {
        preview.style.setProperty('--resume-font-family', currentTheme.fontFamily);
        preview.style.setProperty('--resume-font-size', currentTheme.fontSize);
        preview.style.setProperty('--resume-primary-color', currentTheme.primaryColor);
    }
    
    // Update section headers color
    document.querySelectorAll('.section-header h3').forEach(h3 => {
        h3.style.color = currentTheme.primaryColor;
    });
    
    document.querySelectorAll('.btn-icon, .btn-icon-sm').forEach(btn => {
        btn.style.color = currentTheme.primaryColor;
    });
}

// Update theme
function updateTheme() {
    currentTheme.fontFamily = document.getElementById('fontFamily').value;
    currentTheme.fontSize = document.getElementById('fontSize').value;
    currentTheme.primaryColor = document.getElementById('themeColor').value;
    
    applyTheme();
    saveThemeToStorage();
    generatePreview();
}

// Theme panel controls
document.getElementById('themeBtn').addEventListener('click', function() {
    document.getElementById('themeModal').classList.add('show');
});

function closeThemePanel() {
    document.getElementById('themeModal').classList.remove('show');
}

// Make theme panel draggable
function setupDraggableThemePanel() {
    const modal = document.getElementById('themeModal');
    const panel = document.querySelector('.theme-panel');
    const header = document.querySelector('.theme-header');
    
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target === header || header.contains(e.target)) {
            if (e.target.classList.contains('btn-close-modal') || e.target.closest('.btn-close-modal')) {
                return;
            }
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            panel.classList.add('dragging');
        }
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            
            panel.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }
    }
    
    function dragEnd() {
        isDragging = false;
        panel.classList.remove('dragging');
    }
}

// Preview controls
document.getElementById('previewBtn').addEventListener('click', togglePreview);

function togglePreview() {
    const formSection = document.getElementById('formSection');
    const previewSection = document.getElementById('previewSection');
    const previewText = document.getElementById('previewText');
    
    if (previewSection.classList.contains('show')) {
        previewSection.classList.remove('show');
        formSection.classList.remove('with-preview');
        previewText.textContent = 'Show Preview';
    } else {
        previewSection.classList.add('show');
        formSection.classList.add('with-preview');
        previewText.textContent = 'Hide Preview';
        generatePreview();
    }
}

// Validation
function setupValidation() {
    const inputs = {
        name: /^[a-zA-Z\s]*$/,
        email: /^[^\s@]*@?[^\s@]*\.?[^\s@]*$/,
        phone: /^[0-9+\-\s()]*$/,
        linkedin: /.*/,
        github: /.*/
    };
    
    Object.keys(inputs).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                validateInput(input, inputs[id]);
            });
            
            input.addEventListener('blur', function() {
                strictValidate(input, id);
            });
        }
    });
}

function validateInput(input, pattern) {
    if (!input.value) {
        input.classList.remove('error');
        const errorDiv = input.closest('.input-with-clear').nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
        return true;
    }
    
    if (!pattern.test(input.value)) {
        input.classList.add('error');
        return false;
    } else {
        input.classList.remove('error');
        const errorDiv = input.closest('.input-with-clear').nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
        return true;
    }
}

function strictValidate(input, type) {
    const value = input.value.trim();
    if (!value) return true;
    
    const validations = {
        name: /^[a-zA-Z\s]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^[0-9+\-\s()]+$/,
        linkedin: /linkedin\.com|^https?:\/\//,
        github: /github\.com|^https?:\/\//
    };
    
    if (validations[type] && !validations[type].test(value)) {
        input.classList.add('error');
        const messages = {
            name: 'Name should contain only letters',
            email: 'Enter a valid email address',
            phone: 'Enter a valid phone number',
            linkedin: 'Enter a valid LinkedIn URL',
            github: 'Enter a valid GitHub URL'
        };
        const errorDiv = input.closest('.input-with-clear').nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = messages[type];
        }
        return false;
    }
    
    input.classList.remove('error');
    const errorDiv = input.closest('.input-with-clear').nextElementSibling;
    if (errorDiv && errorDiv.classList.contains('error-message')) {
        errorDiv.textContent = '';
    }
    return true;
}

function clearField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = '';
        field.classList.remove('error');
        const errorDiv = field.closest('.input-with-clear')?.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
    }
}

// Photo upload
function setupPhotoUpload() {
    document.getElementById('photoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size should be less than 2MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.getElementById('photoPreview');
                preview.innerHTML = `
                    <div style="position: relative; display: inline-block;">
                        <img src="${e.target.result}" alt="Profile">
                        <button class="photo-remove" onclick="removePhoto()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            };
            reader.readAsDataURL(file);
        }
    });
}

function removePhoto() {
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('photoUpload').value = '';
}

// Work Experience
function addWorkExperience() {
    workExperienceCount++;
    const container = document.getElementById('workExperienceContainer');
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.id = `work-${workExperienceCount}`;
    item.setAttribute('data-index', workExperienceCount);
    item.innerHTML = `
        <button class="remove-item" onclick="removeItem('work-${workExperienceCount}')">
            <i class="fas fa-times"></i> Remove
        </button>
        <div class="mb-3">
            <label class="form-label">Company Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control work-company" placeholder="Company Name" data-tooltip="Enter company name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Start Date</label>
                <input type="date" class="form-control work-start" onchange="calculateWorkDuration('work-${workExperienceCount}')" data-tooltip="Select start date">
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">End Date (Leave empty for present)</label>
                <input type="date" class="form-control work-end" onchange="calculateWorkDuration('work-${workExperienceCount}')" data-tooltip="Select end date or leave empty">
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Job Title</label>
            <div class="input-with-clear">
                <input type="text" class="form-control work-title" placeholder="Job Title" data-tooltip="Enter your job title">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="duration-display" id="duration-${workExperienceCount}" style="display: none;"></div>
    `;
    container.appendChild(item);
}

function calculateWorkDuration(itemId) {
    const item = document.getElementById(itemId);
    const startInput = item.querySelector('.work-start');
    const endInput = item.querySelector('.work-end');
    const durationDiv = item.querySelector('.duration-display');
    
    if (!startInput.value) {
        durationDiv.style.display = 'none';
        return;
    }
    
    const start = new Date(startInput.value);
    const end = endInput.value ? new Date(endInput.value) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    let duration = '';
    if (years > 0 && remainingMonths > 0) {
        duration = `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
        duration = `${years} year${years > 1 ? 's' : ''}`;
    } else {
        duration = `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
    
    durationDiv.textContent = `Duration: ${duration}`;
    durationDiv.style.display = 'block';
}

// Education
function addEducation() {
    educationCount++;
    const container = document.getElementById('educationContainer');
    const item = document.createElement('div');
    item.className = 'education-item';
    item.id = `education-${educationCount}`;
    item.setAttribute('data-index', educationCount);
    item.innerHTML = `
        <button class="remove-item" onclick="removeItem('education-${educationCount}')">
            <i class="fas fa-times"></i> Remove
        </button>
        <div class="mb-3">
            <label class="form-label">College/University Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control edu-institution" placeholder="Institution Name" data-tooltip="Enter institution name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Degree/Course</label>
            <div class="input-with-clear">
                <input type="text" class="form-control edu-degree" placeholder="Degree" data-tooltip="Enter your degree or course">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Year of Completion</label>
            <input type="number" class="form-control edu-year" placeholder="2024" min="1950" max="2050" data-tooltip="Enter year of completion">
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Percentage (if applicable)</label>
                <div class="input-with-clear">
                    <input type="text" class="form-control edu-percentage" placeholder="e.g., 85%" data-tooltip="Enter percentage">
                    <button class="clear-btn" onclick="clearItemField(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">GPA (if applicable)</label>
                <div class="input-with-clear">
                    <input type="text" class="form-control edu-gpa" placeholder="e.g., 3.8/4.0" data-tooltip="Enter GPA">
                    <button class="clear-btn" onclick="clearItemField(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    container.appendChild(item);
}

// Projects
function addProject() {
    projectCount++;
    const container = document.getElementById('projectsContainer');
    const item = document.createElement('div');
    item.className = 'project-item';
    item.id = `project-${projectCount}`;
    item.setAttribute('data-index', projectCount);
    item.innerHTML = `
        <button class="remove-item" onclick="removeItem('project-${projectCount}')">
            <i class="fas fa-times"></i> Remove
        </button>
        <div class="mb-3">
            <label class="form-label">Project Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control proj-name" placeholder="Project Name" data-tooltip="Enter project name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <div class="input-with-clear">
                <textarea class="form-control proj-desc" rows="2" placeholder="Project Description" data-tooltip="Describe your project"></textarea>
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Project Link</label>
            <div class="input-with-clear">
                <input type="url" class="form-control proj-link" placeholder="https://project-link.com" data-tooltip="Enter project URL">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Company/Organization (Optional)</label>
            <div class="input-with-clear">
                <input type="text" class="form-control proj-company" placeholder="Company Name" data-tooltip="Enter company if applicable">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `;
    container.appendChild(item);
}

// Skills
function addSkill(type) {
    let count, container, placeholder;
    
    if (type === 'personal') {
        personalSkillCount++;
        count = personalSkillCount;
        container = document.getElementById('personalSkillsContainer');
        placeholder = 'e.g., Leadership, Communication';
    } else if (type === 'professional') {
        professionalSkillCount++;
        count = professionalSkillCount;
        container = document.getElementById('professionalSkillsContainer');
        placeholder = 'e.g., Project Management, Team Building';
    } else {
        technicalSkillCount++;
        count = technicalSkillCount;
        container = document.getElementById('technicalSkillsContainer');
        placeholder = 'e.g., JavaScript, Python, React';
    }
    
    const item = document.createElement('div');
    item.className = 'skill-item mb-2';
    item.id = `skill-${type}-${count}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control skill-input-${type}" placeholder="${placeholder}" data-tooltip="${placeholder}" oninput="updateSkillList('${type}')">
            <button class="clear-btn" onclick="removeItem('skill-${type}-${count}'); updateSkillList('${type}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(item);
}

function toggleSkillList(type) {
    const listContainer = document.getElementById(`${type}SkillsList`);
    const button = event.target.closest('.list-view-toggle');
    
    if (listContainer.classList.contains('show')) {
        listContainer.classList.remove('show');
        button.classList.remove('active');
    } else {
        listContainer.classList.add('show');
        button.classList.add('active');
        updateSkillList(type);
    }
}

function updateSkillList(type) {
    const container = document.getElementById(`${type}SkillsContainer`);
    const listContainer = document.getElementById(`${type}SkillsList`);
    const inputs = container.querySelectorAll(`.skill-input-${type}`);
    
    let html = '';
    inputs.forEach(input => {
        if (input.value.trim()) {
            html += `<div class="skill-list-item"><i class="fas fa-check-circle" style="color: #667eea; margin-right: 0.5rem;"></i>${input.value}</div>`;
        }
    });
    
    listContainer.innerHTML = html || '<div style="text-align: center; color: #9ca3af; font-size: 0.875rem;">No skills added yet</div>';
}

// Interests
function addInterest() {
    interestCount++;
    const container = document.getElementById('interestsContainer');
    const item = document.createElement('div');
    item.className = 'interest-item mb-2';
    item.id = `interest-${interestCount}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control" placeholder="e.g., Reading, Photography, Traveling" data-tooltip="Enter your interests">
            <button class="clear-btn" onclick="removeItem('interest-${interestCount}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(item);
}

// Certifications
function addCertification() {
    certificationCount++;
    const container = document.getElementById('certificationsContainer');
    const item = document.createElement('div');
    item.className = 'certification-item mb-2';
    item.id = `certification-${certificationCount}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control" placeholder="e.g., AWS Certified Solutions Architect" data-tooltip="Enter certification name">
            <button class="clear-btn" onclick="removeItem('certification-${certificationCount}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    container.appendChild(item);
}

// Remove item
function removeItem(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
    }
}

function clearItemField(btn) {
    const input = btn.parentElement.querySelector('.form-control');
    if (input) {
        input.value = '';
    }
}

// Move entire sections up or down
function moveSectionUp(containerId) {
    const section = document.getElementById(containerId).closest('.section-card');
    const prevSection = section.previousElementSibling;
    
    if (prevSection && prevSection.classList.contains('section-card')) {
        section.parentNode.insertBefore(section, prevSection);
    }
}

function moveSectionDown(containerId) {
    const section = document.getElementById(containerId).closest('.section-card');
    const nextSection = section.nextElementSibling;
    
    if (nextSection && nextSection.classList.contains('section-card')) {
        section.parentNode.insertBefore(nextSection, section);
    }
}

// Generate Preview
function generatePreview() {
    const photo = document.querySelector('#photoPreview img')?.src || '';
    const name = document.getElementById('name').value || 'Your Name';
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const objective = document.getElementById('objective').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;
    const location = document.getElementById('location').value;
    const declaration = document.getElementById('declaration').checked;
    
    let html = `
        <div class="resume-header">
            ${photo ? `<div class="resume-header-photo"><img src="${photo}" alt="Profile Photo"></div>` : ''}
            <div class="resume-header-content">
                <div class="resume-name">${name}</div>
                <div class="resume-contact">
                    ${email ? `<span><i class="fas fa-envelope"></i> ${email}</span>` : ''}
                    ${phone ? `<span><i class="fas fa-phone"></i> ${phone}</span>` : ''}
                    ${location ? `<span><i class="fas fa-map-marker-alt"></i> ${location}</span>` : ''}
                    ${linkedin ? `<span><i class="fab fa-linkedin"></i> LinkedIn</span>` : ''}
                    ${github ? `<span><i class="fab fa-github"></i> GitHub</span>` : ''}
                </div>
            </div>
        </div>
    `;
    
    if (objective) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Career Objective</div>
                <p>${objective}</p>
            </div>
        `;
    }
    
    // Work Experience
    const workItems = document.querySelectorAll('.experience-item');
    if (workItems.length > 0) {
        let hasContent = false;
        let workHtml = '<div class="resume-section"><div class="resume-section-title">Work Experience</div>';
        
        workItems.forEach(item => {
            const company = item.querySelector('.work-company').value;
            const title = item.querySelector('.work-title').value;
            const start = item.querySelector('.work-start').value;
            const end = item.querySelector('.work-end').value;
            const durationDiv = item.querySelector('.duration-display');
            const duration = durationDiv.style.display !== 'none' ? durationDiv.textContent : '';
            
            if (company || title || start) {
                hasContent = true;
                workHtml += `
                    <div class="resume-item">
                        ${title ? `<div class="resume-item-title">${title}</div>` : ''}
                        ${company ? `<div class="resume-item-subtitle">${company}</div>` : ''}
                        ${start ? `<div class="resume-item-date">${formatDate(start)} - ${end ? formatDate(end) : 'Present'}${duration ? ' • ' + duration : ''}</div>` : ''}
                    </div>
                `;
            }
        });
        
        workHtml += '</div>';
        if (hasContent) html += workHtml;
    }
    
    // Education
    const eduItems = document.querySelectorAll('.education-item');
    if (eduItems.length > 0) {
        let hasContent = false;
        let eduHtml = '<div class="resume-section"><div class="resume-section-title">Education</div>';
        
        eduItems.forEach(item => {
            const institution = item.querySelector('.edu-institution').value;
            const degree = item.querySelector('.edu-degree').value;
            const year = item.querySelector('.edu-year').value;
            const percentage = item.querySelector('.edu-percentage').value;
            const gpa = item.querySelector('.edu-gpa').value;
            
            if (institution || degree) {
                hasContent = true;
                let gradeInfo = '';
                if (percentage && gpa) {
                    gradeInfo = `${percentage} | ${gpa}`;
                } else if (percentage) {
                    gradeInfo = percentage;
                } else if (gpa) {
                    gradeInfo = gpa;
                }
                
                eduHtml += `
                    <div class="resume-item">
                        <div class="resume-item-title">${degree || 'Degree'}</div>
                        <div class="resume-item-subtitle">${institution || 'Institution'}</div>
                        ${year || gradeInfo ? `<div class="resume-item-date">${year ? year : ''}${gradeInfo ? ' • ' + gradeInfo : ''}</div>` : ''}
                    </div>
                `;
            }
        });
        
        eduHtml += '</div>';
        if (hasContent) html += eduHtml;
    }
    
    // Projects
    const projItems = document.querySelectorAll('.project-item');
    if (projItems.length > 0) {
        let hasContent = false;
        let projHtml = '<div class="resume-section"><div class="resume-section-title">Projects</div>';
        
        projItems.forEach(item => {
            const projName = item.querySelector('.proj-name').value;
            const projDesc = item.querySelector('.proj-desc').value;
            const projLink = item.querySelector('.proj-link').value;
            const projCompany = item.querySelector('.proj-company').value;
            
            if (projName || projDesc) {
                hasContent = true;
                projHtml += `
                    <div class="resume-item">
                        <div class="resume-item-title">${projName || 'Project Name'}</div>
                        ${projCompany ? `<div class="resume-item-subtitle">${projCompany}</div>` : ''}
                        ${projDesc ? `<div class="resume-item-description">${projDesc}</div>` : ''}
                        ${projLink ? `<div class="resume-item-date"><i class="fas fa-link"></i> <a href="${projLink}" target="_blank">Project Link</a></div>` : ''}
                    </div>
                `;
            }
        });
        
        projHtml += '</div>';
        if (hasContent) html += projHtml;
    }
    
    // Skills
    const personalSkills = Array.from(document.querySelectorAll('#personalSkillsContainer input')).map(i => i.value).filter(v => v);
    const professionalSkills = Array.from(document.querySelectorAll('#professionalSkillsContainer input')).map(i => i.value).filter(v => v);
    const technicalSkills = Array.from(document.querySelectorAll('#technicalSkillsContainer input')).map(i => i.value).filter(v => v);
    
    if (personalSkills.length || professionalSkills.length || technicalSkills.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Skills</div>';
        
        if (personalSkills.length) {
            html += '<div class="mb-3"><strong>Personal Skills:</strong><div class="resume-skills-grid">';
            personalSkills.forEach(skill => {
                html += `<div class="resume-skill-item">${skill}</div>`;
            });
            html += '</div></div>';
        }
        
        if (professionalSkills.length) {
            html += '<div class="mb-3"><strong>Professional Skills:</strong><div class="resume-skills-grid">';
            professionalSkills.forEach(skill => {
                html += `<div class="resume-skill-item">${skill}</div>`;
            });
            html += '</div></div>';
        }
        
        if (technicalSkills.length) {
            html += '<div class="mb-3"><strong>Technical Skills:</strong><div class="resume-skills-grid">';
            technicalSkills.forEach(skill => {
                html += `<div class="resume-skill-item">${skill}</div>`;
            });
            html += '</div></div>';
        }
        
        html += '</div>';
    }
    
    // Interests
    const interests = Array.from(document.querySelectorAll('#interestsContainer input')).map(i => i.value).filter(v => v);
    if (interests.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Interests</div>';
        html += '<div class="resume-skills-grid">';
        interests.forEach(interest => {
            html += `<div class="resume-skill-item">${interest}</div>`;
        });
        html += '</div></div>';
    }
    
    // Certifications
    const certifications = Array.from(document.querySelectorAll('#certificationsContainer input')).map(i => i.value).filter(v => v);
    if (certifications.length) {
        html += '<div class="resume-section"><div class="resume-section-title">Certifications</div>';
        certifications.forEach(cert => {
            html += `<div class="resume-item"><div class="resume-item-title">${cert}</div></div>`;
        });
        html += '</div>';
    }
    
    // Declaration
    if (declaration) {
        html += `
            <div class="resume-footer">
                <strong>Declaration:</strong> I hereby declare that all the information provided above is true and accurate to the best of my knowledge.
            </div>
        `;
    }
    
    document.getElementById('resumePreview').innerHTML = html;
    applyTheme();
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Download PDF using html2canvas and jsPDF
function downloadPDF() {
    generatePreview();
    
    const resumeElement = document.getElementById('resumePreview');
    const originalWidth = resumeElement.style.width;
    const originalMaxWidth = resumeElement.style.maxWidth;
    
    // Set a fixed width for consistency
    resumeElement.style.width = '210mm';
    resumeElement.style.maxWidth = '210mm';
    
    // Use html2canvas to capture the element
    html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
    }).then(canvas => {
        // Restore original width
        resumeElement.style.width = originalWidth;
        resumeElement.style.maxWidth = originalMaxWidth;
        
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        
        // A4 dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        // Calculate image dimensions
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // If content fits on one page
        if (imgHeight <= pdfHeight) {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            // Multiple pages needed
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
        }
        
        pdf.save(`resume_${new Date().getTime()}.pdf`);
    });
}

// Download Word with exact preview match
function downloadWord() {
    generatePreview();
    
    // Get the resume content
    const resumeContent = document.getElementById('resumePreview').cloneNode(true);
    
    // Remove any unwanted elements
    const unwantedElements = resumeContent.querySelectorAll('script, style, .no-print');
    unwantedElements.forEach(el => el.remove());
    
    const htmlContent = `
        <!DOCTYPE html>
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset="utf-8">
            <title>Resume</title>
            <!--[if gte mso 9]>
            <xml>
                <w:WordDocument>
                    <w:View>Print</w:View>
                    <w:Zoom>100</w:Zoom>
                    <w:DoNotOptimizeForBrowser/>
                </w:WordDocument>
            </xml>
            <![endif]-->
            <style>
                * { 
                    margin: 0; 
                    padding: 0; 
                    box-sizing: border-box; 
                }
                @page {
                    size: A4;
                    margin: 0.5in;
                }
                body { 
                    font-family: ${currentTheme.fontFamily}; 
                    font-size: ${currentTheme.fontSize}; 
                    color: #1f2937;
                    line-height: 1.4;
                    margin: 0;
                    padding: 0;
                }
                .resume-header {
                    background-color: ${currentTheme.primaryColor};
                    color: white;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    display: block;
                    width: 100%;
                }
                .resume-header-photo {
                    display: inline-block;
                    vertical-align: middle;
                    padding-right: 10px;
                    margin-right: 10px;
                }
                .resume-header-photo img {
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    border: 2px solid white;
                }
                .resume-header-content {
                    display: inline-block;
                    vertical-align: middle;
                }
                .resume-name { 
                    font-size: 16px; 
                    font-weight: bold; 
                    margin: 0 0 3px 0; 
                    color: white; 
                    line-height: 1.2;
                }
                .resume-contact { 
                    color: white;
                    font-size: 10px;
                    margin: 0;
                    line-height: 1.3;
                }
                .resume-contact span { 
                    display: inline-block; 
                    margin-right: 10px; 
                }
                .resume-section { 
                    margin-bottom: 12px; 
                    page-break-inside: avoid; 
                }
                .resume-section-title {
                    font-size: 15px;
                    font-weight: bold;
                    color: ${currentTheme.primaryColor};
                    border-bottom: 2px solid ${currentTheme.primaryColor};
                    padding-bottom: 3px;
                    margin-bottom: 8px;
                }
                .resume-item { 
                    margin-bottom: 10px; 
                    page-break-inside: avoid; 
                }
                .resume-item-title { 
                    font-weight: bold; 
                    color: #374151; 
                    font-size: ${currentTheme.fontSize};
                }
                .resume-item-subtitle { 
                    color: #6b7280; 
                    font-size: 12px;
                }
                .resume-item-date { 
                    color: #9ca3af; 
                    font-size: 11px; 
                }
                .resume-item-description { 
                    margin-top: 3px; 
                    color: #4b5563; 
                    font-size: 12px;
                }
                .resume-skills-grid { 
                    margin-top: 5px;
                }
                .resume-skill-item { 
                    background-color: #f3f4f6; 
                    padding: 4px 8px; 
                    border-radius: 3px; 
                    display: inline-block;
                    margin: 2px;
                    font-size: 11px;
                }
                .resume-footer {
                    background-color: ${currentTheme.primaryColor};
                    color: white;
                    padding: 10px 15px;
                    text-align: center;
                    margin-top: 15px;
                    font-size: 11px;
                }
                .mb-3 {
                    margin-bottom: 8px;
                }
                strong {
                    font-weight: bold;
                    color: #374151;
                    font-size: 12px;
                }
                p {
                    margin: 0;
                    padding: 0;
                    font-size: 12px;
                    line-height: 1.4;
                }
                i, .fa, .fas, .fab { 
                    display: none; 
                }
                a { 
                    color: inherit; 
                    text-decoration: none; 
                }
            </style>
        </head>
        <body>
            ${resumeContent.innerHTML}
        </body>
        </html>
    `;
    
    const blob = new Blob(['\ufeff', htmlContent], {
        type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume_${new Date().getTime()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}