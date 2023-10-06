let collapsibleHeaders = document.querySelector('.collapsible-header');
//let resetBtn = document.querySelector('.reset');

// Get modal DOM Elements
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");
const proceedBtn = document.querySelector('.btnProceed');

// Event listener to the open modal when the reset Count button is clicked
openModalBtn.addEventListener("click", openModal);
// Event listener for the proceed button on the modal
proceedBtn.addEventListener("click", redirect);
// Event Listener to close the modal when the close button or overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

collapsibleHeaders.addEventListener('click',toggleExamples);
//resetBtn.addEventListener('click',openModal);

function toggleExamples() {
	// adds and removes the expanded class
    this.parentElement.classList.toggle('expanded');
    
    // Update section heading
    if(this.parentElement.classList.contains('expanded')){
        this.innerHTML = "<h2>Hide examples</h2>";
    }
    else{
        this.innerHTML = "<h2>Show examples</h2>";
    }
}

//Event Listener to close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
      closeModal();
    }
  });
 
  // Open modal function
  function openModal(){
     // removes the hidden class to show the modal and overlay
     modal.classList.remove("hidden");
     overlay.classList.remove("hidden");
  }
  
  // Close modal function
  function closeModal(){
     // adds the hidden class to show the modal and overlay
     modal.classList.add("hidden");
     overlay.classList.add("hidden");
  }
  
  // show an alert before resetting the app.
  function redirect(){
    closeModal();
     
    if (modal.classList.contains("hidden")) {
       window.location.href='/reset';
    }
  }

// Automatically remove flash messages after 3 seconds
setTimeout(() => {
    const flashMessages = document.querySelectorAll(".message");
    flashMessages.forEach((message) => {
        message.remove();
    });
}, 3000);