let sortOrderAsc = true; // To track the current sort order

// Define the functions that will be used to sort, filter, and search the albums.
function sortAlbums() {
    const grid = document.getElementById('album-grid');
    const albums = Array.from(grid.getElementsByClassName('album'));
    const sortOption = document.getElementById('sort-options').value;

    // Sort the albums based on the selected sort option.
    albums.sort((a, b) => {
        let aValue, bValue;
        switch (sortOption) {
            case 'title':
                aValue = a.getAttribute('data-title').toLowerCase();
                bValue = b.getAttribute('data-title').toLowerCase();
                break;
            case 'artist':
                aValue = a.getAttribute('data-artist').toLowerCase();
                bValue = b.getAttribute('data-artist').toLowerCase();
                break;
            case 'date':
                aValue = new Date(a.getAttribute('data-date'));
                bValue = new Date(b.getAttribute('data-date'));
                break;
            default:
                return 0;
        }

        if (aValue < bValue) return sortOrderAsc ? -1 : 1;
        if (aValue > bValue) return sortOrderAsc ? 1 : -1;
        return 0;
    });

    // Clear the grid and append sorted albums
    while (grid.firstChild) {
        grid.removeChild(grid.firstChild);
    }
    albums.forEach(album => grid.appendChild(album));
}

// Function to toggle the sort order between ascending and descending.
function toggleSortOrder() {
    sortOrderAsc = !sortOrderAsc;
    document.getElementById('sort-order-btn').textContent = sortOrderAsc ? '↑' : '↓';
    sortAlbums();
}

// Function to filter the albums based on the selected tags.
function filterAlbums() {
    console.log('filterAlbums called');
    const selectedOptions = Array.from(document.getElementById('filter-tags').selectedOptions).map(option => option.value.toLowerCase());
    console.log('Selected options:', selectedOptions);
    const albums = document.getElementsByClassName('album');

    Array.from(albums).forEach(album => {
        const genres = album.getAttribute('data-genres').toLowerCase().split(',').map(g => g.trim().replace('#', ''));
        const arts = album.getAttribute('data-art').toLowerCase().split(',').map(a => a.trim().replace('#', ''));
        const allTags = [...genres, ...arts];
        console.log('Album tags:', allTags);
        const match = selectedOptions.length === 0 || selectedOptions.every(filter => allTags.some(tag => tag.includes(filter)));
        album.style.display = match ? 'block' : 'none';
        console.log('Album display:', album.style.display);
    });
}

// Function to search for albums based on the search term.
function searchAlbums() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const albums = document.getElementsByClassName('album');

    Array.from(albums).forEach(album => {
        const title = album.getAttribute('data-title').toLowerCase();
        const artist = album.getAttribute('data-artist').toLowerCase();
        const date = album.getAttribute('data-date').toLowerCase();
        const genres = album.getAttribute('data-genres').toLowerCase();
        const arts = album.getAttribute('data-art').toLowerCase();
        const match = title.includes(searchTerm) || artist.includes(searchTerm) || date.includes(searchTerm) || genres.includes(searchTerm) || arts.includes(searchTerm);
        album.style.display = match ? 'block' : 'none';
    });
}

// Function to show and hide popups when clicking on album images
function showPopup(element) {
    const popup = element.nextElementSibling;
    const allPopups = document.querySelectorAll('.popup');
    allPopups.forEach(p => p.style.display = 'none'); // Hide all popups
    popup.style.display = 'block';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '60%'; // Ensure larger size for clicked popup
    document.body.style.overflow = 'hidden';

    // Add close button to the center popup if it doesn't exist
    if (!popup.querySelector('.close-popup')) {
        const closeButton = document.createElement('span');
        closeButton.className = 'close-popup';
        closeButton.textContent = 'X';
        closeButton.onclick = () => hidePopup(popup);
        popup.appendChild(closeButton);
    }

    // Add event listener to close popup when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target) && event.target !== element && !event.target.classList.contains('close-popup')) {
            hidePopup(popup);
        }
    });
}

