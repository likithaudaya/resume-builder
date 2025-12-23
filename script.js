// Global variables
let workExperienceCount = 0;
let educationCount = 0;
let projectCount = 0;
let personalSkillCount = 0;
let professionalSkillCount = 0;
let technicalSkillCount = 0;
let interestCount = 0;
let certificationCount = 0;

// Section visibility tracking
let sectionVisibility = {
    objective: true,
    work: true,
    education: true,
    projects: true,
    skills: true,
    interests: true,
    certifications: true,
    declaration: true
};

// Theme settings
let currentTheme = {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    primaryColor: '#2563eb'
};

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
    setupVisibilityToggles();
    setupTooltips();
});

// Initialize tooltips: ensure CSS-based tooltips appear for inputs by moving `data-tooltip`
// to a non-replaced ancestor (eg. `.input-with-clear`). Avoid using native `title` so
// the existing custom CSS ([data-tooltip]:hover::after) is used.
function setupTooltips() {
    // Move section-level tooltips to their header to avoid duplicate tooltips
    document.querySelectorAll('.section-card[data-tooltip]').forEach(card => {
        const headerH3 = card.querySelector('.section-header h3');
        if (headerH3) {
            // only move if card contains interactive fields (to avoid losing tooltip)
            if (card.querySelector('input, textarea, select, .input-with-clear')) {
                if (!headerH3.hasAttribute('data-tooltip')) {
                    headerH3.setAttribute('data-tooltip', card.getAttribute('data-tooltip'));
                }
                card.removeAttribute('data-tooltip');
            }
        }
    });
    const isReplaced = el => {
        if (!el || !el.tagName) return false;
        const t = el.tagName.toUpperCase();
        return ['INPUT', 'TEXTAREA', 'SELECT', 'IMG'].includes(t);
    };

    const applyTooltip = el => {
        try {
            const tip = el.getAttribute && el.getAttribute('data-tooltip');
            if (!tip) return;

            // If element is a replaced element (input/textarea/select/img), attach tooltip to a wrapper
            if (isReplaced(el)) {
                const host = el.closest('.input-with-clear') || el.parentElement || el;
                if (host && host !== el) {
                    if (!host.hasAttribute('data-tooltip')) host.setAttribute('data-tooltip', tip);
                    // remove tooltip from the replaced element to avoid duplicates
                    if (el.hasAttribute('data-tooltip')) el.removeAttribute('data-tooltip');
                    // remove data-tooltip from ancestor elements up to the section-card,
                    // but keep the section header tooltip (h3) so section-level tips still show on header hover
                    let anc = host.parentElement;
                    while (anc && anc !== document.body && !anc.classList.contains('section-card')) {
                        if (anc.hasAttribute && anc.hasAttribute('data-tooltip')) anc.removeAttribute('data-tooltip');
                        anc = anc.parentElement;
                    }
                } else {
                    // fallback: ensure element keeps data-tooltip
                    el.setAttribute('data-tooltip', tip);
                }
                // remove native title to prevent browser tooltip
                if (el.title) el.removeAttribute('title');
            } else {
                // non-replaced elements can keep data-tooltip; ensure no native title overrides
                if (el.title) el.removeAttribute('title');
            }
        } catch (e) {}
    };

    document.querySelectorAll('[data-tooltip]').forEach(applyTooltip);

    const mo = new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.hasAttribute && node.hasAttribute('data-tooltip')) applyTooltip(node);
                if (node.querySelectorAll) node.querySelectorAll('[data-tooltip]').forEach(applyTooltip);
            });
        });
    });

    mo.observe(document.body, { childList: true, subtree: true });
}

// Load theme from storage
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

