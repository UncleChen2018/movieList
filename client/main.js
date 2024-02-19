const newsList = document.querySelectorAll('.news-list li');
console.log(newsList);
function addButtons() {
  newsList.forEach((item) => {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-div');
    item.insertAdjacentElement('beforeend', buttonDiv);
    // add search button
    const searchWord = item.querySelector('strong').innerText;
    const searchButton = document.createElement('button');
    searchButton.classList.add('search');
    searchButton.innerHTML = '<i class="fa-brands fa-google"></i>Search in Google';
    searchButton.addEventListener('click', () => {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchWord)}`;
        window.open(googleSearchUrl, '_blank');
    });
    buttonDiv.appendChild(searchButton);
    // add highlight button
    const highlightButton = document.createElement('button');
    highlightButton.classList.add('highlight');
    highlightButton.innerHTML = '<i class="fa-solid fa-highlighter"></i>Highlight this news';
    highlightButton.addEventListener('click', (event) => {
        const p = event.target.closest('li').querySelector('p');
        p.classList.toggle('highlighted');
        const isHighlighted = p.classList.contains('highlighted');
        event.target.classList.toggle('highlighted');
        if (isHighlighted) {
            event.target.innerHTML = '<i class="fa-solid fa-highlighter"></i>Remove highlight';
        }else{ 
            event.target.innerHTML = '<i class="fa-solid fa-highlighter"></i>Highlight this news';
        }
        
    });
    buttonDiv.appendChild(highlightButton);
    // add delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>Delete this news';
    buttonDiv.appendChild(deleteButton);
    deleteButton.addEventListener('click', (event) => {        
      event.target.closest('li').remove();
      alert('The news will been deleted');
    });
  });
}


function updateCurrentDateTime() {
    const currentDate = new Date();
    const formattedDateTime = currentDate.toLocaleString();
    document.getElementById('currentDateTime').textContent = formattedDateTime;

    document.getElementById('currentDateTime').textContent = formattedDateTime;
  }

  // Initial update
  updateCurrentDateTime();

  // Update every second (1000 milliseconds)
  setInterval(updateCurrentDateTime, 1000);



document.addEventListener('DOMContentLoaded', addButtons);
