function openTab(evt, cityName) 
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

  const ducks = document.querySelectorAll(".ducks");
  const shop = document.querySelector(".shop");
  const clouds = document.querySelector(".clouds");
  const foreground = document.querySelector(".foreground");

if (cityName === "Blank") 
{
    ducks.forEach(duck => duck.style.display = "block");
    if (shop) shop.style.display = "block";
    if (clouds) clouds.style.display = "block";
    if (foreground) foreground.style.display = "block";
} 
else 
{
    ducks.forEach(duck => duck.style.display = "none");
    if (shop) shop.style.display = "none";
    if (clouds) hill.style.display = "none";
    if (foreground) foreground.style.display = "none";
}
}

async function checkServer() {
  console.log("Fetching server data...");
  try {
    const response = await fetch("https://producktionserver.sylvanbuckwilliams.com/api/dueThisMonth");
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    console.log("Server data received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return null;
  }
}

async function getInfo() {
  const schoolTable = document.getElementById('schoolTable');
  if (!schoolTable) {
    console.error('schoolTable not found');
    return;
  }

  // Clear existing rows (except header)
  while (schoolTable.rows.length > 1) {
    schoolTable.deleteRow(1);
  }

  // 1️⃣ Populate local assignments immediately
  const localAssignments = getLocalAssignments();
  localAssignments.forEach((a, idx) => {
    const row = schoolTable.insertRow();
    row.dataset.type = 'local';
    row.dataset.localIdx = idx;
    row.innerHTML = `
      <td></td>
      <td><p>${a.assignmentName}</p></td>
      <td><p></p></td>
      <td><p>${a.dueDate}</p></td>
      <td><input type="checkbox" class="deleteCheckbox"></td>
    `;
  });

  setupCheckboxes();

  // 2️⃣ Fetch server data asynchronously
  try {
    const serverData = await checkServer();
    if (!serverData || !Array.isArray(serverData)) return;

    serverData.forEach((a, idx) => {
      const row = schoolTable.insertRow();
      row.dataset.type = 'server';
      row.dataset.assignIdx = idx;
      row.innerHTML = `
        <td><p>${a.course_name}</p></td>
        <td><p>${a.name}</p></td>
        <td><p></p></td>
        <td><p>${a.due}</p></td>
        <td><input type="checkbox" class="deleteCheckbox"></td>
      `;
    });

    setupCheckboxes();
  } catch (err) {
    console.error('Error fetching server data:', err);
  }
}

async function fetchCompleted() {
  try {
    const resp = await fetch("https://producktionserver.sylvanbuckwilliams.com/api/getCompleted");
    console.log("Completed response:", resp);
    if (!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }
    const data = await resp.json();

    const container = document.getElementById('classesList');
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    if (Array.isArray(data)) {
      data.forEach(item => {
        const entry = document.createElement('div');
        entry.className = 'classEntry';

        const gradeDiv = document.createElement('div');
        gradeDiv.className = 'classInfo.grade';
        gradeDiv.textContent = (typeof item.percent_completed !== 'undefined') ? `${item.percent_completed}%` : '';

        const nameDiv = document.createElement('div');
        nameDiv.className = 'classInfo.name';
        nameDiv.textContent = item.course_name || '';

        entry.appendChild(gradeDiv);
        entry.appendChild(nameDiv);
        container.appendChild(entry);
      });
    } else {
      container.textContent = JSON.stringify(data);
    }
  } catch (error) {
    console.error('Error fetching completed:', error);
  }
}

window.addEventListener('load', function() {
  // Open School tab immediately
  const schoolTab = document.querySelector("button.tablinks[onclick=\"openTab(event, 'School')\"]");
  if (schoolTab) schoolTab.click();

  // Populate assignments asynchronously
  getInfo();
  fetchCompleted();
});

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
    const localIdx = getLocalAssignments().length - 1;
    row.dataset.type = 'local';
    row.dataset.localIdx = localIdx;
    row.innerHTML = `
      <td><p>${className}</p></td>
      <td><p>${assignmentName}</p></td>
      <td><p></p></td>
      <td><p>${dueDate}</p></td>
      <td><input type="checkbox" class="deleteCheckbox"></td>
    `;
    setupCheckboxes();
  }
}

function setupCheckboxes() 
{
  const checkboxes = document.querySelectorAll('.deleteCheckbox');
  checkboxes.forEach(checkbox => 
    {
    checkbox.addEventListener('change', function(e) 
    {
      if (this.checked) {
        const row = this.closest('tr');
        const type = row.dataset.type;
        
        if (type === 'local') 
        {
          const idx = parseInt(row.dataset.localIdx);
          const local = getLocalAssignments();
          local.splice(idx, 1);
          saveLocalAssignments(local);
        }
        
        row.remove();
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () 
{
  const ducks = document.querySelectorAll(".ducks");

  ducks.forEach((duck) => 
  {
    let direction = Math.random() < 0.5 ? -1 : 1;
    let speed = 0.3 + Math.random() * 1.2;
    let position = 0;

    duck.style.position = duck.style.position || 'absolute';

    const screenWidth = window.innerWidth;
    const duckWidth = duck.offsetWidth || duck.getBoundingClientRect().width || 50;
    position = Math.random() * Math.max(0, screenWidth - duckWidth);
    duck.style.left = position + "px";

    function animateDuck() 
    {
      const sw = window.innerWidth;
      const dw = duck.offsetWidth || duck.getBoundingClientRect().width || 50;

      if (position <= 0) direction = 1;
      if (position >= sw - dw) direction = -1;

      position += direction * speed;
      duck.style.left = position + "px";
      duck.style.transform = direction === 1 ? "scaleX(-1)" : "scaleX(1)";

      requestAnimationFrame(animateDuck);
    }

    setInterval(() => 
    {
      direction = Math.random() < 0.5 ? -1 : 1;
    }, Math.random() * 3000 + 2000);

    window.addEventListener('resize', () => 
    {
      const sw2 = window.innerWidth;
      const dw2 = duck.offsetWidth || duck.getBoundingClientRect().width || 50;
      position = Math.min(position, Math.max(0, sw2 - dw2));
      duck.style.left = position + 'px';
    });

    animateDuck();
  });
});
