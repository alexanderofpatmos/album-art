import albums from './albumData.js';

// Example usage
const hoverPopups = document.querySelectorAll('.popup.hover-popup');
hoverPopups.forEach(popup => forceRepaint(popup));

// ----------------------------------------
// Section: Page Load
// ----------------------------------------

// Ensure that the script is executed after the HTML has been loaded.
document.addEventListener('DOMContentLoaded', () => {
    showSection('background'); // Show the background section by default in the info popup
    populateAlbumGrid();
    populateFilterOptions(); 
    initializePopups(); // Call initializePopups to remove close buttons from hover popups
    document.getElementById('year-range-start').addEventListener('input', filterByYearRange);
    document.getElementById('year-range-end').addEventListener('input', filterByYearRange);
    setTimeout(() => {
        $('.select2-selection__placeholder').css('font-family', "'Times New Roman', Times, serif");
    }, 100);
});

// ----------------------------------------
// Section: Album Data
// ----------------------------------------

// Function to generate the HTML for each album in the array
function generateAlbumHTML(album) {
    // Sort and join genres and art tags
    const sortedGenres = album.genres.split(',').map(tag => tag.trim()).sort().join(', ');
    const sortedArt = album.art.split(',').map(tag => tag.trim()).sort().join(', ');

    // Initialize hoverPopupHTML as an empty string
    let hoverPopupHTML = '';
    // If album notes exist, generate the hover popup HTML
    if (album.notes) {
        hoverPopupHTML = `
            <div class="popup hover-popup">
                <img src="${album.imgSrc}" alt="${album.title}">
                <p><strong>Album:</strong> ${album.title}</p>
                <p><strong>Artist:</strong> ${album.artist}</p>
                <p><strong>Release Date:</strong> ${album.date}</p>
                <p><strong>Genre Tags:</strong> ${sortedGenres}</p>
                <p><strong>Art Tags:</strong> ${sortedArt}</p>
            </div>
        `;
    }

    // Return the HTML for the album, including hover and center popups
    return `
        <div class="album" data-title="${album.title}" data-artist="${album.artist}" data-date="${album.date}" data-genres="${album.genres}" data-art="${album.art}">
            <img src="${album.imgSrc}" alt="${album.title}" onmouseover="showHoverPopup(this)" onmouseout="hideHoverPopup(this)" onclick="showPopup(this)">
            ${hoverPopupHTML} <!-- Insert hover popup HTML if it exists -->
            <div class="popup center-popup">
                <img src="${album.imgSrc}" alt="${album.title}">
                <p><strong>Album:</strong> ${album.title}</p>
                <p><strong>Artist:</strong> ${album.artist}</p>
                <p><strong>Release Date:</strong> ${album.date}</p>
                <p><strong>Genre Tags:</strong> ${sortedGenres}</p>
                <p><strong>Art Tags:</strong> ${sortedArt}</p>
                <p><strong>Notes:</strong> ${album.notes}</p>
                <span class="close-popup" onclick="hidePopup(this)">X</span> <!-- Close button only in center popup -->
            </div>
        </div>
    `;
}

// Function to populate the album grid with the albums in the array
function populateAlbumGrid() {
    const grid = document.getElementById('album-grid');
    grid.innerHTML = albums.map(generateAlbumHTML).join('');
}

// ----------------------------------------
// Section: Toolbar
// ----------------------------------------

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

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for hover events
    document.querySelector('footer').addEventListener('mouseenter', showToolbar);
    document.querySelector('footer').addEventListener('mouseleave', hideToolbar);
});

// Function to show the toolbar
function showToolbar() {
    const toolbarContent = document.getElementById('toolbar-content');
    const toggleBtn = document.getElementById('toggle-toolbar-btn');
    toolbarContent.style.display = 'flex';
    toggleBtn.textContent = '▼ Close Toolbar';
}

// Function to hide the toolbar
function hideToolbar() {
    const toolbarContent = document.getElementById('toolbar-content');
    const toggleBtn = document.getElementById('toggle-toolbar-btn');
    toolbarContent.style.display = 'none';
    toggleBtn.textContent = '▲ Open Toolbar';
}

// ----------------------------------------
// Subsection: "Sort" Tool
// ----------------------------------------

let sortOrderAsc = true; // To track the current sort order

// Function to sort the albums based on the selected sort option.
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

// ----------------------------------------
// Subsection: "Filter by Tag" Tool
// ----------------------------------------