// Function to hide the popup
function hidePopup(popup) {
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Template section for adding albums to website
const albums = [
    {
        title: "Abbey Road",
        artist: "The Beatles",
        date: "1969-09-26",
        genres: "#rock, #classic",
        art: "#photograph",
        imgSrc: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg?20230207113016g",
        notes: "One of the most famous album covers ever."
    },
    {
        title: "Dark Side of the Moon",
        artist: "Pink Floyd",
        date: "1973-03-01",
        genres: "#rock, #progressive",
        art: "#minimal",
        imgSrc: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
        notes: "A classic progressive rock album."
    },
    {
        title: "Rumours",
        artist: "Fleetwood Mac",
        date: "1977-02-04",
        genres: "#soft rock",
        art: "#photograph, #black and white",
        imgSrc: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
        notes: "My mother's favorite album."
    },
    {
        title: "Thriller",
        artist: "Michael Jackson",
        date: "1982-11-30",
        genres: "#pop, #80s",
        art: "#iconic",
        imgSrc: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
        notes: "The best-selling album of all time."
    },
];

// Function to generate the HTML for each album in the array
function generateAlbumHTML(album) {
    const sortedGenres = album.genres.split(',').map(tag => tag.trim()).sort().join(', ');
    const sortedArt = album.art.split(',').map(tag => tag.trim()).sort().join(', ');

    return `
        <div class="album" data-title="${album.title}" data-artist="${album.artist}" data-date="${album.date}" data-genres="${album.genres}" data-art="${album.art}">
            <img src="${album.imgSrc}" alt="${album.title}" onmouseover="showHoverPopup(this)" onclick="showPopup(this)">
            <div class="popup hover-popup">
                <img src="${album.imgSrc}" alt="${album.title}">
                <p><strong>Album:</strong> ${album.title}</p>
                <p><strong>Artist:</strong> ${album.artist}</p>
                <p><strong>Release Date:</strong> ${album.date}</p>
                <p><strong>Notes:</strong> ${album.notes}</p>
                <p><strong>Genre Tags:</strong> ${sortedGenres}</p>
                <p><strong>Art Tags:</strong> ${sortedArt}</p>
            </div>
            <div class="popup center-popup">
                <img src="${album.imgSrc}" alt="${album.title}">
                <p><strong>Album:</strong> ${album.title}</p>
                <p><strong>Artist:</strong> ${album.artist}</p>
                <p><strong>Release Date:</strong> ${album.date}</p>
                <p><strong>Notes:</strong> ${album.notes}</p>
                <p><strong>Genre Tags:</strong> ${sortedGenres}</p>
                <p><strong>Art Tags:</strong> ${sortedArt}</p>
                <span class="close-popup" onclick="hidePopup(this)">X</span>
            </div>
        </div>
    `;
}

// Function to populate the album grid with the albums in the array
function populateAlbumGrid() {
    const grid = document.getElementById('album-grid');
    grid.innerHTML = albums.map(generateAlbumHTML).join('');
}

// Function to populate the filter options based on the genre and art tags of the albums
function populateFilterOptions() {
    const albums = document.getElementsByClassName('album');
    const tags = new Set();

    Array.from(albums).forEach(album => {
        const genres = album.getAttribute('data-genres').split(',').map(tag => tag.trim().replace('#', ''));
        const art = album.getAttribute('data-art').split(',').map(tag => tag.trim().replace('#', ''));
        genres.concat(art).forEach(tag => tags.add(tag));
    });

    const filterSelect = document.getElementById('filter-tags');
    filterSelect.innerHTML = '';

    Array.from(tags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filterSelect.appendChild(option);
    });

    $(filterSelect).select2({
        placeholder: "Select tags",
        allowClear: true,
        closeOnSelect: false,
        dropdownCssClass: 'dark-dropdown custom-select2'
    }).on('change', filterAlbums); 
}

// Function to toggle the visibility of the toolbar
function toggleToolbar() {
    const toolbarContent = document.getElementById('toolbar-content');
    const toggleBtn = document.getElementById('toggle-toolbar-btn');
    if (toolbarContent.style.display === 'none') {
        toolbarContent.style.display = 'flex';
        toggleBtn.textContent = '▼ Close Toolbar';
    } else {
        toolbarContent.style.display = 'none';
        toggleBtn.textContent = '▲ Open Toolbar';
    }
}

// Function to toggle the visibility of the info popup
function toggleInfoPopup() {
    const infoPopup = document.getElementById('info-popup');
    if (infoPopup.style.display === 'none' || infoPopup.style.display === '') {
        infoPopup.style.display = 'block';
    } else {
        infoPopup.style.display = 'none';
    }
}

// Function to update the grid width based on the input value
function updateGridWidth(value) {
    const grid = document.getElementById('album-grid');
    grid.style.gridTemplateColumns = `repeat(${value}, 1fr)`;
}

// The following code is used to ensure that the script is executed after the HTML has been loaded.
document.addEventListener('DOMContentLoaded', () => {
    // Populate the album grid and filter options
    populateAlbumGrid();
    populateFilterOptions();
    
});