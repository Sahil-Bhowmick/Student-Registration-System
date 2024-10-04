document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const addBtn = document.getElementById("addBtn");
  const updateBtn = document.getElementById("updateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const tableBody = document.getElementById("tableBody");
  const students = JSON.parse(localStorage.getItem("students")) || [];
  let editIndex = -1;

  // Display existing students on load
  displayStudents();

  addBtn.addEventListener("click", () => {
    const student = getFormData();
    clearErrors();

    if (validateForm(student)) {
      students.push(student);
      updateLocalStorage();
      displayStudents();
      showSuccessMessage("Student added successfully!");
      resetForm();
    }
  });

  updateBtn.addEventListener("click", () => {
    const student = getFormData();
    clearErrors();

    if (validateForm(student)) {
      students[editIndex] = student;
      updateLocalStorage();
      displayStudents();
      showSuccessMessage("Student updated successfully!");
      resetForm();
      switchToAddMode();
    }
  });

  resetBtn.addEventListener("click", resetForm);

  function getFormData() {
    return {
      name: document.getElementById("studentName").value.trim(),
      id: document.getElementById("studentID").value.trim(),
      roll: document.getElementById("rollNumber").value.trim(),
      email: document.getElementById("email").value.trim(),
      contact: document.getElementById("contactNo").value.trim(),
    };
  }

  function displayStudents() {
    tableBody.innerHTML = "";
    students.forEach((student, index) => {
      const row = `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.id}</td>
                    <td>${student.roll}</td>
                    <td>${student.email}</td>
                    <td>${student.contact}</td>
                    <td class="actions">
                        <button class="edit" onclick="editStudent(${index})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteStudent(${index})">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </td>
                </tr>`;
      tableBody.innerHTML += row;
    });
  }

  function validateForm(student) {
    let isValid = true;

    if (!student.name) {
      showError("nameError", "Please enter the student's name.");
      isValid = false;
    }
    if (!student.id) {
      showError("idError", "Please enter the student ID.");
      isValid = false;
    }
    if (!student.roll) {
      showError("rollError", "Please enter the roll number.");
      isValid = false;
    }
    if (!student.email || !validateEmail(student.email)) {
      showError("emailError", "Please enter a valid email address.");
      isValid = false;
    }
    if (!student.contact) {
      showError("contactError", "Please enter the contact number.");
      isValid = false;
    }

    return isValid;
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
  }

  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.textContent = ""));
  }

  window.editStudent = (index) => {
    const student = students[index];
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentID").value = student.id;
    document.getElementById("rollNumber").value = student.roll;
    document.getElementById("email").value = student.email;
    document.getElementById("contactNo").value = student.contact;
    editIndex = index;
    switchToUpdateMode();
  };

  window.deleteStudent = (index) => {
    if (confirm("Are you sure you want to delete this student?")) {
      students.splice(index, 1);
      updateLocalStorage();
      displayStudents();
      showSuccessMessage("Student deleted successfully!");
    }
  };

  function switchToUpdateMode() {
    addBtn.style.display = "none";
    updateBtn.style.display = "inline";
  }

  function switchToAddMode() {
    addBtn.style.display = "inline";
    updateBtn.style.display = "none";
  }

  function resetForm() {
    studentForm.reset();
    clearErrors();
    editIndex = -1;
    switchToAddMode();
  }

  function updateLocalStorage() {
    try {
      localStorage.setItem("students", JSON.stringify(students));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }

  function showSuccessMessage(message) {
    const successElement = document.getElementById("successMessage");
    successElement.textContent = message;
    successElement.style.display = "block";
    setTimeout(() => {
      successElement.style.display = "none";
    }, 3000); // Hide after 3 seconds
  }
});
// Set the dynamic copyright year
document.getElementById("currentYear").textContent = new Date().getFullYear();