// Function to populate the filter options based on the genre and art tags of the albums
function populateFilterOptions() {
    const albums = document.getElementsByClassName('album');
    const tags = new Set();

        // Collect all unique tags from the albums
        Array.from(albums).forEach(album => {
            const genres = album.getAttribute('data-genres').split(',').map(tag => tag.trim().replace('#', ''));
            const art = album.getAttribute('data-art').split(',').map(tag => tag.trim().replace('#', ''));
            genres.concat(art).forEach(tag => tags.add(tag));
        });

        const filterSelect = document.getElementById('filter-tags');
        filterSelect.innerHTML = '';

        // Populate the filter select element with the collected tags
        Array.from(tags).sort().forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            filterSelect.appendChild(option);
        });

        // Initialize the select2 plugin for the filter select element
        $(filterSelect).select2({
            placeholder: "Select tags",
            allowClear: true,
            closeOnSelect: false,
            dropdownCssClass: 'dark-dropdown custom-select2',
            containerCssClass: 'select2-container--times-new-roman'
        }).on('change', filterAlbums);
    }
    
    // Function to filter the albums based on the selected tags.
    function filterAlbums() {
        const selectedOptions = Array.from(document.getElementById('filter-tags').selectedOptions).map(option => option.value.toLowerCase());
        const albums = document.getElementsByClassName('album');
    
        // Loop through each album and check if it matches the selected tags
        Array.from(albums).forEach(album => {
            const genres = album.getAttribute('data-genres').toLowerCase().split(',').map(g => g.trim().replace('#', ''));
            const arts = album.getAttribute('data-art').toLowerCase().split(',').map(a => a.trim().replace('#', ''));
            const allTags = [...genres, ...arts];
            const match = selectedOptions.length === 0 || selectedOptions.every(filter => allTags.some(tag => tag.includes(filter)));
            album.style.display = match ? 'block' : 'none';
        });
    }

// Function to populate the filter options based on the genre and art tags of the albums
function populateFilterOptions() {
    const albums = document.getElementsByClassName('album');
    const tags = new Set();

    // Collect all unique tags from the albums
    Array.from(albums).forEach(album => {
        const genres = album.getAttribute('data-genres').split(',').map(tag => tag.trim().replace('#', ''));
        const art = album.getAttribute('data-art').split(',').map(tag => tag.trim().replace('#', ''));
        genres.concat(art).forEach(tag => tags.add(tag));
    });

    const filterSelect = document.getElementById('filter-tags');
    filterSelect.innerHTML = '';

    // Populate the filter select element with the collected tags
    Array.from(tags).sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filterSelect.appendChild(option);
    });

    // Initialize the select2 plugin for the filter select element
    $(filterSelect).select2({
        placeholder: "Select tags",
        allowClear: true,
        closeOnSelect: false,
        dropdownCssClass: 'dark-dropdown custom-select2',
        containerCssClass: 'select2-container--times-new-roman'
    }).on('change', filterAlbums);
}

// ----------------------------------------
// Subsection: "Search" Tool
// ----------------------------------------

// Function to search for albums based on the search term.
function searchAlbums() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const albums = document.getElementsByClassName('album');

    // Loop through each album and check if it matches the search term
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

// ----------------------------------------
// Subsection: "Year Range" Tool
// ----------------------------------------

// Function to filter the albums based on the specified year range.
function filterByYearRange() {
    const startYear = parseInt(document.getElementById('year-range-start').value, 10);
    const endYear = parseInt(document.getElementById('year-range-end').value, 10);
    const albums = document.getElementsByClassName('album');

    Array.from(albums).forEach(album => {
        const albumYear = parseInt(album.getAttribute('data-date').split('-')[0], 10);
        if ((!isNaN(startYear) && albumYear < startYear) || (!isNaN(endYear) && albumYear > endYear)) {
            album.style.display = 'none';
        } else {
            album.style.display = 'block';
        }
    });
}

// The purpose of lines 301-319 is to ensure that the year range boxes are initialized with the correct values.
document.addEventListener('DOMContentLoaded', () => {
    initializePopups();

    // Add event listener for the "End" Year Range box
    const endYearInput = document.getElementById('year-range-end');
    endYearInput.addEventListener('focus', () => {
        if (endYearInput.value === '') {
            endYearInput.value = '2030';
        }
    });
    endYearInput.addEventListener('input', filterByYearRange);

    // Add event listener for the "Start" Year Range box
    const startYearInput = document.getElementById('year-range-start');
    startYearInput.addEventListener('focus', () => {
        if (startYearInput.value === '') {
            startYearInput.value = '1950';
        }
    });
    startYearInput.addEventListener('input', filterByYearRange);
});