// Setup visibility toggles
function setupVisibilityToggles() {
    const sections = [
        { id: 'work', element: document.getElementById('workExperienceContainer')?.closest('.section-card') },
        { id: 'education', element: document.getElementById('educationContainer')?.closest('.section-card') },
        { id: 'projects', element: document.getElementById('projectsContainer')?.closest('.section-card') },
        { id: 'skills', element: document.querySelector('.section-card[data-tooltip="Your skill sets"]') },
        { id: 'interests', element: document.getElementById('interestsContainer')?.closest('.section-card') },
        { id: 'certifications', element: document.getElementById('certificationsContainer')?.closest('.section-card') },
        { id: 'declaration', element: document.getElementById('declaration')?.closest('.section-card') }
    ];

    sections.forEach(section => {
        if (section.element) {
            const header = section.element.querySelector('.section-header');
            if (header) {
                const toggleBtn = document.createElement('button');
                toggleBtn.className = 'visibility-toggle-btn';
                toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
                toggleBtn.title = 'Toggle visibility in preview';
                toggleBtn.onclick = () => toggleSectionVisibility(section.id, toggleBtn);
                
                const controls = header.querySelector('.section-controls');
                if (controls) {
                    controls.insertBefore(toggleBtn, controls.firstChild);
                } else {
                    header.appendChild(toggleBtn);
                }
            }
        }
    });
}

