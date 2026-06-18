const upload = document.querySelector('#User_Pdf');
const pdffiles = document.getElementById('pdfFiles');
const ListFiles = document.getElementById('FileList');
const label = document.querySelector('.file-label');
const mergeBtn = document.getElementById('MergeBtn');
const addIcon = document.querySelector('.add-icon');
const DownloadBtn = document.getElementById('Download');
const LoadingCircle = document.getElementById('loadingSection');
const Tagline = document.querySelector('.top')
const percent = document.getElementById('percent');

const formData = new FormData();

// Function to fetch files and send to server
async function fetchFiles(e) {
  LoadingCircle.style.display = 'block';
  percent.innerText = "0%";
  mergeBtn.value = "Merging...";
  setTimeout(() => {
    percent.innerText = "30%";
  }, 500);

  setTimeout(() => {
    percent.innerText = "90%";
  }, 5000);

  console.log("Merge button clicked and file lenght is: ", formData.getAll('pdfFiles').length);
  const options = {
    method: 'POST',
    body: formData,
  };

  const response = await fetch("/uploads", options);
  if (response.ok) {
    const blob = await response.blob();
    percent.innerText = "100%";

    const UploadObjects = [mergeBtn, label, ListFiles];
    for (let item of UploadObjects) {
      item.style.display = 'none';
    }
    LoadingCircle.style.display = 'none';

    DownloadBtn.style.display = 'flex';
    DownloadBtn.classList.add('flex-all');

    DownloadBtn.addEventListener('click', () => {
      console.log("Donwload Button clicked")

      const dynamicDownloadUrl = URL.createObjectURL(blob);
      console.log(dynamicDownloadUrl);
      DownloadBtn.href = dynamicDownloadUrl;
      DownloadBtn.download = "your-merged-document.pdf";

    })

  } else {
    console.error("Download Failed");
  }
}

//Function to handle file selection
async function HandleFileSelect(e) {
  console.log("Label button clicked");
  // Reading the files and appending to formData
  for (const file of pdffiles.files) {
    if (file.type != 'application/pdf') {
      alert("Invalid File! Select only PDFs");
      return;
    }
    else {

      formData.append('pdfFiles', file);
    }
    console.log("File type", file.type)
  }

  //Creating a list item to display the list of selected files on the webpage
  //Appending the name of the selected files to the list item via for loop
  //Appending the list item to the file list to print the list on the webpage
  Tagline.style.display = 'none';
  ListFiles.style.display = 'flex';
  ListFiles.style.justifyContent = 'center';
  ListFiles.classList.add('flex-dir-c');
  const listItem = document.createElement('li');
  listItem.style.fontFamily = 'monospace';
  for (const file of pdffiles.files) {
    listItem.textContent += `${file.name}, `;
  }

  ListFiles.appendChild(listItem);


  //Changing the label to a check icon by removing the add-icon class and adding the material-symbols-outlined and check-icon classes and changing the innerHTML to check_circle
  label.classList.add('material-symbols-outlined', 'add-icon');
  label.classList.remove('file-label');
  label.innerHTML = "add_circle";
  label.style.marginBottom = "40px";


  //Checking if more than 1 file is selected to enable merge button
  if (formData.getAll('pdfFiles').length > 1) {
    //Enabling merge button
    mergeBtn.style.backgroundColor = "white";
    mergeBtn.style.color = "black";
    mergeBtn.style.cursor = "pointer";
    //Adding event listener to merge button to trigger fetchFiles function on click
    mergeBtn.addEventListener('click', (e) => fetchFiles(e));
  }

}


// Event listener for file selection
pdffiles.addEventListener('change', (e) => HandleFileSelect(e));