// ----------------------------------------
// Subsection: "Grid Width" Tool
// ----------------------------------------

// Function to update the grid width based on the input value
function updateGridWidth(value) {
    const grid = document.getElementById('album-grid');
    const columns = 14 - value; // Reverse the value: 1 -> 13, 10 -> 4
    grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

// ----------------------------------------
// Section: Popups
// ----------------------------------------

// Function to show and hide popups when clicking on album images
function showPopup(element) {
    const popup = element.nextElementSibling.nextElementSibling; // Ensure this targets the center popup
    const allPopups = document.querySelectorAll('.popup.center-popup');
    allPopups.forEach(p => p.style.display = 'none'); // Hide all center popups
    popup.style.display = 'block';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '60%'; // Ensure larger size for clicked popup
    document.body.style.overflow = 'hidden';

    // Add close button to the center popup if it doesn't exist
    if (!popup.querySelector('.close-popup') && popup.classList.contains('center-popup')) {
        const closeButton = document.createElement('span');
        closeButton.className = 'close-popup';
        closeButton.textContent = 'X';
        closeButton.onclick = () => hidePopup(closeButton);
        popup.appendChild(closeButton);
    }

    // Add event listener to close popup when clicking outside of it
    document.addEventListener('click', closeCenterPopupOnClickOutside);
}

// Function to close the center popup when clicking outside of it
function closeCenterPopupOnClickOutside(event) {
    const popup = document.querySelector('.popup.center-popup[style*="display: block"]');
    if (popup && !popup.contains(event.target) && !event.target.closest('.album img')) {
        hidePopup(popup.querySelector('.close-popup'));
        document.removeEventListener('click', closeCenterPopupOnClickOutside);
    }
}

// Function to close the center popup
function hidePopup(element) {
    const popup = element.closest('.popup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Function to initialize popups and remove close buttons from all popups
function initializePopups() {
    const allPopups = document.querySelectorAll('.popup');
    allPopups.forEach(popup => {
        const closeButton = popup.querySelector('.close-popup');
        if (closeButton) {
            closeButton.remove();
        }
    });
}

// Call initializePopups on page load
document.addEventListener('DOMContentLoaded', initializePopups);

// ----------------------------------------
// Section: Help Popup
// ----------------------------------------

// Function to show the help popup
function showHelpPopup() {
    const helpPopup = document.querySelector('.help-popup');
    helpPopup.style.display = 'block';
}

// Function to hide the help popup
function hideHelpPopup() {
    document.querySelector('.help-popup').style.display = 'none';
}

// ----------------------------------------
// Section: Info Popup "ABOUT THIS WEBSITE"
// ----------------------------------------

// Function to toggle the visibility of the info popup
function toggleInfoPopup() {
    const infoPopup = document.getElementById('info-popup');
    if (infoPopup.style.display === 'none' || infoPopup.style.display === '') {
        infoPopup.style.display = 'block';
        document.addEventListener('click', closeInfoPopupOnClickOutside);

        // Add close button to the info popup if it doesn't exist
        if (!infoPopup.querySelector('.close-popup')) {
            const closeButton = document.createElement('span');
            closeButton.className = 'close-popup';
            closeButton.textContent = 'X';
            closeButton.onclick = () => {
                infoPopup.style.display = 'none';
                document.removeEventListener('click', closeInfoPopupOnClickOutside);
            };
            infoPopup.appendChild(closeButton);
        }
    } else {
        infoPopup.style.display = 'none';
        document.removeEventListener('click', closeInfoPopupOnClickOutside);
    }
}

// Function to close the info popup when clicking outside of it
function closeInfoPopupOnClickOutside(event) {
    const infoPopup = document.getElementById('info-popup');
    if (!infoPopup.contains(event.target) && event.target !== document.querySelector('.info-icon')) {
        infoPopup.style.display = 'none';
        document.removeEventListener('click', closeInfoPopupOnClickOutside);
    }
}

// Function to show and hide sections in the info popup
function showSection(sectionId) {
    const sections = document.querySelectorAll('.popup-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// ----------------------------------------
// Section: Hover Popups
// ----------------------------------------

// Function to show hover popup when hovering over album image
function showHoverPopup(element) {
    const popup = element.nextElementSibling;
    popup.style.display = 'block';
}

// Function to hide hover popup when cursor leaves album image
function hideHoverPopup(element) {
    const popup = element.nextElementSibling;
    popup.style.display = 'none';
}