function toggleSectionVisibility(sectionId, button) {
    sectionVisibility[sectionId] = !sectionVisibility[sectionId];
    
    if (sectionVisibility[sectionId]) {
        button.innerHTML = '<i class="fas fa-eye"></i>';
        button.classList.remove('hidden');
    } else {
        button.innerHTML = '<i class="fas fa-eye-slash"></i>';
        button.classList.add('hidden');
    }
    
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
    const panel = document.querySelector('.theme-panel');
    const header = document.querySelector('.theme-header');
    
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;
    
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    
    function dragStart(e) {
        if (e.target === header || header.contains(e.target)) {
            if (e.target.classList.contains('btn-close-modal') || e.target.closest('.btn-close-modal')) return;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
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
                if (id === 'name') {
                    const cleaned = this.value.replace(/[^a-zA-Z\s]/g, '');
                    if (this.value !== cleaned) this.value = cleaned;
                } else if (id === 'phone') {
                    const cleaned = this.value.replace(/[^0-9+\-\s()]/g, '');
                    if (this.value !== cleaned) this.value = cleaned;
                }
                validateInput(this, inputs[id]);
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
        const errorDiv = input.closest('.input-with-clear')?.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
            errorDiv.textContent = '';
        }
        return true;
    }
    
    if (!pattern.test(input.value)) {
        input.classList.add('error');
        return false;
    } else {
        input.classList.remove('error');
        const errorDiv = input.closest('.input-with-clear')?.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
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
        const errorDiv = input.closest('.input-with-clear')?.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
            errorDiv.textContent = messages[type];
        }
        return false;
    }
    
    input.classList.remove('error');
    const errorDiv = input.closest('.input-with-clear')?.nextElementSibling;
    if (errorDiv?.classList.contains('error-message')) {
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
        if (errorDiv?.classList.contains('error-message')) {
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
    
    const showRemove = workExperienceCount > 1;
    
    item.innerHTML = `
        ${showRemove ? `<button class="remove-item" onclick="removeItem('work-${workExperienceCount}')">
            <i class="fas fa-times"></i> Remove
        </button>` : ''}
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
                <input type="date" class="form-control work-start" onchange="calculateWorkDuration('work-${workExperienceCount}')" data-tooltip="Start date">
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">End Date</label>
                <input type="date" class="form-control work-end" onchange="calculateWorkDuration('work-${workExperienceCount}')" data-tooltip="End date (or leave empty for Present)">
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Job Title</label>
            <div class="input-with-clear">
                <input type="text" class="form-control work-title" placeholder="Job Title" data-tooltip="Your role">
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
    
    const showRemove = educationCount > 1;
    
    item.innerHTML = `
        ${showRemove ? `<button class="remove-item" onclick="removeItem('education-${educationCount}')">
            <i class="fas fa-times"></i> Remove
        </button>` : ''}
        <div class="mb-3">
            <label class="form-label">College/University Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control edu-institution" placeholder="Institution Name" data-tooltip="Institution name">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Degree/Course</label>
            <div class="input-with-clear">
                <input type="text" class="form-control edu-degree" placeholder="Degree" data-tooltip="Degree/program">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Year of Completion</label>
            <input type="number" class="form-control edu-year" placeholder="2024" min="1950" max="2050" data-tooltip="Graduation year">
        </div>
        <div class="row">
            <div class="col-md-6 mb-3">
                <label class="form-label">Percentage</label>
                <div class="input-with-clear">
                    <input type="text" class="form-control edu-percentage" placeholder="e.g., 85%" data-tooltip="Enter percentage if applicable">
                    <button class="clear-btn" onclick="clearItemField(this)">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <label class="form-label">GPA</label>
                <div class="input-with-clear">
                    <input type="text" class="form-control edu-gpa" placeholder="e.g., 3.8/4.0" data-tooltip="Enter GPA if applicable">
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
    
    const showRemove = projectCount > 1;
    
    item.innerHTML = `
        ${showRemove ? `<button class="remove-item" onclick="removeItem('project-${projectCount}')">
            <i class="fas fa-times"></i> Remove
        </button>` : ''}
        <div class="mb-3">
            <label class="form-label">Project Name</label>
            <div class="input-with-clear">
                <input type="text" class="form-control proj-name" placeholder="Project Name" data-tooltip="Title of project">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Description</label>
            <div class="input-with-clear">
                <textarea class="form-control proj-desc" rows="2" placeholder="Project Description" data-tooltip="Brief summary"></textarea>
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Project Link</label>
            <div class="input-with-clear">
                <input type="url" class="form-control proj-link" placeholder="https://project-link.com" data-tooltip="Web link">
                <button class="clear-btn" onclick="clearItemField(this)">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="mb-3">
            <label class="form-label">Company/Organization</label>
            <div class="input-with-clear">
                <input type="text" class="form-control proj-company" placeholder="Company Name" data-tooltip="Client/organization">
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
    
    const showRemove = (type === 'personal' && count > 1) || 
                       (type === 'professional' && count > 1) || 
                       (type === 'technical' && count > 1);
    
    const item = document.createElement('div');
    item.className = 'skill-item mb-2';
    item.id = `skill-${type}-${count}`;
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control skill-input-${type}" placeholder="${placeholder}" data-tooltip="${placeholder}" oninput="updateSkillList('${type}')">
            ${showRemove ? `<button class="clear-btn" onclick="removeItem('skill-${type}-${count}'); updateSkillList('${type}')">
                <i class="fas fa-times"></i>
            </button>` : ''}
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
    
    const showRemove = interestCount > 1;
    
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control" placeholder="e.g., Reading, Photography, Traveling" data-tooltip="List your hobbies">
            ${showRemove ? `<button class="clear-btn" onclick="removeItem('interest-${interestCount}')">
                <i class="fas fa-times"></i>
            </button>` : ''}
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
    
    const showRemove = certificationCount > 1;
    
    item.innerHTML = `
        <div class="input-with-clear">
            <input type="text" class="form-control" placeholder="e.g., AWS Certified Solutions Architect" data-tooltip="Add course/certificate details">
            ${showRemove ? `<button class="clear-btn" onclick="removeItem('certification-${certificationCount}')">
                <i class="fas fa-times"></i>
            </button>` : ''}
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

// Get current date formatted
function getCurrentDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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
                    ${linkedin ? `<span><i class="fab fa-linkedin"></i> ${linkedin}</span>` : ''}
                    ${github ? `<span><i class="fab fa-github"></i> ${github}</span>` : ''}
                </div>
            </div>
        </div>
    `;
    
    if (objective && sectionVisibility.objective) {
        html += `
            <div class="resume-section">
                <div class="resume-section-title">Career Objective</div>
                <p>${objective}</p>
            </div>
        `;
    }
    
    // Work Experience
    if (sectionVisibility.work) {
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
    }
    
    // Education
    if (sectionVisibility.education) {
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
    }
    
    // Projects
    if (sectionVisibility.projects) {
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
    }
    
    // Skills
    if (sectionVisibility.skills) {
        const personalSkills = Array.from(document.querySelectorAll('#personalSkillsContainer input')).map(i => i.value).filter(v => v);
        const professionalSkills = Array.from(document.querySelectorAll('#professionalSkillsContainer input')).map(i => i.value).filter(v => v);
        const technicalSkills = Array.from(document.querySelectorAll('#technicalSkillsContainer input')).map(i => i.value).filter(v => v);
        
        if (personalSkills.length || professionalSkills.length || technicalSkills.length) {
            html += '<div class="resume-section"><div class="resume-section-title">Skills</div>';
            
            if (personalSkills.length) {
                html += '<div class="mb-3"><strong>Personal Skills:</strong><ul class="resume-skills-list">';
                personalSkills.forEach(skill => {
                    html += `<li>${skill}</li>`;
                });
                html += '</ul></div>';
            }
            
            if (professionalSkills.length) {
                html += '<div class="mb-3"><strong>Professional Skills:</strong><ul class="resume-skills-list">';
                professionalSkills.forEach(skill => {
                    html += `<li>${skill}</li>`;
                });
                html += '</ul></div>';
            }
            
            if (technicalSkills.length) {
                html += '<div class="mb-3"><strong>Technical Skills:</strong><ul class="resume-skills-list">';
                technicalSkills.forEach(skill => {
                    html += `<li>${skill}</li>`;
                });
                html += '</ul></div>';
            }
            
            html += '</div>';
        }
    }
    
    // Interests (render as bulleted list)
    if (sectionVisibility.interests) {
        const interests = Array.from(document.querySelectorAll('#interestsContainer input')).map(i => i.value).filter(v => v);
        if (interests.length) {
            html += '<div class="resume-section"><div class="resume-section-title">Interests</div>';
            html += '<ul class="resume-interests-list">';
            interests.forEach(interest => {
                html += `<li>${interest}</li>`;
            });
            html += '</ul></div>';
        }
    }
    
    // Certifications
    if (sectionVisibility.certifications) {
        const certifications = Array.from(document.querySelectorAll('#certificationsContainer input')).map(i => i.value).filter(v => v);
        if (certifications.length) {
            html += '<div class="resume-section"><div class="resume-section-title">Certifications</div>';
            certifications.forEach(cert => {
                html += `<div class="resume-item"><div class="resume-item-title">${cert}</div></div>`;
            });
            html += '</div>';
        }
    }
    
    // Declaration with signature line and date
    if (declaration && sectionVisibility.declaration) {
        html += `
            <div class="resume-footer">
                <div style="text-align: left; margin-bottom: 1rem;">
                    <strong>Declaration:</strong> I ${name} hereby declare that all the information provided above is true and accurate to the best of my knowledge.
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                    <div style="text-align: left;">
                        <div style="margin-bottom: 0.5rem;">Date: ${getCurrentDate()}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="border-bottom: 1px solid white; width: 200px; margin-bottom: 0.25rem;"></div>
                        <div style="font-size: 0.85em;">[${name}]</div>
                    </div>
                </div>
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

// Download PDF using html2canvas and jsPDF - matches preview exactly
function downloadPDF() {
    generatePreview();

    // create offscreen clone to control exact layout and ensure header is included
    const original = document.getElementById('resumePreview');
    const clone = original.cloneNode(true);

    // compute A4 width in pixels at 96dpi (210mm)
    const mmToPx = mm => Math.round(mm * (96 / 25.4));
    const a4Px = mmToPx(210);

    // apply compact inline styles to clone to avoid stylesheet interference
    clone.style.cssText = `
        width: ${a4Px}px !important;
        box-sizing: border-box !important;
        background: #ffffff !important;
        padding: 8mm !important;
        margin: 0 !important;
        display: block !important;
    `;

    // make sure header is visible and not clipped
    const header = clone.querySelector('.resume-header');
    if (header) {
        header.style.cssText = `background: ${currentTheme.primaryColor} !important; color: #fff !important; padding: 8px !important; display:flex !important; align-items:center !important; gap:8px !important; height:auto !important; max-height:90px !important; overflow:hidden !important;`;
        const img = header.querySelector('img');
        if (img) img.style.cssText = 'width:40px !important;height:40px !important;border-radius:50% !important;object-fit:cover !important;border:2px solid #fff !important;';
        const name = header.querySelector('.resume-name');
        if (name) name.style.cssText = 'font-size:16px !important;margin:0 !important;';
    }

    // place clone offscreen to render it accurately
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'position:absolute;left:-10000px;top:0;';
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const canvasScale = Math.max(2, Math.round(window.devicePixelRatio || 2));

    html2canvas(clone, {
        scale: canvasScale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0
    }).then(canvas => {
        try {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height] });

            // Add image at 0,0 so header is included at top
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);

            // If canvas height is larger than A4 (in px), create A4 sized PDF pages
            // Create final A4 pdf in mm for saving
            const finalPdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pdfWidthMM = finalPdf.internal.pageSize.getWidth();
            const pxToMm = px => px * 25.4 / 96;
            const imgWidthMM = pxToMm(canvas.width);
            const imgHeightMM = pxToMm(canvas.height);

            // If image fits on one A4 page height, just scale to width
            if (imgHeightMM <= finalPdf.internal.pageSize.getHeight()) {
                finalPdf.addImage(imgData, 'PNG', 0, 0, pdfWidthMM, (imgHeightMM * pdfWidthMM) / imgWidthMM);
            } else {
                // scale image to fit width and add pages by cropping the canvas
                const pageHeightPx = Math.round((finalPdf.internal.pageSize.getHeight() * 96) / 25.4);
                let position = 0;
                while (position < canvas.height) {
                    const pageCanvas = document.createElement('canvas');
                    pageCanvas.width = canvas.width;
                    pageCanvas.height = Math.min(pageHeightPx, canvas.height - position);
                    const ctx = pageCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, position, canvas.width, pageCanvas.height, 0, 0, canvas.width, pageCanvas.height);
                    const pageData = pageCanvas.toDataURL('image/png');
                    const pageHeightMM = pxToMm(pageCanvas.height);
                    finalPdf.addImage(pageData, 'PNG', 0, 0, pdfWidthMM, pageHeightMM);
                    position += pageHeightPx;
                    if (position < canvas.height) finalPdf.addPage();
                }
            }

            finalPdf.save(`resume_${new Date().getTime()}.pdf`);
        } finally {
            // cleanup
            document.body.removeChild(wrapper);
        }
    }).catch(err => {
        document.body.removeChild(wrapper);
        console.error('PDF error', err);
        alert('Error generating PDF.');
    });
}

