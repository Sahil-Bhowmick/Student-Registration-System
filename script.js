document.addEventListener("DOMContentLoaded", () => {
  const studentForm = document.getElementById("studentForm");
  const addBtn = document.getElementById("addBtn");
  const updateBtn = document.getElementById("updateBtn");
  const resetBtn = document.getElementById("resetBtn");
  const tableBody = document.getElementById("tableBody");
  const successMessage = document.createElement("div");
  successMessage.id = "successMessage";
  document.body.insertBefore(successMessage, document.body.firstChild);

  // Load existing students from local storage or initialize an empty array
  const students = JSON.parse(localStorage.getItem("students")) || [];
  let editIndex = -1; // Index to track which student is being edited

  // Display existing students on page load
  displayStudents();

  // Event listener for the "Add" button
  addBtn.addEventListener("click", () => {
    const student = getFormData(); // Get form data
    clearErrors(); // Clear any existing error messages

    if (validateForm(student)) {
      // Validate form data
      if (isDuplicateStudent(student)) {
        // Check for duplicate student
        alert("Student is already registered with this ID or email.");
        return;
      }

      students.push(student); // Add new student to the array
      updateLocalStorage(); // Update local storage
      displayStudents(); // Refresh the student list display
      showSuccessMessage("Student added successfully!"); // Show success message
      resetForm(); // Reset the form fields
    }
  });

  // Event listener for the "Update" button
  updateBtn.addEventListener("click", () => {
    const student = getFormData(); // Get updated form data
    clearErrors(); // Clear any existing error messages

    if (validateForm(student)) {
      // Validate updated data
      students[editIndex] = student; // Update the existing student
      updateLocalStorage(); // Update local storage
      displayStudents(); // Refresh the student list display
      showSuccessMessage("Student updated successfully!"); // Show success message
      resetForm(); // Reset the form fields
      switchToAddMode(); // Switch back to add mode
    }
  });

  // Event listener for the "Reset" button
  resetBtn.addEventListener("click", resetForm); // Reset the form fields

  // Function to collect data from the form
  function getFormData() {
    return {
      name: document.getElementById("studentName").value.trim(),
      id: document.getElementById("studentID").value.trim(),
      roll: document.getElementById("rollNumber").value.trim(),
      email: document.getElementById("email").value.trim(),
      contact: document.getElementById("contactNo").value.trim(),
    };
  }

  // Function to display the list of students in the table
  function displayStudents() {
    tableBody.innerHTML = ""; // Clear current table content
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
      tableBody.innerHTML += row; // Append new row to the table body
    });
  }

  // Function to check for duplicate students based on ID or email
  function isDuplicateStudent(student) {
    return students.some(
      (existingStudent) =>
        existingStudent.id === student.id ||
        existingStudent.email === student.email
    );
  }

  // Function to validate the form data
  function validateForm(student) {
    let isValid = true;

    // Validate student name
    if (!student.name || !/^[A-Za-z\s]+$/.test(student.name)) {
      showError(
        "nameError",
        "Please enter a valid student name (letters only)."
      );
      isValid = false;
    }
    // Validate student ID
    if (!student.id || !/^\d+$/.test(student.id)) {
      showError("idError", "Please enter a valid student ID (numbers only).");
      isValid = false;
    }
    // Validate roll number
    if (!student.roll || !/^\d+$/.test(student.roll)) {
      showError(
        "rollError",
        "Please enter a valid roll number (numbers only)."
      );
      isValid = false;
    }
    // Validate email address
    if (!student.email || !validateEmail(student.email)) {
      showError("emailError", "Please enter a valid email address.");
      isValid = false;
    }
    // Validate contact number
    if (!student.contact || !/^\d{10}$/.test(student.contact)) {
      showError(
        "contactError",
        "Please enter a valid 10-digit contact number."
      );
      isValid = false;
    }

    return isValid; // Return the validity status
  }

  // Function to validate email format
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email); // Check if email matches regex
  }

  // Function to display error messages
  function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message; // Set error message
  }

  // Function to clear existing error messages
  function clearErrors() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((el) => (el.textContent = "")); // Clear each error message
  }

  // Function to edit a student entry
  window.editStudent = (index) => {
    const student = students[index]; // Get student data by index
    // Populate form fields with student data
    document.getElementById("studentName").value = student.name;
    document.getElementById("studentID").value = student.id;
    document.getElementById("rollNumber").value = student.roll;
    document.getElementById("email").value = student.email;
    document.getElementById("contactNo").value = student.contact;
    editIndex = index; // Set edit index
    switchToUpdateMode(); // Switch to update mode
  };

  // Function to delete a student entry
  window.deleteStudent = (index) => {
    if (confirm("Are you sure you want to delete this student?")) {
      students.splice(index, 1); // Remove student from the array
      updateLocalStorage(); // Update local storage
      displayStudents(); // Refresh the student list display
      showSuccessMessage("Student deleted successfully!"); // Show success message
    }
  };

  // Function to switch the form to update mode
  function switchToUpdateMode() {
    addBtn.style.display = "none"; // Hide add button
    updateBtn.style.display = "inline"; // Show update button
  }

  // Function to switch the form back to add mode
  function switchToAddMode() {
    addBtn.style.display = "inline"; // Show add button
    updateBtn.style.display = "none"; // Hide update button
  }

  // Function to reset the form fields
  function resetForm() {
    studentForm.reset(); // Reset form fields
    clearErrors(); // Clear any existing error messages
    editIndex = -1; // Reset edit index
    switchToAddMode(); // Switch back to add mode
  }

  // Function to update local storage with the current students array
  function updateLocalStorage() {
    try {
      localStorage.setItem("students", JSON.stringify(students)); // Save students array
    } catch (e) {
      console.error("Error saving to localStorage:", e); // Log any errors
    }
  }

  // Function to show success messages for a limited time
  function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }
});

// Set the dynamic copyright year in the footer
document.getElementById("currentYear").textContent = new Date().getFullYear();
