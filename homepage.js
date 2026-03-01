function openCity(evt, cityName) 
{
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) 
  {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) 
  {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

async function checkServer() {
        console.log("Button clicked");

        try {
            const response = await fetch("https://producktionserver.sylvanbuckwilliams.com/api/dueThisMonth");

            console.log("Raw response:", response);

            if (!response.ok) 
            {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error:", error);
        }
    }

let studentData = null;

async function getInfo() 
{
  studentData = await checkServer();

  console.log('studentData object:', studentData);
  const output = document.getElementById('jsonOutput');
  if (!output) 
  {
    return;
  }

  if (Array.isArray(studentData)) 
  {
    const days = [];
    studentData.forEach(course => 
    {
      if (course && Array.isArray(course.assignments)) 
      {
        course.assignments.forEach(a => 
        {
          if (a && typeof a.days_remaining !== 'undefined') 
          {
            days.push(a.days_remaining);
          }
        });
      }
    });
    output.textContent = days.join(', ');

    const schoolTable = document.getElementById('schoolTable');
    if (schoolTable) 
    {
      while (schoolTable.rows.length > 1) 
      {
        schoolTable.deleteRow(1);
      }
      studentData.forEach((course, courseIdx) => 
      {
        if (course && Array.isArray(course.assignments)) 
        {
          course.assignments.forEach((a, assignIdx) => 
          {
            const row = schoolTable.insertRow();
            row.dataset.type = 'server';
            row.dataset.courseIdx = courseIdx;
            row.dataset.assignIdx = assignIdx;
            row.innerHTML = `
              <td><p>${course.course_name}</p></td>
              <td><p>${a.name}</p></td>
              <td><p></p></td>
              <td><p>${a.due}</p></td>
              <td><input type="checkbox" class="deleteCheckbox"></td>
            `;
          });
        }
      });
      
      const localAssignments = getLocalAssignments();
      localAssignments.forEach((a, idx) => 
      {
        const row = schoolTable.insertRow();
        row.dataset.type = 'local';
        row.dataset.localIdx = idx;
        row.innerHTML = `
          <td><p>${a.className}</p></td>
          <td><p>${a.assignmentName}</p></td>
          <td><p></p></td>
          <td><p>${a.dueDate}</p></td>
          <td><input type="checkbox" class="deleteCheckbox"></td>
        `;
      });
      
      setupCheckboxes();
    }
  } else if (studentData && typeof studentData.days_remaining !== 'undefined') 
  {
    output.textContent = studentData.days_remaining;
  } 
  else if (studentData && typeof studentData.name !== 'undefined') 
  {
    output.textContent = studentData.name;
  } 
  else 
  {
    output.textContent = JSON.stringify(studentData, null, 2);
  }
}

window.addEventListener('load', getInfo);

// helpers to manage locally-added assignments in localStorage
function getLocalAssignments() 
{
  const stored = localStorage.getItem('addedAssignments');
  return stored ? JSON.parse(stored) : [];
}

function saveLocalAssignments(assignments) 
{
  localStorage.setItem('addedAssignments', JSON.stringify(assignments));
}

function addAssignmentRow() 
{
  const className = prompt('Enter class name:');
  if (className === null) return;
  
  const assignmentName = prompt('Enter assignment name:');
  if (assignmentName === null) return;
  
  const dueDate = prompt('Enter due date:');
  if (dueDate === null) return;
  
  const local = getLocalAssignments();
  local.push({ className, assignmentName, dueDate });
  saveLocalAssignments(local);
  
  const schoolTable = document.getElementById('schoolTable');
  if (schoolTable) 
  {
    const row = schoolTable.insertRow();
    const localIdx = getLocalAssignments().length - 1; // index of the newly added item
    row.dataset.type = 'local';
    row.dataset.localIdx = localIdx;
    row.innerHTML = `
      <td><p>${className}</p></td>
      <td><p>${assignmentName}</p></td>
      <td><p></p></td>
      <td><p>${dueDate}</p></td>
      <td><input type="checkbox" class="deleteCheckbox"></td>
    `;
    // attach the checkbox listener to the new row
    setupCheckboxes();
  }
}

function setupCheckboxes() 
{
  const checkboxes = document.querySelectorAll('.deleteCheckbox');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function(e) {
      if (this.checked) {
        const row = this.closest('tr');
        const type = row.dataset.type;
        
        if (type === 'local') {
          // remove from localStorage
          const idx = parseInt(row.dataset.localIdx);
          const local = getLocalAssignments();
          local.splice(idx, 1);
          saveLocalAssignments(local);
        }
        
        // delete the row from the table
        row.remove();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() 
{
  var firstTab = document.querySelector('.tablinks');
  if (firstTab) 
  {
    firstTab.click();
  }

  const images = document.querySelectorAll('.ducks');
  images.forEach(img => 
    {
      if (!img.complete) 
      {
        img.addEventListener('load', () => setupDuck(img));
      } 
      else
      {
      setupDuck(img);
      }
    });
});

function setupDuck(img) 
{
  img.style.left = Math.random() * (window.innerWidth - img.width) + 'px';

  let direction = Math.random() < 0.5 ? -1 : 1;
  const speed = 0.2 + Math.random() * 0.5;

  if (img.dataset.altSrc) 
  {
    setInterval(() => 
    {
      const tmp = img.src;
      img.src = img.dataset.altSrc;
      img.dataset.altSrc = tmp;
    }, 1000);
  }

  function move() 
  {
    let currentLeft = parseFloat(img.style.left) || 0;
    currentLeft += speed * direction;
    if (currentLeft <= 0) direction = 1;
    if (currentLeft >= window.innerWidth - img.width) direction = -1;
    if (direction === 1) 
    {
        img.classList.add('flipped');
    } 
    else 
    {
        img.classList.remove('flipped');
    }
    img.style.left = currentLeft + 'px';
    requestAnimationFrame(move);
  }

  move();
}