// Download Word with exact preview match
function downloadWord() {
    generatePreview();

    // Clone preview and apply strict pixel-based inline styles (Word interprets px reliably)
    const original = document.getElementById('resumePreview');
    const clone = original.cloneNode(true);

    // Remove unwanted elements
    clone.querySelectorAll('script, style, .no-print').forEach(el => el.remove());

    // Inline header adjustments (use px units)
    const header = clone.querySelector('.resume-header');
    if (header) {
        header.style.cssText = `background:${currentTheme.primaryColor};color:#fff;padding:6px 8px;margin:0 0 6px 0;display:flex;align-items:center;gap:8px;height:auto;max-height:70px;overflow:hidden;box-sizing:border-box;`;
        const img = header.querySelector('img');
        if (img) img.style.cssText = 'width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #fff;';
        const name = header.querySelector('.resume-name');
        if (name) name.style.cssText = 'font-size:16px;font-weight:700;margin:0;';
    }

    // Compact contact
    clone.querySelectorAll('.resume-contact').forEach(el => el.style.cssText = 'font-size:11px;margin:0;display:flex;gap:6px;flex-wrap:wrap;');

    // Reduce section and item spacing
    clone.querySelectorAll('.resume-section').forEach(el => el.style.marginBottom = '6px');
    clone.querySelectorAll('.resume-section-title').forEach(el => el.style.cssText = 'font-size:13px;font-weight:700;margin:0 0 4px 0;padding:0;border-bottom:1px solid ' + currentTheme.primaryColor + ';');
    clone.querySelectorAll('.resume-item').forEach(el => el.style.marginBottom = '4px');
    clone.querySelectorAll('.resume-item-title').forEach(el => el.style.fontSize = '12px');
    clone.querySelectorAll('.resume-item-subtitle').forEach(el => el.style.fontSize = '11px');
    clone.querySelectorAll('.resume-item-date').forEach(el => el.style.fontSize = '10px');

    // Prepare HTML with conservative page margins and px sizes
    const htmlContent = `<!doctype html><html><head><meta charset="utf-8"><title>Resume</title>
        <style>
            *{box-sizing:border-box;margin:0;padding:0}
            @page{size:A4;margin:18mm}
            body{font-family:${currentTheme.fontFamily};font-size:12px;color:#1f2937}
            .resume-header{width:100%}
        </style></head><body>${clone.innerHTML}</body></html>`;

    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `resume_${new Date().getTime()}.doc`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
}