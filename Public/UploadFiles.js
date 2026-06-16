const upload = document.querySelector('#User_Pdf');
const pdffiles = document.getElementById('pdfFiles');
const ListFiles = document.getElementById('FileList');
const label = document.querySelector('.file-label');
const mergeBtn = document.getElementById('MergeBtn');
const addIcon = document.querySelector('.add-icon');


const formData = new FormData();

// Function to fetch files and send to server
async function fetchFiles() {

  console.log("Merge button clicked and file lenght is: ", formData.getAll('pdfFiles').length);
  const options = {
    method: 'POST',
    body: formData,
  };

  const response = await fetch("/uploads", options);
  const data = await response.json();
  if (response.ok) {
    // Manually trigger the download or redirect once you know the file is ready
    window.location.href = data.downloadUrl; // This will redirect the user to the download URL 
  } else {
    console.error("Upload failed");
  }
  console.log(data);

}

//Function to handle file selection
async function HandleFileSelect(e) {
  console.log("Label button clicked");
    // Reading the files and appending to formData
    for (const file of pdffiles.files) {
      if(file.type != 'application/pdf'){
        alert("Invalid File! Select only PDFs");
        return;
      }
      else{
      formData.append('pdfFiles', file);
      }
      console.log("File type", file.type)
    }

    //Creating a list item to display the list of selected files on the webpage
    //Appending the name of the selected files to the list item via for loop
    //Appending the list item to the file list to print the list on the webpage
    ListFiles.style.display = "block";
    const listItem = document.createElement('li');
    listItem.classList.add('flex');
    listItem.classList.add('flex-dir-c');
    listItem.style.fontFamily = 'Sans-Serif';
    for (const file of pdffiles.files) {
      listItem.textContent += `${file.name}, `;
    }
    ListFiles.appendChild(listItem);


    //Changing the label to a check icon by removing the add-icon class and adding the material-symbols-outlined and check-icon classes and changing the innerHTML to check_circle
    label.classList.add('material-symbols-outlined', 'add-icon');
    label.classList.remove('file-label');
    label.innerHTML = "add_circle";

    //Checking if more than 1 file is selected to enable merge button
    if (formData.getAll('pdfFiles').length > 1) {
      //Enabling merge button
      mergeBtn.style.backgroundColor = "black";
      mergeBtn.style.color = "white";
      mergeBtn.style.cursor = "pointer";
      //Adding event listener to merge button to trigger fetchFiles function on click
      mergeBtn.addEventListener('click', fetchFiles);
    }

}


// Event listener for file selection
pdffiles.addEventListener('change', (e) => HandleFileSelect(e));

